import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import authService from '../services/authService';
import apiService from '../services/apiService';
import useErrorHandler from '../hooks/useErrorHandler';
import { FieldWithError } from './ErrorMessage';
import { useAuthToast } from '../contexts/ToastContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const googleBtnRef = React.useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const redirectByRole = (user) => {
    const role = user?.role;
    if (role === 'producteur') return navigate('/producer/dashboard');
    if (role === 'livreur') return navigate('/delivery/dashboard');
    if (role === 'admin') return navigate('/admin/dashboard');
    // Default: consumer stays on site home
    return navigate('/');
  };

  // Gestionnaires d'erreurs et notifications
  const { 
    errors, 
    isSubmitting, 
    clearErrors, 
    setFieldError, 
    validateField, 
    handleApiError, 
    setLoading 
  } = useErrorHandler();
  const toast = useAuthToast();

  // Vérifier si l'utilisateur vient de vérifier son email
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const token = urlParams.get('token');
    
    if (verified === 'true' && token) {
      // Traiter la vérification d'email
      handleEmailVerification(token);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validation en temps réel
    if (name === 'identifier' || name === 'password') {
      const validationRules = {
        identifier: { required: true },
        password: { required: true }
      };

      const error = validateField(name, value, validationRules[name]);
      if (error) {
        setFieldError(name, error);
      } else {
        clearErrors();
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEmailVerification = async (token) => {
    try {
      const result = await authService.verifyEmail(token);
      
      if (result.status === 'success') {
        toast.showSuccess(
          'Votre compte a été vérifié avec succès ! Vous êtes maintenant connecté.',
          {
            title: 'Vérification réussie',
            duration: 6000
          }
        );
        
        if (onSuccess) {
          onSuccess(result.data.user);
        }
        // Redirect based on role
        redirectByRole(result.data.user);
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      const { errorMessage } = handleApiError(error, 'verify-email');
      toast.showError(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    const validationRules = {
      identifier: { required: true },
      password: { required: true }
    };

    const identifierError = validateField('identifier', formData.identifier, validationRules.identifier);
    const passwordError = validateField('password', formData.password, validationRules.password);

    if (identifierError || passwordError) {
      toast.showError('Veuillez remplir tous les champs correctement');
      return;
    }

    setLoading(true);
    clearErrors();

    // Afficher un toast de chargement
    const loadingToastId = toast.showLoading('Connexion en cours...');

    // Normaliser l'identifiant (email ou téléphone)
    const normalizeIdentifier = (val) => {
      const raw = String(val || '').trim();
      // Si c'est un email, laisser tel quel
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
      if (isEmail) return raw.toLowerCase();
      // Sinon, considérer comme téléphone: enlever espaces et ponctuation
      const digits = raw.replace(/[^0-9+]/g, '');
      // Déjà en E.164
      if (digits.startsWith('+') && digits.length >= 8) return digits;
      // Heuristique Sénégal (+221): enlever 0 initial, préfixer +221 si longueur 9
      let onlyDigits = digits.replace(/\D/g, '');
      if (onlyDigits.startsWith('0')) onlyDigits = onlyDigits.slice(1);
      if (onlyDigits.length === 9) return `+221${onlyDigits}`;
      // Sinon, renvoyer tel quel (le backend décidera)
      return digits || raw;
    };

    try {
      const result = await authService.login({
        identifier: normalizeIdentifier(formData.identifier),
        password: formData.password
      });
      
      if (result.status === 'success') {
        // Supprimer le toast de chargement
        toast.removeToast(loadingToastId);
       
        
        // Mettre à jour l'authentification immédiatement
        if (onSuccess) {
          onSuccess(result.data.user);
        }
        // Rediriger selon le rôle
        redirectByRole(result.data.user);
        
        // Fermer le modal
        onClose();
      }
    } catch (error) {
      // Supprimer le toast de chargement
      toast.removeToast(loadingToastId);
      
      // Gérer les erreurs avec le système centralisé
      const { errorMessage, fieldErrors } = handleApiError(error, 'login');
      
      // Afficher les erreurs de champ spécifiques
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        Object.keys(fieldErrors).forEach(field => {
          setFieldError(field, fieldErrors[field]);
        });
      }
      
      toast.showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredentialResponse = async (resp) => {
    if (!resp?.credential) return;
    const loadingToastId = toast.showLoading('Connexion Google...');
    try {
      const result = await apiService.loginWithGoogle(resp.credential);
      toast.removeToast(loadingToastId);
      if (result.status === 'success') {
        if (onSuccess) onSuccess(result.data.user);
        redirectByRole(result.data.user);
        onClose();
      }
    } catch (error) {
      toast.removeToast(loadingToastId);
      const { errorMessage } = handleApiError(error, 'login');
      toast.showError(errorMessage || 'Échec de la connexion Google');
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const ensureScript = () => new Promise((resolve) => {
      if (window.google && window.google.accounts && window.google.accounts.id) return resolve();
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      document.head.appendChild(s);
    });
    let cancelled = false;
    (async () => {
      await ensureScript();
      if (cancelled) return;
      if (!googleClientId || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          shape: 'rectangular'
        });
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Connexion AgriTeranga</h2>
            <p className="text-gray-600 mt-1">Connectez-vous à votre compte pour accéder à tous les services.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center justify-center mb-6">
              <img src={logo} alt="Logo AgriTeranga" className="w-60 h-20 object-contain" />
            </div>
          </div>

          {/* Message d'erreur général */}
          {errors.general && (
            <div className="mb-6">
              <div className="p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Phone Field avec validation */}
            <FieldWithError
              label="Email ou téléphone"
              name="identifier"
              error={errors.identifier}
              required
              helpText="Utilisez votre email ou numéro de téléphone pour vous connecter"
            >
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 border-[#2D5F3F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5F3F] focus:border-transparent ${
                  errors.identifier ? 'border-red-500' : ''
                }`}
                placeholder="votre@email.com ou +221 77 123 44 55"
              />
            </FieldWithError>

            {/* Password Field avec validation */}
            <FieldWithError
              label="Mot de passe"
              name="password"
              error={errors.password}
              required
              helpText="Mot de passe de votre compte AgriTeranga"
            >
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 border-[#2D5F3F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5F3F] focus:border-transparent ${
                  errors.password ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
              />
            </FieldWithError>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2D5F3F] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#234a32] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Connexion...' : 'Connexion'}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-black hover:text-[#2D5F3F] transition-colors"
                onClick={() => {
                  // Logique de mot de passe oublié
                  console.log('Mot de passe oublié');
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Separator */}
            <div className="text-center text-sm text-black">
              ou connectez-vous avec
            </div>

            {/* Google Login Button (rendered by GIS) */}
            <div className="w-full flex items-center justify-center">
              <div ref={googleBtnRef} />
            </div>
            {!googleClientId && (
              <p className="text-xs text-center text-red-600">VITE_GOOGLE_CLIENT_ID manquant</p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-[#2D5F3F] px-8 py-4 rounded-b-lg">
          <p className="text-white text-center text-sm">
            Pas encore de compte ?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-green-300 hover:text-white font-semibold transition-colors underline"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
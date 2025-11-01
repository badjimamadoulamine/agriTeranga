import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import useErrorHandler from '../../hooks/useErrorHandler';
import { useAuthToast } from '../../contexts/ToastContext';

const DeliveryLogin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { errors, isSubmitting, clearErrors, setFieldError, validateField, handleApiError, setLoading } = useErrorHandler();
  const toast = useAuthToast();

  const onSubmit = async (e) => {
    e.preventDefault();

    const idErr = validateField('identifier', identifier, { required: true });
    const pwErr = validateField('password', password, { required: true });
    if (idErr || pwErr) {
      if (idErr) setFieldError('identifier', idErr);
      if (pwErr) setFieldError('password', pwErr);
      return;
    }

    setLoading(true);
    clearErrors();
    const loadingId = toast.showLoading('Connexion livreur...');
    try {
      const resp = await apiService.dashboardLogin(identifier.trim(), password, 'delivery');
      if (resp && resp.status === 'success') {
        toast.removeToast(loadingId);
        toast.showSuccess('Bienvenue, redirection vers votre tableau de bord...');
        navigate('/delivery/dashboard');
      }
    } catch (error) {
      toast.removeToast(loadingId);
      const { errorMessage, fieldErrors } = handleApiError(error, 'login');
      if (fieldErrors) {
        Object.keys(fieldErrors).forEach((k) => setFieldError(k, fieldErrors[k]));
      }
      toast.showError(errorMessage || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Connexion Livreur</h1>
        <p className="text-sm text-gray-600 mb-6">Accédez à votre espace de livraison</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email ou téléphone</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.identifier ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="email ou téléphone"
            />
            {errors.identifier && <p className="text-sm text-red-600 mt-1">{errors.identifier}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryLogin;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuthToast } from '../../contexts/ToastContext';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useAuthToast();
  const navigate = useNavigate();

  const normalizeIdentifier = (val) => {
    const raw = String(val || '').trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
    if (isEmail) return raw.toLowerCase();
    const digits = raw.replace(/[^0-9+]/g, '');
    if (digits.startsWith('+') && digits.length >= 8) return digits;
    let onlyDigits = digits.replace(/\D/g, '');
    if (onlyDigits.startsWith('0')) onlyDigits = onlyDigits.slice(1);
    if (onlyDigits.length === 9) return `+221${onlyDigits}`;
    return digits || raw;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.showError('Veuillez saisir vos identifiants');
      return;
    }
    setSubmitting(true);
    const loadingId = toast.showLoading('Connexion administrateur...');
    try {
      const res = await authService.login({ identifier: normalizeIdentifier(identifier), password });
      toast.removeToast(loadingId);
      if (res?.status === 'success') {
        if (res?.data?.user?.role !== 'admin' && res?.data?.user?.isSuperAdmin !== true) {
          toast.showError('Cet espace est réservé aux administrateurs.');
          return;
        }
        toast.showSuccess('Connexion admin réussie');
        // Enregistrer une copie séparée pour l’admin si besoin
        try { localStorage.setItem('adminDashboardUser', JSON.stringify(res.data.user)); } catch {}
        navigate('/admin/dashboard');
      } else {
        toast.showInfo(res?.message || 'Échec de la connexion');
      }
    } catch (err) {
      toast.removeToast(loadingId);
      toast.showError(err?.message || 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Connexion Administrateur</h1>
            <p className="text-sm text-gray-600 mb-6">Accédez au tableau de bord d'administration.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ou Téléphone</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="admin@agriteranga.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-green-700 hover:text-green-900 underline">← Retour à la page principale</Link>
            </div>
      </div>
    </div>
  );
};

export default AdminLogin;

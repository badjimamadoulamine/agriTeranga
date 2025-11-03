import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuthToast } from '../contexts/ToastContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useAuthToast();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!password || password.length < 8) {
      toast.showError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (password !== confirm) {
      toast.showError('La confirmation ne correspond pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const loadingId = toast.showLoading('Réinitialisation en cours...');
    try {
      const res = await apiService.resetPassword(token, password);
      toast.removeToast(loadingId);
      if (res?.status === 'success') {
        toast.showSuccess('Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.');
        navigate('/login');
      } else {
        toast.showInfo(res?.message || 'Impossible de réinitialiser le mot de passe');
      }
    } catch (err) {
      toast.removeToast(loadingId);
      toast.showError(err?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Réinitialiser le mot de passe</h1>
        <p className="text-sm text-gray-600 mb-6">Saisissez votre nouveau mot de passe ci-dessous.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5F3F]"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#2D5F3F] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#234a32] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

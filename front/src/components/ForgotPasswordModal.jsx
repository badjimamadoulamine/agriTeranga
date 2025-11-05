import React, { useState } from 'react';
import apiService from '../services/apiService';
import useErrorHandler from '../hooks/useErrorHandler';
import { useAuthToast } from '../contexts/ToastContext';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const { errors, validateField, clearErrors, setFieldError, handleApiError, isSubmitting, setLoading } = useErrorHandler();
  const toast = useAuthToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple email
    const emailError = validateField('email', email, { required: true, pattern: /[^\s@]+@[^\s@]+\.[^\s@]+/ });
    if (emailError) {
      setFieldError('email', emailError);
      return;
    }

    setLoading(true);
    const loadingToastId = toast.showLoading('Envoi de l\'email de réinitialisation...');
    try {
      const res = await apiService.forgotPassword(String(email).trim().toLowerCase());
      toast.removeToast(loadingToastId);

      if (res?.status === 'success') {
        toast.showSuccess('Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.');
        onClose();
      } else {
        toast.showInfo(res?.message || "Vérifiez votre email. Si l'adresse est connue, vous recevrez un lien.");
      }
    } catch (error) {
      toast.removeToast(loadingToastId);
      const { errorMessage } = handleApiError(error, 'forgot-password');
      toast.showError(errorMessage || "Échec de l'envoi de l'email de réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Mot de passe oublié</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4">
            Saisissez votre adresse email. Si elle est associée à un compte, vous recevrez un lien de réinitialisation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5F3F] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="votre@email.com"
                autoFocus
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#2D5F3F] text-white rounded-lg hover:bg-[#234a32] disabled:opacity-50">
                Envoyer le lien
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

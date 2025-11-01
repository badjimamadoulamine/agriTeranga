import React, { useState } from 'react';

const WavePaymentModal = ({ isOpen, onClose, amount, customerInfo, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'processing', 'success'

  if (!isOpen) return null;

  const formatPhoneNumber = (value) => {
    // Enlever tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    
    // Limiter à 9 chiffres (numéro Wave Sénégal)
    if (numbers.length <= 9) {
      setPhoneNumber(numbers);
    }
  };

  const validatePhoneNumber = () => {
    return phoneNumber.length === 9 && phoneNumber.startsWith('7');
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber()) {
      return; // Ne fait rien si le numéro est invalide
    }

    setIsProcessing(true);
    setStep('processing');

    // Simulation du processus de paiement - toujours succès
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success'); // Toujours succès
    }, 3000);
  };

  const handleClose = () => {
    setPhoneNumber('');
    setStep('input');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 shadow-2xl relative overflow-hidden">
        {/* Header avec logo Wave */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">W</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Wave</h3>
                <p className="text-green-100 text-sm">Paiement Mobile Money</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Étape 1: Saisie du numéro */}
          {step === 'input' && (
            <>
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Numéro Wave
                </h4>
                <p className="text-gray-600 text-sm">
                  Entrez votre numéro Wave à 9 chiffres
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">+221</span>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => formatPhoneNumber(e.target.value)}
                    placeholder="7XX XXX XXX"
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    maxLength={9}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 7XX XXX XXX (commence par 7)
                </p>
              </div>

              {/* Récapitulatif du montant */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Montant à payer:</span>
                  <span className="text-xl font-bold text-green-600">
                    {amount.toLocaleString('fr-FR')} CFA
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!validatePhoneNumber()}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  validatePhoneNumber()
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Payer {amount.toLocaleString('fr-FR')} CFA
              </button>
            </>
          )}

          {/* Étape 2: Traitement */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Traitement du paiement...
              </h4>
              <p className="text-gray-600 text-sm">
                Veuillez confirmer la transaction sur votre téléphone Wave
              </p>
              
              {/* Instructions */}
              <div className="mt-6 bg-green-50 rounded-lg p-4 text-left">
                <h5 className="font-medium text-green-800 mb-2">Instructions:</h5>
                <ol className="text-sm text-green-700 space-y-1">
                  <li>1. Ouvrez votre application Wave</li>
                  <li>2. Allez dans "Transactions"</li>
                  <li>3. Confirmez le débit de {amount.toLocaleString('fr-FR')} CFA</li>
                </ol>
              </div>
            </div>
          )}

          {/* Étape 3: Succès */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Paiement réussi !
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Votre paiement de {amount.toLocaleString('fr-FR')} CFA a été confirmé.
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="text-sm">
                  <p className="font-medium text-green-800">Référence transaction:</p>
                  <p className="text-green-600 font-mono">
                    WAV-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSuccess) onSuccess();
                  handleClose();
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WavePaymentModal;
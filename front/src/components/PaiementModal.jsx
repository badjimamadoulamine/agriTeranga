import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import waveImg from "../assets/wave.jpg";
import cashImg from "../assets/cash.jpg";
import WavePaymentModal from "./WavePaymentModal";
import { useCart } from "../contexts/CartContext";

const PaiementModal = ({ isOpen, onClose, onBack, deliveryFee = 0 }) => {
  const [selected, setSelected] = useState(null);
  const [showWavePayment, setShowWavePayment] = useState(false);
  const navigate = useNavigate();
  const { getTotalPrice } = useCart();
  const productsTotal = getTotalPrice();
  const totalToPay = productsTotal + (Number(deliveryFee) || 0);

  if (!isOpen) return null;

  const handleConfirmation = () => {
    if (!selected) return;

    if (selected === "wave") {
      // Ouvrir le modal de paiement Wave
      setShowWavePayment(true);
    } else if (selected === "cash") {
      // Pour Cash, on redirige vers la page de livraison
      onClose(); // Fermer le modal d'abord
      navigate('/livraison'); // Rediriger vers la page de livraison
    }
  };

  const handleWavePaymentClose = () => {
    setShowWavePayment(false);
    onClose();
  };

  const handleWavePaymentSuccess = () => {
    setShowWavePayment(false);
    onClose();
    // Rediriger vers la page de confirmation ou livraison
    navigate('/livraison');
  };

  return (
    <>
      {/* Modal de sélection du moyen de paiement */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
          {/* Bouton retour */}
          <button
            onClick={() => (onBack ? onBack() : onClose())}
            className="absolute top-2 left-3 text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Retour"
          >
            ←
          </button>
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>

          <h2 className="text-xl font-bold mb-4 text-green-700 text-center">
            Choisis ton moyen de paiement
          </h2>

          {/* Images des moyens de paiement */}
          <div className="flex justify-center gap-6 mb-6">
            <img
              src={waveImg}
              alt="Wave"
              onClick={() => setSelected("wave")}
              className={`w-20 h-20 border-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selected === "wave"
                  ? "border-green-600 scale-105"
                  : "border-gray-200 hover:scale-105"
              }`}
            />
            <img
              src={cashImg}
              alt="Cash"
              onClick={() => setSelected("cash")}
              className={`w-20 h-20 border-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selected === "cash"
                  ? "border-green-600 scale-105"
                  : "border-gray-200 hover:scale-105"
              }`}
            />
          </div>

          {/* Description du paiement cash */}
          {selected === "cash" && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                Paiement à la livraison - Vous paierez lorsque votre commande sera livrée
              </p>
            </div>
          )}

          {/* Description du paiement Wave */}
          {selected === "wave" && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                Paiement mobile Money - Transaction sécurisée via Wave
              </p>
            </div>
          )}

          

          {/* Bouton d'action */}
          <button
            disabled={!selected}
            onClick={handleConfirmation}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              selected
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {selected === "wave"
              ? "Finalise ton paiement"
              : selected === "cash"
              ? "Lance ta commande"
              : "Choisis un moyen de paiement"}
          </button>
        </div>
      </div>

      {/* Modal de paiement Wave */}
      <WavePaymentModal
        isOpen={showWavePayment}
        onClose={handleWavePaymentClose}
        onBack={() => setShowWavePayment(false)}
        amount={totalToPay}
        customerInfo={{}}
        onSuccess={handleWavePaymentSuccess}
      />
    </>
  );
};

export default PaiementModal;
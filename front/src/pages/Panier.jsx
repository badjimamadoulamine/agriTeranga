import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import CommandeModal from '../components/CommandeModal';
import PaiementModal from '../components/PaiementModal';
import ClearCartModal from '../components/ClearCartModal';

const Panier = ({ onOpenRegister, onOpenLogin }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaiementOpen, setIsPaiementOpen] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

  // 🔹 Gérer le changement de quantité
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // 🔹 Vider le panier - maintenant ouvre le modal
  const handleClearCart = () => {
    setIsClearCartModalOpen(true);
  };

  // 🔹 Confirmer le vidage du panier
  const confirmClearCart = () => {
    clearCart();
    setIsClearCartModalOpen(false);
  };

  // 🔹 Validation du formulaire de commande
  const handleSubmitCommande = (data) => {
    setDeliveryFee(Number(data?.deliveryFee || 0));
    setDeliveryInfo(data?.deliveryInfo || null);
    setIsModalOpen(false);
    setIsPaiementOpen(true); // 🔥 Ouvre le modal de paiement après validation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenRegister={onOpenRegister} onOpenLogin={onOpenLogin} />

      {/* Modal de commande */}
      <CommandeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitCommande}
      />

      {/* 🔹 Modal de paiement */}
      <PaiementModal
        isOpen={isPaiementOpen}
        onClose={() => setIsPaiementOpen(false)}
        onBack={() => { setIsPaiementOpen(false); setIsModalOpen(true); }}
        deliveryFee={deliveryFee}
        deliveryInfo={deliveryInfo}
      />

      {/* 🔹 Modal de confirmation pour vider le panier */}
      <ClearCartModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        onConfirm={confirmClearCart}
      />

      {/* Contenu du panier */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* En-tête */}
          <div className="px-6 py-4 bg-green-600 text-white">
            <h1 className="text-2xl font-bold">Mon Panier</h1>
            <p className="text-green-100">
              {cartItems.length > 0
                ? `${cartItems.reduce((total, item) => total + item.quantity, 0)} article(s) dans votre panier`
                : 'Votre panier est vide'}
            </p>
          </div>

          {/* Corps */}
          <div className="p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-24 w-24 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v8a2 2 0 002 2h10a2 2 0 002-2v-8m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Votre panier est vide</h3>
                <p className="mt-2 text-gray-500">Ajoutez des produits pour commencer vos achats</p>
                <Link
                  to="/products"
                  className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Continuer les achats
                </Link>
              </div>
            ) : (
              <>
                {/* Liste des produits */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{item.imageFallback || '🥬'}</span>
                      </div>

                      {/* Détails */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.nom}</h3>
                        <p className="text-green-600 font-medium">
                          {parseFloat(item.prix).toLocaleString('fr-FR')} CFA / {item.unite || 'kg'}
                        </p>
                        <p className="text-sm text-gray-500">Vendeur: {item.vendeur}</p>
                      </div>

                      {/* Quantité */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      {/* Prix total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {(parseFloat(item.prix) * item.quantity).toLocaleString('fr-FR')} CFA
                        </p>
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Supprimer du panier"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Résumé */}
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      {getTotalPrice().toLocaleString('fr-FR')} CFA
                    </span>
                  </div>

                  {/* Boutons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/products"
                      className="flex-1 text-center bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
                    >
                      Continuer les achats
                    </Link>
                    <button
                      onClick={handleClearCart}
                      className="flex-1 text-center bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                    >
                      Vider le panier
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Passer la commande
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Panier;
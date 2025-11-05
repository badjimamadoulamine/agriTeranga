import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import waveImg from "../assets/wave.jpg";
import cashImg from "../assets/cash.jpg";
import WavePaymentModal from "./WavePaymentModal";
import { useCart } from "../contexts/CartContext";
import apiService from "../services/apiService";
import { toast } from "react-toastify";

const PaiementModal = ({ isOpen, onClose, onBack, deliveryFee = 0, deliveryInfo = null }) => {
  const [selected, setSelected] = useState(null);
  const [showWavePayment, setShowWavePayment] = useState(false);
  const [showFarmPickupThanks, setShowFarmPickupThanks] = useState(false);
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
  const productsTotal = getTotalPrice();
  const totalToPay = productsTotal + (Number(deliveryFee) || 0);

  // Génère un numéro de commande lisible côté frontend si l'API l'exige
  const generateOrderNumber = () => {
    const pad = (n) => String(n).padStart(2, '0');
    const d = new Date();
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    const s = pad(d.getSeconds());
    const rand = Math.floor(1000 + Math.random() * 9000); // 4 digits
    return `ORD-${y}${m}${day}-${h}${min}${s}-${rand}`;
  };

  if (!isOpen) return null;

  // Récupérer les items depuis le panier serveur (ids produits valides)
  const buildItemsFromServerCart = async () => {
    try {
      const resp = await apiService.getCart();
      const payload = resp || {};
      const cart = (payload.data && (payload.data.cart || payload.data)) || payload.cart;
      const itemsArr = Array.isArray(cart?.items) ? cart.items : [];
      if (itemsArr.length > 0) {
        return itemsArr.map((it) => {
          const raw = it?.product;
          const productId = typeof raw === 'string' ? raw : (raw?._id || raw?.id);
          const qty = Math.max(1, Number(it?.quantity) || 1);
          return { product: productId, quantity: qty };
        });
      }
      // Si panier serveur vide mais on a un panier local, tenter une synchronisation rapide
      if ((cartItems || []).length > 0) {
        for (const ci of cartItems) {
          const pid = ci.id || ci.productId || ci._id;
          if (pid) {
            try {
              await apiService.addToCart(pid, ci.quantity || 1);
            } catch {}
          }
        }
        // Recharger depuis le serveur
        const resp2 = await apiService.getCart();
        const payload2 = resp2 || {};
        const cart2 = (payload2.data && (payload2.data.cart || payload2.data)) || payload2.cart;
        const itemsArr2 = Array.isArray(cart2?.items) ? cart2.items : [];
        if (itemsArr2.length > 0) {
          return itemsArr2.map((it) => {
            const raw = it?.product;
            const productId = typeof raw === 'string' ? raw : (raw?._id || raw?.id);
            const qty = Math.max(1, Number(it?.quantity) || 1);
            return { product: productId, quantity: qty };
          });
        }
      }
    } catch {}
    // Fallback local
    return (cartItems || []).map((ci) => ({
      product: ci.id || ci.productId || ci._id,
      quantity: ci.quantity || 1
    }));
  };

  const handleConfirmation = async () => {
    if (!selected) return;

    if (selected === "wave") {
      // Ouvrir le modal de paiement Wave
      setShowWavePayment(true);
    } else if (selected === "cash") {
      // Pour Cash, ne pas fermer le modal tant que la création n'a pas réussi
      try {
        const items = await buildItemsFromServerCart();
        // Validation assouplie: laisser le backend valider les IDs produits
        const isValidId = (v) => typeof v === 'string' && v.trim().length > 0;
        const validItems = (items || [])
          .map(it => ({ product: String(it.product || '').trim(), quantity: Math.max(1, Number(it.quantity) || 1) }))
          .filter(it => isValidId(it.product));
        if (validItems.length === 0) {
          toast.error("Votre panier n'est pas valide. Veuillez vérifier vos articles puis réessayer.");
          return;
        }
        // Appel backend: créer la commande (demandé: items, paymentMethod, deliveryInfo)
        try {
          await apiService.createOrder({
            orderNumber: generateOrderNumber(),
            items: validItems,
            paymentMethod: 'cash-on-delivery',
            deliveryInfo: deliveryInfo || { method: 'home-delivery', address: {} },
            deliveryFee: Number(deliveryFee) || 0,
            totals: {
              productsTotal,
              deliveryFee: Number(deliveryFee) || 0,
              totalToPay
            }
          });
        } catch (e) {
          // Afficher l'erreur renvoyée par l'API et stopper le flux (pas de fallback local, pas de navigation)
          const msg = (e && e.message) ? e.message : "La création de la commande a échoué";
          toast.error(msg);
          return;
        }
      } catch {}
      // Si retrait à la ferme, afficher un modal de remerciement et ne pas rediriger
      if (deliveryInfo && deliveryInfo.method === 'farm-pickup') {
        setShowFarmPickupThanks(true);
        return;
      }
      // Sinon, fermer et rediriger
      onClose();
      navigate('/livraison');
    }
  };

  const handleWavePaymentClose = () => {
    setShowWavePayment(false);
    onClose();
  };

  const handleWavePaymentSuccess = async () => {
    setShowWavePayment(false);
    // Ne pas fermer ici en cas de retrait à la ferme: afficher le modal de remerciement
    try {
      const items = await buildItemsFromServerCart();
      // Validation assouplie
      const isValidId = (v) => typeof v === 'string' && v.trim().length > 0;
      const validItems = (items || [])
        .map(it => ({ product: String(it.product || '').trim(), quantity: Math.max(1, Number(it.quantity) || 1) }))
        .filter(it => isValidId(it.product));
      if (validItems.length === 0) {
        toast.error("Votre panier n'est pas valide. Veuillez vérifier vos articles puis réessayer.");
        return;
      }

      // Appel backend: créer la commande
      try {
        await apiService.createOrder({
          orderNumber: generateOrderNumber(),
          items: validItems,
          paymentMethod: 'mobile-money',
          deliveryInfo: deliveryInfo || { method: 'home-delivery', address: {} },
          deliveryFee: Number(deliveryFee) || 0,
          totals: {
            productsTotal,
            deliveryFee: Number(deliveryFee) || 0,
            totalToPay
          }
        });
      } catch (e) {
        const msg = (e && e.message) ? e.message : "La création de la commande a échoué";
        toast.error(msg);
        return;
      }
    } catch {}
    if (deliveryInfo && deliveryInfo.method === 'farm-pickup') {
      setShowFarmPickupThanks(true);
      return;
    }
    onClose();
    navigate('/livraison');
  };

  const closeFarmPickupThanks = () => {
    setShowFarmPickupThanks(false);
    onClose();
  };

  return (
    <>
      {showFarmPickupThanks && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-[28rem] shadow-2xl p-6 text-center relative">
            <button
              onClick={closeFarmPickupThanks}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Fermer"
            >
              ×
            </button>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Merci pour votre commande !</h3>
            <p className="text-gray-600 mb-6">
              Vous pourrez vous rendre à la ferme choisie pour récupérer votre commande.
            </p>
            <button
              onClick={closeFarmPickupThanks}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
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
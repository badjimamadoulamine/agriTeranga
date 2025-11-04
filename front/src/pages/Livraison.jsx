import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LivraisonDetailsModal from '../components/LivraisonDetailsModal';
import CancelOrderModal from '../components/CancelOrderModal';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

const Livraison = ({ onOpenRegister, onOpenLogin }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleRetour = () => navigate('/panier');
  const handleVoirDetails = (order) => { setCurrentOrder(order); setShowModal(true); };
  const handleCloseModal = () => setShowModal(false);
  const handleCancelCommande = () => setShowCancelModal(true);
  const handleCancelClose = () => setShowCancelModal(false);
  const handleCancelConfirm = async () => {
    try {
      if (currentOrder?.id) {
        await apiService.cancelOrder(currentOrder.id, 'Annulation par le client');
      }
      // Recharger la liste après annulation
      await loadOrders();
    } catch {}
    setShowCancelModal(false);
    setShowModal(false);
  };

  // Normaliser une commande backend vers le format front
  const normalizeOrder = (o, idx = 0) => ({
    id: o.id || o._id || idx,
    orderNumber: o.orderNumber || o.number || `ORD${idx}`,
    orderDate: o.createdAt || o.orderDate,
    estimatedDeliveryDate: o.estimatedDeliveryDate || o.delivery?.estimatedDeliveryDate,
    statut: o.status || o.state || 'En route',
    articles: (o.items || o.products || []).map((it, i) => ({
      id: it.id || it._id || i,
      nom: it.name || it.productName || it.product?.name || `Article ${i+1}`,
      quantite: it.quantity || it.qty || 1,
      prix: Number(it.unitPrice || it.price || it.product?.price || 0),
      image: it.image || it.product?.imageUrl || ''
    })),
    recapitulatif: {
      sousTotal: Number(o.totals?.productsTotal ?? o.subtotal ?? 0),
      fraisLivraison: Number(o.totals?.deliveryFee ?? o.deliveryFee ?? 0),
      total: Number(o.totals?.totalToPay ?? o.total ?? 0)
    }
  });

  const loadOrders = async () => {
    try {
      const res = await apiService.getConsumerOrders(1, 50);
      const payload = res || {};
      let arr = [];
      if (Array.isArray(payload.data)) arr = payload.data;
      else if (payload.data && Array.isArray(payload.data.orders)) arr = payload.data.orders;
      else if (Array.isArray(payload.orders)) arr = payload.orders;
      else if (Array.isArray(payload)) arr = payload;
      const normalized = arr.map((o, idx) => normalizeOrder(o, idx));
      setOrders(normalized);
      setOrdered(normalized.length > 0);
    } catch (e) {
      const msg = (e && e.message) ? e.message : 'Impossible de charger vos commandes';
      toast.error(msg);
      setOrders([]);
      setOrdered(false);
    }
  };

  useEffect(() => { loadOrders(); }, [user]);

  // Recharger en revenant sur l'onglet (utile après navigation/login)
  useEffect(() => {
    const onVisibility = () => { if (!document.hidden) loadOrders(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [user]);

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  const statut = 'En route';

  const client = {
    nom: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Client AgriTeranga',
    email: user?.email || 'inconnu@exemple.com',
    telephone: user?.phone || '+221',
    adresse: user?.address || 'Adresse non renseignée'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header global */}
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />

      <section 
        className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/livraison.jpg')`
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Suivi de votre livraison
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white">
            Restez informé en temps réel sur l'avancée de votre commande
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col space-y-8">
        {ordered ? (
          <>
            {/* Liste des commandes */}
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-lg p-6 shadow-sm w-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#333333] mb-1">Commande {o.orderNumber || '#AT-XXXXXX'}</h3>
                    <p className="text-sm text-[#888888]">Livraison estimée : {fmtDate(o.estimatedDeliveryDate) || '—'}</p>
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src="/src/assets/livreur.jpg"
                      alt="Produits de la commande"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleVoirDetails(o)}
                  className="bg-[#387C3F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2F6118] transition-colors"
                >
                  Voir les détails
                </button>
              </div>
            ))}

            {/* Bloc 2: Progression de la livraison */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Progression de la livraison</h3>
              <div className="flex justify-between items-center relative">
                {/* Barre horizontale */}
                <div className="absolute top-4 left-4 right-4 h-1 bg-green-600 z-0"></div>

                {/* Étapes */}
                <div className="flex justify-between w-full relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                      <Check size={20} className="text-white" />
                    </div>
                    <span className="text-gray-800 font-medium text-center text-sm">En préparation</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                      <Truck size={20} className="text-white" />
                    </div>
                    <span className="text-gray-800 font-medium text-center text-sm">En route</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                      <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-gray-800 font-medium text-center text-sm">Livré</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloc 3: Alerte de proximité */}
            <div className="bg-green-100 rounded-xl p-4 flex items-start w-full">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="text-green-700 font-bold mb-1">Votre livreur est à proximité !</h4>
                <p className="text-gray-800 text-sm">Il devrait arriver dans environ 5 minutes.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-10 shadow-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pas de commande à livrer pour le moment</h3>
            <p className="text-gray-600 mb-6">Passe une commande pour voir ici le suivi de ta livraison.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => navigate('/products')} className="bg-[#387C3F] text-white px-5 py-2 rounded-lg hover:bg-[#2F6118] transition-colors">Voir les produits</button>
              <button onClick={() => navigate('/panier')} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Aller au panier</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer global */}
      <Footer />

      {/* Modal des détails de livraison */}
      <LivraisonDetailsModal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        onCancel={currentOrder ? handleCancelCommande : undefined}
        commandeDetails={currentOrder ? {
          articles: currentOrder.articles || [],
          recapitulatif: currentOrder.recapitulatif || { sousTotal: 0, fraisLivraison: 0, total: 0 },
          numeroCommande: currentOrder.orderNumber || '#AT-XXXXXX',
          dateCommande: fmtDate(currentOrder.orderDate) || '',
          dateLivraison: fmtDate(currentOrder.estimatedDeliveryDate) || '',
          statut,
          client
        } : { articles: [] }}
      />

      {/* Modal de confirmation d'annulation */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default Livraison;
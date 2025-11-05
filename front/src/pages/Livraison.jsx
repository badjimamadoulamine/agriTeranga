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
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleRetour = () => navigate('/panier');
  const handleVoirDetails = async (order) => {
    try {
      let enriched = order;
      if (order?.id) {
        const res = await apiService.getOrderDetails(order.id);
        const payload = res?.data?.order || res?.data || res || null;
        if (payload) {
          enriched = normalizeOrder(payload, 0);
          try { console.log('ORDER_PAYLOAD', payload); } catch {}
          // Si le livreur n'est pas correctement renseigné mais qu'on a un deliveryId, tenter de récupérer les détails de livraison
          const deliveryId =
            payload.delivery?._id || payload.delivery?.id ||
            payload.currentDelivery?._id || payload.currentDelivery?.id ||
            payload.assignment?._id || payload.assignment?.id ||
            payload.deliveryId || payload.currentDeliveryId || payload.assignedDeliveryId;
          try { console.log('DELIVERY_ID', deliveryId); } catch {}
          const hasDeliverer = enriched?.livreur?.nom && enriched.livreur.nom !== 'Non assigné';
          if (!hasDeliverer && deliveryId) {
            try {
              const dres = await apiService.getDeliveryDetails(deliveryId);
              const ddata = dres?.data?.delivery || dres?.data || dres || null;
              const delivery = ddata?.delivery || ddata || {};
              try { console.log('DELIVERY_DETAILS', delivery); } catch {}
              const drvRaw =
                delivery.deliverer || delivery.assignedDeliverer || delivery.driver || delivery.livreur || delivery.courier || delivery.assignedTo || {};
              try { console.log('DRV_RAW', drvRaw); } catch {}
              const nom = drvRaw.name || [drvRaw.firstName, drvRaw.lastName].filter(Boolean).join(' ');
              const telephone = drvRaw.phone || drvRaw.telephone || drvRaw.mobile || delivery.contactPhone || enriched?.livreur?.telephone || '';
              const photo = drvRaw.avatarUrl || drvRaw.photoUrl || drvRaw.photo || drvRaw.avatar || enriched?.livreur?.photo || '/src/assets/livreur.jpg';
              if (nom || telephone || photo) {
                enriched = { ...enriched, livreur: { nom: nom || enriched?.livreur?.nom || 'Non assigné', telephone, photo } };
                try { console.log('ENRICHED_LIVREUR_AFTER_DELIVERY', enriched.livreur); } catch {}
              }
            } catch {}
          }
        }
      }
      try { console.log('FINAL_ENRICHED_ORDER', enriched); } catch {}
      setCurrentOrder(enriched);
    } catch {
      setCurrentOrder(order);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const handleCancelCommande = () => setShowCancelModal(true);
  const handleCancelClose = () => setShowCancelModal(false);
  const handleCancelConfirm = async () => {
    try {
      if (currentOrder?.id) {
        await apiService.cancelOrder(currentOrder.id, 'Annulation par le client');
        // Mettre à jour immédiatement l'état pour refléter "Annulé" dans le modal
        setCurrentOrder(prev => prev ? { ...prev, statut: 'Annulé' } : prev);
        // Mettre à jour la liste visible
        setOrders(prev => Array.isArray(prev) ? prev.map(o => o.id === currentOrder.id ? { ...o, statut: 'Annulé' } : o) : prev);
      }
      // Recharger la liste après annulation
      await loadOrders();
    } catch (e) {
      const msg = e?.message || 'Impossible d\'annuler la commande';
      try { toast.error(msg); } catch {}
      return; // Ne pas fermer les modals si échec
    }
    setShowCancelModal(false);
    // Laisser le modal ouvert pour que l'utilisateur voie le statut mis à jour
  };

  // Normaliser une commande backend vers le format front
  const normalizeOrder = (o, idx = 0) => {
    const rawItems = (o.items || o.products || []);
    const articles = rawItems.map((it, i) => ({
      id: it.id || it._id || i,
      nom: it.name || it.productName || it.product?.name || `Article ${i+1}`,
      quantite: it.quantity || it.qty || 1,
      prix: Number(it.unitPrice || it.price || it.product?.price || 0),
      image: it.image || it.product?.imageUrl || ''
    }));
    const backendSub = Number(o.totals?.productsTotal ?? o.subtotal);
    const computedSub = Number.isFinite(backendSub) && backendSub > 0
      ? backendSub
      : rawItems.reduce((sum, it) => {
          const q = Number(it.quantity || it.qty || 1) || 1;
          const p = Number(it.unitPrice || it.price || it.product?.price || 0) || 0;
          return sum + q * p;
        }, 0);
    const backendFee = Number(o.totals?.deliveryFee ?? o.deliveryFee);
    // Fallback: calculer les frais à partir de deliveryInfo si non fournis par le backend
    let fraisLivraison = 0;
    if (Number.isFinite(backendFee) && backendFee >= 0) {
      fraisLivraison = backendFee;
    } else {
      const method = o.deliveryInfo?.method || o.delivery?.method;
      if (method === 'pickup-point' || method === 'farm-pickup') {
        fraisLivraison = 0;
      } else {
        const city = o.deliveryInfo?.address?.city || o.delivery?.address?.city || '';
        if (city === 'Dakar') fraisLivraison = 500;
        else if (city === 'Thiès') fraisLivraison = 1000;
        else if (city) fraisLivraison = 1500;
        else fraisLivraison = 0;
      }
    }
    const backendTotal = Number(o.totals?.totalToPay ?? o.total);
    const total = Number.isFinite(backendTotal) && backendTotal > 0 ? backendTotal : (computedSub + fraisLivraison);
    // Extraire infos livreur: priorité au backend order.deliverer enrichi, sinon fallback aux autres chemins
    const backendDeliverer = o.deliverer || {};
    const d = o.delivery || o.currentDelivery || o.assignment || {};
    const delivererRaw =
      Object.keys(backendDeliverer).length ? backendDeliverer :
      (d.deliverer || d.assignedDeliverer || d.driver || d.livreur || d.courier ||
       o.assignedDeliverer || o.driver || o.livreur || o.courier || {});
    const name = delivererRaw.name || [delivererRaw.firstName, delivererRaw.lastName].filter(Boolean).join(' ');
    const phone = delivererRaw.phone || delivererRaw.telephone || delivererRaw.mobile || d.contactPhone || o.contactPhone || '';
    const photo = delivererRaw.avatarUrl || delivererRaw.photoUrl || delivererRaw.photo || delivererRaw.avatar || backendDeliverer.avatarUrl || backendDeliverer.photoUrl || '';
    const livreur = {
      nom: name || 'Non assigné',
      telephone: phone || '',
      photo: photo || '/src/assets/livreur.jpg'
    };

    // Mapper le statut backend vers un libellé FR
    const rawStatus = (o.status || o.state || '').toString().toLowerCase();
    let displayStatus = 'En attente';
    if (rawStatus === 'processing' || rawStatus === 'assigned' || rawStatus === 'en préparation') displayStatus = 'En préparation';
    else if (rawStatus === 'in-transit' || rawStatus === 'shipped' || rawStatus === 'en route') displayStatus = 'En route';
    else if (rawStatus === 'delivered' || rawStatus === 'livré') displayStatus = 'Livré';

    const normalized = {
      id: o.id || o._id || idx,
      orderNumber: o.orderNumber || o.number || `ORD${idx}`,
      orderDate: o.createdAt || o.orderDate,
      estimatedDeliveryDate: o.estimatedDeliveryDate || o.delivery?.estimatedDeliveryDate,
      statut: displayStatus,
      livreur,
      articles,
      recapitulatif: {
        sousTotal: computedSub,
        fraisLivraison,
        total
      }
    };
    try { console.log('NORMALIZED_ORDER', normalized); } catch {}
    return normalized;
  };

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
  const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  const computeEstimatedDelivery = (orderDateIso, statut) => {
    const s = (statut || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const orderDate = orderDateIso ? new Date(orderDateIso) : new Date();
    if (s.includes('attente') || s.includes('pending')) {
      return 'La date de livraison sera disponible une fois la commande validée.';
    }
    if (s.includes('preparation')) {
      const d = new Date(orderDate);
      d.setDate(d.getDate() + 2);
      return fmtDate(d.toISOString());
    }
    if (s.includes('route')) {
      const d = new Date(orderDate);
      d.setHours(d.getHours() + 4);
      return fmtDateTime(d.toISOString());
    }
    if (s.includes('livr')) {
      return fmtDate(new Date().toISOString());
    }
    if (s.includes('annul')) {
      return 'Non disponible';
    }
    // Fallback
    return '—';
  };

  const statut = 'En route';

  const client = {
    nom: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Client AgriTeranga',
    email: user?.email || 'inconnu@exemple.com',
    telephone: user?.phone || '+221',
    adresse: user?.consumerInfo?.deliveryAddress || user?.address || user?.adresse || 'Adresse non renseignée'
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
              <div
                key={o.id}
                className="bg-white rounded-lg p-6 shadow-sm w-full cursor-pointer"
                onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#333333] mb-1">Commande {o.orderNumber || '#AT-XXXXXX'}</h3>
                    
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
                  onClick={(e) => { e.stopPropagation(); handleVoirDetails(o); }}
                  className="bg-[#387C3F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2F6118] transition-colors"
                >
                  Voir les détails
                </button>

                {/* Sections étendues: Progression + Alerte de proximité */}
                {expandedOrderId === o.id && (
                  <div className="mt-6 space-y-6">
                    {/* Bloc 2: Progression de la livraison */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Progression de la livraison</h3>
                      <div className="flex justify-between items-center relative">
                        {/* Barre horizontale animée */}
                        {(() => {
                          const s = (o.statut || '').toLowerCase();
                          const prepDone = s === 'en préparation' || s === 'en route' || s === 'livré';
                          const routeDone = s === 'en route' || s === 'livré';
                          const livreDone = s === 'livré';
                          const percent = livreDone ? 100 : routeDone ? 66 : prepDone ? 33 : 0;
                          return (
                            <>
                              <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 rounded z-0 overflow-hidden">
                                <div
                                  className="h-1 bg-green-600 transition-all duration-500 ease-out"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </>
                          );
                        })()}

                        {/* Étapes */}
                        <div className="flex justify-between w-full relative z-10">
                          {(() => {
                            const s = (o.statut || '').toLowerCase();
                            const prepDone = s === 'en préparation' || s === 'en route' || s === 'livré';
                            const routeDone = s === 'en route' || s === 'livré';
                            const livreDone = s === 'livré';
                            return (
                              <>
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${prepDone ? 'bg-green-600' : 'bg-gray-300'}`}>
                                    <Check size={20} className={prepDone ? 'text-white' : 'text-gray-600'} />
                                  </div>
                                  <span className="text-gray-800 font-medium text-center text-sm">En préparation</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${routeDone ? 'bg-green-600' : 'bg-gray-300'}`}>
                                    <Truck size={20} className={routeDone ? 'text-white' : 'text-gray-600'} />
                                  </div>
                                  <span className="text-gray-800 font-medium text-center text-sm">En route</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${livreDone ? 'bg-green-600' : 'bg-gray-300'}`}>
                                    {livreDone ? (
                                      <Check size={20} className="text-white" />
                                    ) : (
                                      <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="text-gray-800 font-medium text-center text-sm">Livré</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        {/* Pourcentage */}
                        {(() => {
                          const s = (o.statut || '').toLowerCase();
                          const percent = s === 'livré' ? 100 : s === 'en route' ? 66 : s === 'en préparation' ? 33 : 0;
                          return (
                            <div className="absolute -bottom-6 right-4 text-xs text-gray-600">
                              {percent}%
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Bloc 3: Message d'état dynamique */}
                    {(() => {
                      const s = (o.statut || '').toLowerCase();
                      let title = 'Votre livreur est à proximité !';
                      let text = 'Il devrait arriver dans environ 5 minutes.';
                      if (s.includes('attente') || s.includes('pending')) {
                        title = 'Commande en attente ⏳';
                        text = 'Votre commande a été enregistrée et sera traitée très prochainement.';
                      } else if (s.includes('préparation')) {
                        title = 'Votre commande est en cours de préparation 🌾';
                        text = 'Nos producteurs préparent soigneusement vos produits agricoles.';
                      } else if (s.includes('en route') || s.includes('route')) {
                        title = 'Votre livraison est en route 🚜';
                        text = 'Le livreur transporte actuellement vos produits vers votre adresse.';
                      } else if (s.includes('livré') || s.includes('livree') || s.includes('livrée')) {
                        title = 'Livraison effectuée ✅';
                        text = 'Vos produits agricoles ont bien été livrés. Merci pour votre confiance !';
                      } else if (s.includes('annul')) {
                        title = 'Commande annulée ❌';
                        text = 'Votre commande a été annulée. Contactez le service client pour plus d’informations.';
                      }
                      return (
                        <div className="bg-green-100 rounded-xl p-4 flex items-start w-full">
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                          </div>
                          <div>
                            <h4 className="text-green-700 font-bold mb-1">{title}</h4>
                            <p className="text-gray-800 text-sm">{text}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
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
          dateLivraison: computeEstimatedDelivery(currentOrder.orderDate, currentOrder.statut),
          statut: currentOrder.statut || statut,
          client,
          livreur: currentOrder.livreur || null
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
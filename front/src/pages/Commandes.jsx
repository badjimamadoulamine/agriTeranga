import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LivraisonDetailsModal from '../components/LivraisonDetailsModal';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import heroImg from '../assets/commande.jpg';

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

export default function Commandes({ onOpenRegister, onOpenLogin }) {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getConsumerOrders(1, 50);
        const payload = res || {};
        let arr = [];
        if (Array.isArray(payload.data)) arr = payload.data;
        else if (payload.data && Array.isArray(payload.data.orders)) arr = payload.data.orders;
        else if (Array.isArray(payload.orders)) arr = payload.orders;
        else if (Array.isArray(payload)) arr = payload;

        // Normaliser en shape front utilisé par le modal, avec fallback de calcul
        const normalized = arr.map((o, idx) => {
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
          // Fallback: calcul à partir de deliveryInfo si non fourni par le backend
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
          return {
            id: o.id || o._id || idx,
            orderNumber: o.orderNumber || o.number || `ORD${idx}`,
            orderDate: o.createdAt || o.orderDate,
            estimatedDeliveryDate: o.estimatedDeliveryDate || o.delivery?.estimatedDeliveryDate,
            statut: o.status || o.state || 'En route',
            articles,
            recapitulatif: {
              sousTotal: computedSub,
              fraisLivraison,
              total
            }
          };
        });
        setOrders(normalized);
      } catch (e) {
        // Fallback sessionStorage
        try {
          const list = JSON.parse(sessionStorage.getItem('ordersList') || '[]');
          setOrders(Array.isArray(list) ? list : []);
        } catch {
          setOrders([]);
        }
      }
    };
    load();
  }, [user]);

  const openDetails = (order) => { setSelected(order); setShowModal(true); };
  const closeDetails = () => setShowModal(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />

      {/* Hero Section */}
      <section
        className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated decorative circles */}
        <div className="absolute -left-10 top-10 w-24 h-24 rounded-full bg-white/10 blur-sm animate-pulse" />
        <div className="absolute -right-8 bottom-8 w-20 h-20 rounded-full bg-green-400/20 blur-sm animate-pulse" />
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-40 h-40 rounded-full bg-green-600/10 blur-md animate-pulse" />

        <div className="relative text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Suivi et historique des commandes
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 text-sm md:text-base max-w-2xl mx-auto animate-pulse">
            Retrouve rapidement tes dernières commandes et leur progression en temps réel.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes commandes</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-10 shadow-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune commande pour le moment</h3>
            <p className="text-gray-600">Passe une commande pour la retrouver ici.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Commande</div>
                  <div className="text-lg font-semibold text-gray-900">{o.orderNumber || '#AT-XXXXXX'}</div>
                  <div className="text-sm text-gray-600">Commandée le {fmtDate(o.orderDate)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Livraison estimée</div>
                  <div className="font-medium">{fmtDate(o.estimatedDeliveryDate) || '—'}</div>
                  <button
                    onClick={() => openDetails(o)}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <LivraisonDetailsModal
        isOpen={showModal}
        onClose={closeDetails}
        commandeDetails={selected ? {
          numeroCommande: selected.orderNumber,
          dateCommande: fmtDate(selected.orderDate),
          dateLivraison: fmtDate(selected.estimatedDeliveryDate),
          statut: selected.statut || 'En route',
          articles: selected.articles || [],
          recapitulatif: selected.recapitulatif || { sousTotal: 0, fraisLivraison: 0, total: 0 }
        } : { articles: [] }}
      />
    </div>
  );
}

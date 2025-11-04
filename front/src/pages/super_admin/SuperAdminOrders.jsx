import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Power
} from 'lucide-react';

// Composants (Assurez-vous que les chemins sont corrects)
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar';
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader';
import AdminProfileModal from '../../components/admin/AdminProfileModal';

// --- Types d'Ordres Simples (Optionnel, pour une meilleure lisibilité)
// type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
// type OrderPriority = 'high' | 'normal' | 'low';

const SuperAdminOrders = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // Gérer l'utilisateur comme un état simple

  // 1. Récupération de l'utilisateur (Initialisation et Redirection)
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('superAdminUser') || localStorage.getItem('user');
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      setUser(parsedUser);
      setIsLoading(false);
      
      // Optionnel: Rediriger si l'utilisateur n'est pas un Super Admin ou n'est pas connecté
      if (!parsedUser) {
         navigate('/login');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Il est généralement suffisant de supprimer le token si votre système utilise un token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('superAdminUser');
    navigate('/login');
  };

  const toggleProfileModal = () => {
    setShowProfileModal(prev => !prev);
  };

  const handleProfileUpdated = () => {
    // Logique pour rafraîchir les données de l'utilisateur si nécessaire
    console.log('Profil mis à jour, mise à jour de l\'état local si besoin.');
  };
  
  // 2. Données de démonstration (Exemple réel viendrait d'une API)
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      product: 'Kit de démarrage agricole',
      quantity: 1,
      total: '89.99€',
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: '2024-10-20',
      deliveryDate: '2024-10-25',
      supplier: 'AgroSupplies',
      priority: 'high'
    },
    {
      id: 'ORD-002',
      customer: 'Marie Martin',
      email: 'marie.martin@email.com',
      product: 'Engrais bio 5kg',
      quantity: 3,
      total: '45.00€',
      status: 'processing',
      paymentStatus: 'paid',
      createdAt: '2024-10-21',
      deliveryDate: '2024-10-26',
      supplier: 'BioFertil',
      priority: 'normal'
    },
    {
      id: 'ORD-003',
      customer: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      product: 'Semences tomates hybrides',
      quantity: 2,
      total: '67.98€',
      status: 'shipped',
      paymentStatus: 'paid',
      createdAt: '2024-10-19',
      deliveryDate: '2024-10-24',
      supplier: 'SeedCorp',
      priority: 'low'
    },
    {
        id: 'ORD-004',
        customer: 'Sophie Lefevre',
        email: 'sophie.lefevre@email.com',
        product: 'Arroseur automatique',
        quantity: 1,
        total: '129.50€',
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: '2024-10-15',
        deliveryDate: '2024-10-20',
        supplier: 'AquaTech',
        priority: 'normal'
    },
    {
        id: 'ORD-005',
        customer: 'Marc Voisin',
        email: 'marc.voisin@email.com',
        product: 'Pots de fleurs biodégradables',
        quantity: 10,
        total: '22.00€',
        status: 'cancelled',
        paymentStatus: 'refunded',
        createdAt: '2024-10-22',
        deliveryDate: null,
        supplier: 'EcoPot',
        priority: 'low'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filtrage des commandes (Utilisation de useMemo pour optimiser)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const matchesSearch = order.id.toLowerCase().includes(lowerSearchTerm) ||
                            order.customer.toLowerCase().includes(lowerSearchTerm) ||
                            order.product.toLowerCase().includes(lowerSearchTerm);
                            
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  // 3. Calcul dynamique des statistiques
  const calculateOrderStats = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {
        pending: 0, 
        processing: 0, 
        shipped: 0, 
        delivered: 0, 
        cancelled: 0
    });
  }, [orders]);


  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = "w-4 h-4";
    switch (status) {
      case 'pending': return <Clock className={iconClass} />;
      case 'processing': return <Package className={iconClass} />;
      case 'shipped': return <Truck className={iconClass} />;
      case 'delivered': return <CheckCircle className={iconClass} />;
      case 'cancelled': return <XCircle className={iconClass} />;
      default: return <AlertCircle className={iconClass} />;
    }
  };

  // 4. Affichage de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAF8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'interface...</p>
        </div>
      </div>
    );
  }
  
  // L'utilisateur est null et isLoading est false, la redirection a eu lieu dans useEffect
  if (!user) {
    return null; 
  }

  // --- Rendu Principal ---
  return (
    <div className="flex h-screen bg-[#F8FAF8]">
      <SuperAdminSidebar 
        user={user} 
        onClose={() => setSidebarOpen(false)} 
        sidebarOpen={sidebarOpen} // Ajout de la prop pour gérer l'ouverture/fermeture
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader 
          user={user}
          onOpenProfile={toggleProfileModal}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            
            {/* Page Title */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes 📦</h1>
                <p className="text-gray-600">Supervision complète des commandes - Accès Super Admin</p>
              </div>
            </div>

            {/* Stats Cards (maintenant dynamiques) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-500 rounded-lg p-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En attente</p>
                    <p className="text-2xl font-semibold text-gray-900">{calculateOrderStats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-lg p-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En traitement</p>
                    <p className="text-2xl font-semibold text-gray-900">{calculateOrderStats.processing}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-500 rounded-lg p-3">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expédiées</p>
                    <p className="text-2xl font-semibold text-gray-900">{calculateOrderStats.shipped}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-lg p-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Livrées</p>
                    <p className="text-2xl font-semibold text-gray-900">{calculateOrderStats.delivered}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher ID, client ou produit..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>

                {/* Results count */}
                <div className="flex items-center text-gray-600">
                  <Filter className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{filteredOrders.length}</span> commande(s) trouvée(s)
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Détails
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Livraison Prévue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{order.id}</div>
                            <div className="text-xs text-gray-500">
                              Créée: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                <div className="text-xs text-gray-500">{order.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.product}</div>
                            <div className="text-xs text-gray-500">Qté: {order.quantity}</div>
                            <div className="text-xs text-gray-500">Fournisseur: {order.supplier}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityBadgeColor(order.priority)}`}>
                              {order.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('fr-FR') : 'Non planifiée'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                aria-label={`Voir les détails de la commande ${order.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                                aria-label={`Valider la commande ${order.id}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                                aria-label={`Annuler la commande ${order.id}`}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                Aucune commande trouvée correspondant aux critères.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Power className="w-5 h-5 text-gray-500 mr-2" />
                Actions rapides Super Admin
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group">
                  <Package className="w-6 h-6 text-blue-600 group-hover:text-blue-700 mr-2" />
                  <span className="font-medium text-gray-700">Traitement en lot</span>
                </button>
                <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors group">
                  <Truck className="w-6 h-6 text-purple-600 group-hover:text-purple-700 mr-2" />
                  <span className="font-medium text-gray-700">Expédition groupée</span>
                </button>
                <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors group">
                  <ClipboardList className="w-6 h-6 text-green-600 group-hover:text-green-700 mr-2" />
                  <span className="font-medium text-gray-700">Générer rapport PDF</span>
                </button>
              </div>
            </div>
            
          </div>
        </main>
      </div>

      {/* Modal de profil */}
      {user && (
          <AdminProfileModal
            isOpen={showProfileModal}
            onClose={toggleProfileModal}
            user={user}
            onUpdated={handleProfileUpdated}
          />
      )}
    </div>
  );
}

export default SuperAdminOrders;
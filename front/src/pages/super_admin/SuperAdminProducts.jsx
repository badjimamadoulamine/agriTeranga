import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Eye,
  DollarSign,
  Tag,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Database,
  Cog,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Composants (Assurez-vous que les chemins sont corrects)
import SuperAdminSidebar from '../../components/super_admin/SuperAdminSidebar';
import SuperAdminHeader from '../../components/super_admin/SuperAdminHeader';
import AdminProfileModal from '../../components/admin/AdminProfileModal';

// --- Définition des types/data pour la démo ---
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Kit de démarrage agricole',
    category: 'Kits',
    price: 89.99, // Utiliser des nombres pour les calculs
    stock: 45,
    status: 'active',
    supplier: 'AgroSupplies',
    configuration: 'Global',
    visibility: 'Public',
    lastModified: '2024-10-20',
    adminRights: 'admin_standard'
  },
  {
    id: 2,
    name: 'Engrais bio 5kg',
    category: 'Fertilizers',
    price: 15.00,
    stock: 120,
    status: 'active',
    supplier: 'BioFertil',
    configuration: 'Avancé',
    visibility: 'Public',
    lastModified: '2024-10-21',
    adminRights: 'super_admin'
  },
  {
    id: 3,
    name: 'Semences tomates hybrides',
    category: 'Seeds',
    price: 33.99,
    stock: 15, // Faible stock pour l'alerte
    status: 'inactive',
    supplier: 'SeedCorp',
    configuration: 'Global',
    visibility: 'Archivé',
    lastModified: '2024-10-19',
    adminRights: 'admin_standard'
  }
];

const SuperAdminProducts = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAdminRights, setSelectedAdminRights] = useState('all');
  const [products] = useState(INITIAL_PRODUCTS); // Utilisation des données de l'exemple
  
  // État d'authentification
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Gestion de l'Authentification ---
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('superAdminUser') || localStorage.getItem('user');
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      setUser(parsedUser);
      setIsLoading(false);
      
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('superAdminUser');
    navigate('/login');
  };

  const toggleProfileModal = () => {
    setShowProfileModal(prev => !prev);
  };

  const handleProfileUpdated = () => {
    console.log('Profil mis à jour');
  };
  
  // --- Fonctions de Style et de Calcul ---

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calcul dynamique des produits filtrés
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const matchesSearch = product.name.toLowerCase().includes(lowerSearchTerm) ||
                            product.supplier.toLowerCase().includes(lowerSearchTerm) ||
                            product.id.toString().includes(lowerSearchTerm);
                            
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesAdminRights = selectedAdminRights === 'all' || product.adminRights === selectedAdminRights;
      
      return matchesSearch && matchesCategory && matchesAdminRights;
    });
  }, [products, searchTerm, selectedCategory, selectedAdminRights]);

  // Calcul dynamique des statistiques
  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    // Calcul de la valeur totale (en utilisant la propriété `price` numérique)
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const superAdminConfigCount = products.filter(p => p.adminRights === 'super_admin').length;
    
    return { totalStock, totalValue: totalValue.toFixed(2), superAdminConfigCount };
  }, [products]);


  // --- Affichage de chargement/authentification ---
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

  if (!user) {
    return null; // La redirection a été gérée par useEffect
  }

  // --- Rendu Principal ---
  return (
    <div className="flex h-screen bg-[#F8FAF8]">
      <SuperAdminSidebar 
        user={user} 
        onClose={() => setSidebarOpen(false)} 
        sidebarOpen={sidebarOpen}
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
                <h1 className="text-2xl font-bold text-gray-900">Configuration Produits Avancée ⚙️</h1>
                <p className="text-gray-600">Configuration globale et avancée des produits - Accès Super Admin</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>{showAdvancedConfig ? 'Masquer' : 'Configuration Avancée'}</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Nouveau produit</span>
                </button>
              </div>
            </div>

            {/* Super Admin Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Accès Super Admin - Configuration Avancée
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Attention : Les modifications ici affectent les règles de gestion pour tous les administrateurs.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Configuration Panel */}
            {showAdvancedConfig && (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Cog className="w-5 h-5 mr-2 text-purple-600" />
                  Paramètres de Sécurité et de Règles Globales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ... Vos paramètres globaux existants ici ... */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Paramètres Globaux</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Validation admin pour nouveaux produits</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-2 text-sm text-gray-700">Modification libre des prix</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Notifications stock critique</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Permissions Admin</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-2 text-sm text-gray-700">Admin standard peut supprimer</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Modification sensible par Super Admin</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-2 text-sm text-gray-700">Audit des modifications</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Fournisseurs</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Approbation automatique</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-2 text-sm text-gray-700">Gestion multi-fournisseurs</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Alertes renouvellement stock</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats (maintenant dynamiques) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-lg p-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Produits</p>
                    <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-500 rounded-lg p-3">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Config Super Admin</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.superAdminConfigCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-lg p-3">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Stock Global</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalStock}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-orange-500 rounded-lg p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalValue}€</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters (maintenant fonctionnels) */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher nom, fournisseur ou ID..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Category Filter */}
                <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Toutes les catégories</option>
                  {/* Map les catégories uniques des produits pour un meilleur filtre */}
                  {[...new Set(products.map(p => p.category))].map(category => (
                      <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                {/* Admin Rights Filter */}
                <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedAdminRights}
                    onChange={(e) => setSelectedAdminRights(e.target.value)}
                >
                  <option value="all">Tous les droits admin</option>
                  <option value="super_admin">Super Admin uniquement</option>
                  <option value="admin_standard">Admin Standard</option>
                </select>
                
                {/* Results count */}
                <div className="flex items-center text-gray-600">
                  <Filter className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{filteredProducts.length}</span> produit(s) trouvé(s)
                </div>
              </div>
            </div>

            {/* Products Table with Super Admin Features */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Droits Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière Modification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">ID: {product.id} | Cat: {product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeColor(product.status)}`}>
                              {product.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                              {product.status}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">{product.visibility}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.adminRights === 'super_admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {product.adminRights === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN STANDARD'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.price.toFixed(2)}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${product.stock < 20 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                {product.stock}
                              </span>
                              {product.stock < 20 && (
                                <AlertTriangle className="w-4 h-4 text-red-500 ml-2" title="Stock critique" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.lastModified).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {/* Les actions Super Admin sont distinctes */}
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors" title="Voir les détails">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-100 transition-colors" title="Accéder aux réglages avancés">
                                <Settings className="w-4 h-4" />
                              </button>
                              <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors" title="Éditer">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors" title="Supprimer (Action critique)">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                Aucun produit trouvé correspondant aux filtres.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Super Admin */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Cog className="w-5 h-5 text-gray-500 mr-2" />
                Actions Rapides Super Admin
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors group">
                  <Settings className="w-6 h-6 text-purple-600 group-hover:text-purple-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Configuration Globale</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group">
                  <Database className="w-6 h-6 text-blue-600 group-hover:text-blue-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Import/Export (CSV)</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors group">
                  <ShieldCheck className="w-6 h-6 text-green-600 group-hover:text-green-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Audit Permissions</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors group">
                  <TrendingUp className="w-6 h-6 text-orange-600 group-hover:text-orange-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Rapport Avancé (KPIs)</span>
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
            onClose={() => setShowProfileModal(false)}
            user={user}
            onUpdated={handleProfileUpdated}
          />
      )}
    </div>
  )
}

export default SuperAdminProducts;
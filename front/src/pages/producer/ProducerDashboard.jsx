import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, Search, Filter, Plus, Package, TrendingUp, ShoppingCart, Star, Eye, EyeOff, Edit, Trash2, User, Settings } from 'lucide-react';
import ProducerLayout from '../../layouts/ProducerLayout';
import useProducerData from '../../hooks/useProducerData';
import ProfileModal from '../../components/ProfileModal';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'react-toastify';

const ProducerDashboard = () => {
  const {
    stats,
    products,
    orders,
    loading,
    error,
    productsPagination,
    createProduct,
    updateProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct,
    searchProducts,
    filterProductsByCategory,
    changeProductsPage,
    // Gestion du profil
    profile,
    profileLoading,
    profileError,
    updateProfile,
    changePassword,
    getProfile,
    refreshProfile
  } = useProducerData();

  // Données pour les graphiques (chiffre d'affaires par mois)
  const salesChartData = [
    { month: 'Jan', revenue: 45000, orders: 12 },
    { month: 'Fév', revenue: 38000, orders: 10 },
    { month: 'Mar', revenue: 49000, orders: 15 },
    { month: 'Avr', revenue: 41000, orders: 11 },
    { month: 'Mai', revenue: 55000, orders: 18 },
    { month: 'Juin', revenue: 50000, orders: 16 },
  ];

  // Données de répartition des produits (simulées si non disponibles)
  const productDistributionData = [
    { name: 'Publiés', value: stats.publishedProducts || 0 },
    { name: 'Non Publiés', value: stats.unpublishedProducts || 0 },
  ];
  const COLORS = ['#10B981', '#F59E0B'];

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductData, setNewProductData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    category: '',
    stock: '',
    image: null,
    isPublished: true,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Charger le profil au montage
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Gérer l'ouverture de la modale d'ajout/édition
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewProductData({
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        category: product.category,
        stock: product.stock,
        image: null, // L'image est gérée séparément
        isPublished: product.isPublished,
      });
    } else {
      setEditingProduct(null);
      setNewProductData({
        name: '',
        description: '',
        price: '',
        unit: '',
        category: '',
        stock: '',
        image: null,
        isPublished: true,
      });
    }
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProductData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    setNewProductData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Gérer la soumission du formulaire d'ajout/édition
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...newProductData,
      price: parseFloat(newProductData.price),
      stock: parseInt(newProductData.stock, 10),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, dataToSend);
        toast.success('Produit mis à jour avec succès');
      } else {
        await createProduct(dataToSend);
        toast.success('Produit ajouté avec succès');
      }
      handleCloseProductModal();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'opération");
    }
  };

  // Gérer la suppression
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
      try {
        await deleteProduct(productId);
        toast.success('Produit supprimé.');
      } catch (err) {
        toast.error(err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  // Gérer la publication
  const handlePublishToggle = async (productId, isPublished, productName) => {
    try {
      if (isPublished) {
        await unpublishProduct(productId);
        toast.info(`Produit "${productName}" dépublié.`);
      } else {
        await publishProduct(productId);
        toast.success(`Produit "${productName}" publié.`);
      }
    } catch (err) {
      toast.error(err.message || 'Erreur de publication.');
    }
  };

  // Filtrer les produits
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    searchProducts(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    filterProductsByCategory(e.target.value === 'all' ? undefined : e.target.value);
  };

  if (loading) {
    return (
      <ProducerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59C94F]"></div>
        </div>
      </ProducerLayout>
    );
  }

  if (error) {
    return (
      <ProducerLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </ProducerLayout>
    );
  }

  // Fonctions d'aide pour l'affichage
  const getProductStatusBadge = (isPublished) => {
    return isPublished
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getProductStatusText = (isPublished) => {
    return isPublished ? 'Publié' : 'Brouillon';
  };

  return (
    <ProducerLayout>
      <div className="max-w-7xl mx-auto">
        {/* En-tête et Profil */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Producteur</h1>
            <p className="text-lg text-gray-600">Gérez vos produits, commandes et performances</p>
          </div>
          
          {/* Avatar et profil */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-gray-500">Producteur</p>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="relative group"
            >
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-green-700 transition-colors ring-2 ring-white shadow-lg group-hover:ring-green-400">
                {profile?.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-gray-50">
                <Settings className="w-3 h-3 text-gray-600 group-hover:text-gray-800" />
              </div>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires (mois)</p>
                <p className="text-2xl font-bold text-gray-800">{stats.monthlyRevenue?.toLocaleString() || 0} FCFA</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Produits</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalProducts || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Note Moyenne</p>
                <p className="text-2xl font-bold text-gray-800">
                  <Star className="w-6 h-6 text-yellow-500 inline-block mr-1" />
                  {stats.averageRating?.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Gestion des Produits */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Catalogue Produits</h2>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="px-4 py-2 bg-[#59C94F] text-white rounded-lg hover:bg-[#4CAF50] transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter un produit</span>
                </button>
              </div>

              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                <select
                  className="sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                  value={categoryFilter}
                  onChange={handleCategoryFilter}
                >
                  <option value="all">Toutes les catégories</option>
                  {/* Les catégories devraient venir d'un hook ou props */}
                  <option value="fruits">Fruits</option>
                  <option value="legumes">Légumes</option>
                  <option value="cereales">Céréales</option>
                  <option value="frais">Produits frais</option>
                </select>
              </div>

              {/* Liste des produits */}
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun produit trouvé dans votre catalogue.</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3 md:mb-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            <Package className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {product.price} {product.unit} • Stock: {product.stock}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getProductStatusBadge(
                              product.isPublished
                            )}`}
                          >
                            {getProductStatusText(product.isPublished)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3 md:ml-auto">
                        <button
                          onClick={() => handlePublishToggle(product._id, product.isPublished, product.name)}
                          className={`p-2 rounded-full transition-colors ${
                            product.isPublished
                              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          title={product.isPublished ? 'Dépublier' : 'Publier'}
                        >
                          {product.isPublished ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenProductModal(product)}
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.name)}
                          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {productsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => changeProductsPage(productsPagination.page - 1)}
                      disabled={productsPagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {productsPagination.page} sur {productsPagination.totalPages}
                    </span>
                    <button
                      onClick={() => changeProductsPage(productsPagination.page + 1)}
                      disabled={productsPagination.page === productsPagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                )}
            </div>

            {/* Dernières Commandes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Dernières Commandes</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune commande récente.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between border-b border-gray-100 pb-3"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            Commande #{order.orderNumber || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.customerName || 'Client inconnu'} •{' '}
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#59C94F]">
                            {order.totalAmount?.toLocaleString() || 0} FCFA
                          </p>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status === 'completed' ? 'Livrée' : order.status === 'pending' ? 'En attente' : 'En cours'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Graphiques */}
          <div className="space-y-6">
            {/* Chiffre d'affaires mensuel */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Chiffre d'affaires (6 derniers mois)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? `${value.toLocaleString()} FCFA` : value,
                      name === 'revenue' ? 'Chiffre' : 'Commandes'
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition Produits */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Statut des Produits</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={productDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout/édition de produit */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h3>
              <button onClick={handleCloseProductModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit}>
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={newProductData.name}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                    placeholder="Ex: Mangue Keitt, Farine de maïs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows="3"
                    required
                    value={newProductData.description}
                    onChange={handleProductChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent resize-y"
                    placeholder="Description détaillée, avantages..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Prix */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            required
                            value={newProductData.price}
                            onChange={handleProductChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                            placeholder="Ex: 500"
                            min="0"
                        />
                    </div>
                    
                    {/* Unité */}
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                        <select
                            name="unit"
                            id="unit"
                            required
                            value={newProductData.unit}
                            onChange={handleProductChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                        >
                            <option value="">Sélectionner l'unité</option>
                            <option value="kg">kg</option>
                            <option value="unité">Unité</option>
                            <option value="litre">Litre</option>
                            <option value="sac">Sac</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Catégorie */}
                  <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <select
                          name="category"
                          id="category"
                          required
                          value={newProductData.category}
                          onChange={handleProductChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                      >
                          <option value="">Sélectionner la catégorie</option>
                          <option value="fruits">Fruits</option>
                          <option value="legumes">Légumes</option>
                          <option value="cereales">Céréales</option>
                          <option value="frais">Produits frais</option>
                          <option value="sec">Produits secs</option>
                      </select>
                  </div>
                  
                  {/* Stock */}
                  <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock disponible</label>
                      <input
                          type="number"
                          name="stock"
                          id="stock"
                          required
                          value={newProductData.stock}
                          onChange={handleProductChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59C94F] focus:border-transparent"
                          placeholder="Ex: 100"
                          min="0"
                      />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                  <div className="flex items-center space-x-4">
                    <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#59C94F] transition-colors">
                      <Upload className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        {newProductData.image ? newProductData.image.name : (editingProduct && editingProduct.imageUrl ? 'Nouvelle image (optionnel)' : 'Ajouter une image')}
                      </span>
                      <input
                        type="file"
                        name="image"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {(editingProduct && editingProduct.imageUrl && !newProductData.image) && (
                    <p className="mt-2 text-xs text-gray-500">Image actuelle chargée: {editingProduct.imageUrl.substring(editingProduct.imageUrl.lastIndexOf('/') + 1)}</p>
                  )}
                </div>

                {/* Publication */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    id="isPublished"
                    checked={newProductData.isPublished}
                    onChange={handleProductChange}
                    className="h-4 w-4 text-[#59C94F] border-gray-300 rounded focus:ring-[#59C94F]"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">Publier immédiatement</label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseProductModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingProduct ? 'Modifier' : 'Ajouter'} le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de profil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
        onChangePassword={changePassword}
        onRefreshProfile={refreshProfile}
      />
    </ProducerLayout>
  );
};

export default ProducerDashboard;
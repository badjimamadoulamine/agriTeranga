import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, Search, Filter, Plus, Package, TrendingUp, ShoppingCart, Star, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import ProducerLayout from '../../layouts/ProducerLayout';
import useProducerData from '../../hooks/useProducerData';
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
    changeProductsPage
  } = useProducerData();

  // State pour le formulaire d'ajout de produit
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'légumes',
    stock: '',
    unit: 'kg',
    isOrganic: false
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Données pour les graphiques (chiffre d'affaires par mois)
  const salesChartData = [
    { month: 'Jan', revenue: 45000, orders: 12 },
    { month: 'Fév', revenue: 38000, orders: 10 },
    { month: 'Mar', revenue: 49000, orders: 15 },
    { month: 'Avr', revenue: 42000, orders: 13 },
    { month: 'Mai', revenue: 50000, orders: 16 },
    { month: 'Juin', revenue: 46000, orders: 14 },
  ];

  // Couleurs pour les graphiques
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gérer l'upload d'image (simulation pour l'instant)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm(prev => ({ ...prev, image: file }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Préparer les données du produit
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        stock: parseInt(productForm.stock),
        unit: productForm.unit,
        isOrganic: productForm.isOrganic
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      // Reset le formulaire
      setProductForm({
        name: '',
        price: '',
        description: '',
        category: 'légumes',
        stock: '',
        unit: 'kg',
        isOrganic: false
      });
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2 || value.length === 0) {
      searchProducts(value);
    }
  };

  // Filtrer par catégorie
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterProductsByCategory(category);
  };

  // Éditer un produit
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit || 'kg',
      isOrganic: product.isOrganic || false
    });
    setShowProductForm(true);
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  // Publier un produit
  const handlePublishProduct = async (productId) => {
    try {
      await publishProduct(productId);
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
    }
  };

  // Dépublier un produit
  const handleUnpublishProduct = async (productId) => {
    try {
      await unpublishProduct(productId);
    } catch (err) {
      console.error('Erreur lors de la dépublication:', err);
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingProduct(null);
    setShowProductForm(false);
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: 'légumes',
      stock: '',
      unit: 'kg',
      isOrganic: false
    });
  };

  if (loading && !showProductForm) {
    return (
      <ProducerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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

  return (
    <ProducerLayout>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord Producteur</h1>
        <p className="text-lg text-gray-600">Gérez vos produits et suivez vos ventes</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Produits</p>
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
              <p className="text-sm text-gray-600 mb-1">Commandes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue?.toLocaleString() || 0} FCFA</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageRating?.toFixed(1) || '0.0'}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Section Produits */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header avec recherche et ajout */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mes produits</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Toutes catégories</option>
                <option value="légumes">Légumes</option>
                <option value="fruits">Fruits</option>
                <option value="céréales">Céréales</option>
                <option value="tubercules">Tubercules</option>
                <option value="épices">Épices</option>
              </select>
            </div>

            {/* Liste des produits */}
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-green-600">{product.price} FCFA/{product.unit}</span>
                          <span className="text-gray-500">Stock: {product.stock}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isAvailable ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {product.isAvailable ? (
                          <button
                            onClick={() => handleUnpublishProduct(product.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-xs sm:text-sm"
                            title="Dépublier le produit"
                          >
                            <EyeOff className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Dépublier</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublishProduct(product.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-xs sm:text-sm"
                            title="Publier le produit"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Publier</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm"
                          title="Modifier le produit"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm"
                          title="Supprimer le produit"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || selectedCategory ? 'Aucun produit trouvé' : 'Aucun produit ajouté'}
                </div>
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
        </div>

        {/* Graphiques */}
        <div className="space-y-6">
          {/* Graphique des ventes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ventes par mois</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `${value.toLocaleString()} FCFA` : value,
                    name === 'revenue' ? 'Revenus' : 'Commandes'
                  ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par catégorie */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition par catégorie</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Légumes', value: 35 },
                    { name: 'Fruits', value: 25 },
                    { name: 'Céréales', value: 20 },
                    { name: 'Tubercules', value: 15 },
                    { name: 'Épices', value: 5 }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal formulaire produit */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Image du produit</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="product-image"
                      accept="image/svg+xml,image/png,image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="product-image" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Cliquez pour téléverser</p>
                    </label>
                  </div>
                </div>

                {/* Nom du produit */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nom du produit *</label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Tomates fraîches"
                  />
                </div>

                {/* Prix et Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Prix (FCFA) *</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 2500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 100"
                    />
                  </div>
                </div>

                {/* Unité et Catégorie */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Unité</label>
                    <select
                      name="unit"
                      value={productForm.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="pièce">pièce</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Catégorie *</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="légumes">Légumes</option>
                      <option value="fruits">Fruits</option>
                      <option value="céréales">Céréales</option>
                      <option value="tubercules">Tubercules</option>
                      <option value="épices">Épices</option>
                    </select>
                  </div>
                </div>

                {/* Bio checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={productForm.isOrganic}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="ml-2 text-gray-700">Produit biologique</label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                    placeholder="Décrivez votre produit..."
                  />
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
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
        </div>
      )}
    </ProducerLayout>
  );
};

export default ProducerDashboard;
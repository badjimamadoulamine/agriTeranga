import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Upload,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  BarChart3
} from 'lucide-react';
import ProducerLayout from '../../layouts/ProducerLayout';
import useProducerData from '../../hooks/useProducerData';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../../utils/imageUtils';

const ProducerProducts = () => {
  const {
    products,
    stats,
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

  // États pour le formulaire
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    unit: 'kg',
    isOrganic: false
  });
  const [saving, setSaving] = useState(false);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gérer l'upload d'image (simulation)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm(prev => ({ ...prev, image: file }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.description || !productForm.stock) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    
    try {
      // Préparer les données du produit avec FormData pour l'upload d'image
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', parseFloat(productForm.price));
      formData.append('category', productForm.category);
      formData.append('stock', parseInt(productForm.stock));
      formData.append('unit', productForm.unit);
      formData.append('isOrganic', productForm.isOrganic);
      
      // Ajouter l'image si elle existe
      if (productForm.image) {
        formData.append('images', productForm.image);
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      // Reset le formulaire
      resetForm();
      
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
    } finally {
      setSaving(false);
    }
  };

  // Reset du formulaire
  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      unit: 'kg',
      isOrganic: false
    });
    setShowProductForm(false);
    setEditingProduct(null);
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

  // Filtrer par statut
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    // Implémenter le filtre par statut si nécessaire
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

  return (
    <ProducerLayout>
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mes Produits</h1>
            <p className="text-lg text-gray-600 mt-2">
              Gérez votre catalogue de produits agricoles
            </p>
          </div>
          <button
            onClick={() => setShowProductForm(true)}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <p className="text-sm text-gray-600 mb-1">Publiés</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isPublished).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Brouillons</p>
              <p className="text-2xl font-bold text-orange-600">
                {products.filter(p => !p.isPublished).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus Produits</p>
              <p className="text-2xl font-bold text-blue-600">
                {(stats.totalRevenue || 0).toLocaleString()} FCFA
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filtre catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes catégories</option>
            <option value="fruits">Fruits</option>
            <option value="légumes">Légumes</option>
            <option value="céréales">Céréales</option>
            <option value="tubercules">Tubercules</option>
            <option value="épices">Épices</option>
            <option value="élevage">Élevage</option>
            <option value="produits-transformés">Produits transformés</option>
            <option value="frais">Produits frais</option>
            <option value="sec">Produits secs</option>
            <option value="autre">Autre</option>
          </select>

          {/* Filtre statut */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Produit
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Prix
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {error && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                    {searchTerm || selectedCategory ? 'Aucun produit trouvé' : 'Aucun produit ajouté'}
                  </td>
                </tr>
              )}
              {!loading && !error && products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Product Name with Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700 overflow-hidden">
                        {getProductImageUrl(product) ? (
                          <img 
                            src={getProductImageUrl(product)} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          product.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-gray-800 font-medium">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category}
                          {product.isOrganic && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Bio
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div className="text-gray-700 font-medium">
                      {product.price} FCFA/{product.unit}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <div className="text-gray-700">
                      {product.stock} {product.unit}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {/* Toggle Visibility */}
                      {product.isPublished ? (
                        <button
                          onClick={() => handleUnpublishProduct(product._id)}
                          className="p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                          title="Dépublier"
                        >
                          <EyeOff className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublishProduct(product._id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Publier"
                        >
                          <Eye className="w-4 h-4 text-green-600 group-hover:text-green-700" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {productsPagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-6 border-t">
            <button
              onClick={() => changeProductsPage(productsPagination.page - 1)}
              disabled={productsPagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-sm">
              Page {productsPagination.page} sur {productsPagination.totalPages}
            </span>
            <button
              onClick={() => changeProductsPage(productsPagination.page + 1)}
              disabled={productsPagination.page === productsPagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        )}
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
                  onClick={resetForm}
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
                  {productForm.image && (
                    <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {productForm.image.name}
                    </p>
                  )}
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
                      <option value="">Sélectionner une catégorie</option>
                      <option value="fruits">Fruits</option>
                      <option value="légumes">Légumes</option>
                      <option value="céréales">Céréales</option>
                      <option value="tubercules">Tubercules</option>
                      <option value="épices">Épices</option>
                      <option value="élevage">Élevage</option>
                      <option value="produits-transformés">Produits transformés</option>
                      <option value="frais">Produits frais</option>
                      <option value="sec">Produits secs</option>
                      <option value="autre">Autre</option>
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
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'En cours...' : (editingProduct ? 'Modifier' : 'Ajouter')} le produit
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

export default ProducerProducts;
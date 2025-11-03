import React from 'react';
import { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import ProducerLayout from '../../layouts/ProducerLayout';
import apiService from '../../services/apiService';

const ProducerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiService.getProducerProducts(1, 50);
        const payload = res || {};
        const list = (payload.data && (payload.data.products || payload.data.docs))
          || payload.products
          || Array.isArray(payload) ? payload : [];
        if (mounted) setProducts(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) {
          setError(e?.message || 'Erreur de chargement');
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleEdit = (productId) => {
    console.log('Edit product:', productId);
    // Logique d'édition à implémenter
  };

  const handleDelete = (productId) => {
    console.log('Delete product:', productId);
    // Logique de suppression à implémenter
  };

  return (
    <ProducerLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Liste des produits</h1>
      </div>

      {/* Products Table Card */}
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Chargement...</td></tr>
              )}
              {error && !loading && (
                <tr><td colSpan={4} className="px-6 py-6 text-center text-red-600">{error}</td></tr>
              )}
              {!loading && !error && products.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Aucun produit trouvé.</td></tr>
              )}
              {!loading && !error && products.map((product) => (
                <tr
                  key={product._id || product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Product Name with Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                        {(() => {
                          const base = import.meta.env.VITE_API_URL;
                          const origin = (() => { try { return new URL(base).origin } catch { return '' } })();
                          let src = product.imageUrl || product.image || '';
                          if (!src && Array.isArray(product.images) && product.images[0]) {
                            const raw = String(product.images[0] ?? '');
                            const file = raw.split(/[\\\/]/).pop();
                            if (file) src = `${origin}/uploads/${file}`;
                          }
                          if (src) {
                            return <img src={src} alt={product.name} className="w-full h-full object-cover" />
                          }
                          return (
                            <span className="text-green-700 font-semibold">{(product.name || '').charAt(0).toUpperCase()}</span>
                          );
                        })()}
                      </div>
                      <span className="text-gray-800 font-medium">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-gray-700">
                    {typeof product.price === 'number' ? `${product.price} CFA` : (product.price || '-')}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-gray-700">{product.stock ?? '-'}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(product._id || product.id)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                        title="Modifier"
                      >
                        <Edit2 className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(product._id || product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProducerLayout>
  );
};

export default ProducerProducts;
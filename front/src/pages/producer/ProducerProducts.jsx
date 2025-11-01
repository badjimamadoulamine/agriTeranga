import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import ProducerLayout from '../../layouts/ProducerLayout';

const ProducerProducts = () => {
  // Données des produits
  const products = [
    {
      id: 1,
      name: 'Tomates fraîches',
      image: '🍅',
      price: '2 500 CFA / kg',
      stock: '50 kg',
    },
    {
      id: 2,
      name: 'Carottes Bio',
      image: '🥕',
      price: '1 800 CFA / kg',
      stock: '35 kg',
    },
    {
      id: 3,
      name: 'Poivrons',
      image: '🫑',
      price: '3 000 CFA / kg',
      stock: '20 kg',
    },
    {
      id: 4,
      name: 'Aubergines',
      image: '🍆',
      price: '2 200 CFA / kg',
      stock: '40 kg',
    },
  ];

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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Product Name with Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <span className="text-gray-800 font-medium">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-gray-700">{product.price}</td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-gray-700">{product.stock}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                        title="Modifier"
                      >
                        <Edit2 className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(product.id)}
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
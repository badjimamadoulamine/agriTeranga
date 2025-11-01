import React, { useState } from 'react';

const villesSenegal = [
  "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Tambacounda",
  "Louga", "Kolda", "Fatick", "Matam", "Kaffrine", "Kédougou", "Sédhiou", "Diourbel"
];

export default function CommandeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-green-700 text-center">Tes coordonnées</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Ton nom</label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Ton téléphone</label>
            <input
              type="tel"
              required
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Ton email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Ton adresse</label>
            <select
              required
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">-- Choisis ta ville --</option>
              {villesSenegal.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

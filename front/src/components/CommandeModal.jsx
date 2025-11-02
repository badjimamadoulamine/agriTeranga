import React, { useState } from 'react';

const villesSenegal = [
  "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Tambacounda",
  "Louga", "Kolda", "Fatick", "Matam", "Kaffrine", "Kédougou", "Sédhiou", "Diourbel"
];
const pickupPoints = [
  'Point de retrait - Dakar Plateau',
  'Point de retrait - Yoff',
  'Point de retrait - Parcelles Assainies',
  'Point de retrait - Thiès Centre'
];
const farmLocations = [
  'Ferme - Thiès Nord',
  'Ferme - Mbour',
  'Ferme - Rufisque'
];

export default function CommandeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '', // ville
    rue: '',
    region: '',
    codePostal: '',
    pickupPoint: '',
    farmLocation: ''
  });
  const [deliveryMethod, setDeliveryMethod] = useState('home-delivery'); // 'home-delivery' | 'pickup-point' | 'farm-pickup'

  if (!isOpen) return null;

  // Sortie uniquement via boutons Annuler/Valider

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      deliveryInfo: {
        method: deliveryMethod,
        ...(deliveryMethod === 'home-delivery'
          ? {
              address: {
                city: formData.adresse || '',
                postalCode: formData.codePostal || ''
              }
            }
          : deliveryMethod === 'pickup-point'
          ? { pickupPoint: formData.pickupPoint }
          : deliveryMethod === 'farm-pickup'
          ? { farmLocation: formData.farmLocation }
          : {})
      }
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl p-6 w-96 md:w-[28rem] max-h-[85vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Fermer"
          >
            ×
          </button>
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
              <label className="block font-medium text-gray-700 mb-1">Choix du mode de livraison</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="deliveryMethod" value="home-delivery" checked={deliveryMethod === 'home-delivery'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                  <span>À domicile</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="deliveryMethod" value="pickup-point" checked={deliveryMethod === 'pickup-point'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                  <span>Point de retrait</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="deliveryMethod" value="farm-pickup" checked={deliveryMethod === 'farm-pickup'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                  <span>À la ferme</span>
                </label>
              </div>
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

            {deliveryMethod === 'home-delivery' && (
              <div className="space-y-3">
                <div>
                  <label className="block font-medium text-gray-700">Ville</label>
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
                <div>
                  <label className="block font-medium text-gray-700">Code postal</label>
                  <input
                    type="text"
                    value={formData.codePostal}
                    onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}

            {deliveryMethod === 'pickup-point' && (
              <div>
                <label className="block font-medium text-gray-700">Choisir un point de retrait</label>
                <select
                  required
                  value={formData.pickupPoint}
                  onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">-- Sélectionne un point de retrait --</option>
                  {pickupPoints.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {deliveryMethod === 'farm-pickup' && (
              <div>
                <label className="block font-medium text-gray-700">Choisir une ferme</label>
                <select
                  required
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">-- Sélectionne une ferme --</option>
                  {farmLocations.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}

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
    </div>
  );
}

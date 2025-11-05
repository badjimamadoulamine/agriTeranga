import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const villesSenegal = [
  "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Tambacounda",
  "Louga", "Kolda", "Fatick", "Matam", "Kaffrine", "Kédougou", "Sédhiou", "Diourbel"
];
// Tarifs de livraison par ville (exemples)
const cityDeliveryPrice = (ville) => {
  if (ville === 'Dakar') return 500;
  if (ville === 'Thiès') return 1000;
  return 1500; // par défaut
};
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
  const { user } = useAuth();
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
  const [errors, setErrors] = useState({});

  // Auto-remplir depuis la base (utilisateur connecté)
  useEffect(() => {
    if (!isOpen) return;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    const phone = user?.phone || '';
    const email = user?.email || '';
    const rawAddress = user?.consumerInfo?.deliveryAddress || user?.address || user?.adresse || '';
    // Tenter de faire correspondre la ville aux options existantes (insensible à la casse)
    let ville = '';
    if (typeof rawAddress === 'string' && rawAddress) {
      const lower = rawAddress.toLowerCase();
      const match = villesSenegal.find(v => v.toLowerCase() === lower);
      ville = match || '';
    }
    setFormData(prev => ({
      ...prev,
      nom: fullName || prev.nom,
      telephone: phone || prev.telephone,
      email: email || prev.email,
      adresse: ville || prev.adresse
    }));
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Sortie uniquement via boutons Annuler/Valider

  const validate = (data) => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[+]?\d{6,15}$/;
    if (!data.nom || data.nom.trim().length < 2) e.nom = 'Nom requis';
    if (!data.telephone || !phoneRe.test(String(data.telephone).trim())) e.telephone = 'Téléphone invalide';
    if (!data.email || !emailRe.test(String(data.email).trim())) e.email = 'Email invalide';
    if (deliveryMethod === 'home-delivery') {
      if (!data.adresse) e.adresse = 'Ville requise';
      const cp = String(data.codePostal || '').trim();
      if (!cp) e.codePostal = 'Code postal requis';
      else if (!/^[A-Za-z0-9 \-]{3,10}$/.test(cp)) e.codePostal = 'Code postal invalide';
    } else if (deliveryMethod === 'pickup-point') {
      if (!data.pickupPoint) e.pickupPoint = 'Point de retrait requis';
    } else if (deliveryMethod === 'farm-pickup') {
      if (!data.farmLocation) e.farmLocation = 'Ferme requise';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eMap = validate(formData);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
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
      },
      deliveryFee: deliveryMethod === 'home-delivery' && formData.adresse ? cityDeliveryPrice(formData.adresse) : 0
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
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Ton nom</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => { const v = e.target.value; setFormData({ ...formData, nom: v }); setErrors(prev=>({ ...prev, nom: '' })); }}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.nom ? 'border-red-500' : ''}`}
              />
              {errors.nom ? <p className="text-sm text-red-600 mt-1">{errors.nom}</p> : null}
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
                onChange={(e) => { const v = e.target.value; setFormData({ ...formData, telephone: v }); setErrors(prev=>({ ...prev, telephone: '' })); }}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.telephone ? 'border-red-500' : ''}`}
              />
              {errors.telephone ? <p className="text-sm text-red-600 mt-1">{errors.telephone}</p> : null}
            </div>

            <div>
              <label className="block font-medium text-gray-700">Ton email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => { const v = e.target.value; setFormData({ ...formData, email: v }); setErrors(prev=>({ ...prev, email: '' })); }}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email ? <p className="text-sm text-red-600 mt-1">{errors.email}</p> : null}
            </div>

            {deliveryMethod === 'home-delivery' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-medium text-gray-700">Ville</label>
                    <span className="text-sm text-gray-600">
                      {formData.adresse ? `${cityDeliveryPrice(formData.adresse)} CFA` : ''}
                    </span>
                  </div>
                  <select
                    required
                    value={formData.adresse}
                    onChange={(e) => { const v = e.target.value; setFormData({ ...formData, adresse: v }); setErrors(prev=>({ ...prev, adresse: '' })); }}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.adresse ? 'border-red-500' : ''}`}
                  >
                    <option value="">-- Choisis ta ville --</option>
                    {villesSenegal.map((ville) => (
                      <option key={ville} value={ville}>{`${ville} — ${cityDeliveryPrice(ville)} CFA`}</option>
                    ))}
                  </select>
                  {errors.adresse ? <p className="text-sm text-red-600 mt-1">{errors.adresse}</p> : null}
                </div>
                <div>
                  <label className="block font-medium text-gray-700">Code postal</label>
                  <input
                    type="text"
                    value={formData.codePostal}
                    onChange={(e) => { const v = e.target.value; setFormData({ ...formData, codePostal: v }); setErrors(prev=>({ ...prev, codePostal: '' })); }}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.codePostal ? 'border-red-500' : ''}`}
                  />
                  {errors.codePostal ? <p className="text-sm text-red-600 mt-1">{errors.codePostal}</p> : null}
                </div>
              </div>
            )}

            {deliveryMethod === 'pickup-point' && (
              <div>
                <label className="block font-medium text-gray-700">Choisir un point de retrait</label>
                <select
                  required
                  value={formData.pickupPoint}
                  onChange={(e) => { const v = e.target.value; setFormData({ ...formData, pickupPoint: v }); setErrors(prev=>({ ...prev, pickupPoint: '' })); }}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.pickupPoint ? 'border-red-500' : ''}`}
                >
                  <option value="">-- Sélectionne un point de retrait --</option>
                  {pickupPoints.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.pickupPoint ? <p className="text-sm text-red-600 mt-1">{errors.pickupPoint}</p> : null}
              </div>
            )}

            {deliveryMethod === 'farm-pickup' && (
              <div>
                <label className="block font-medium text-gray-700">Choisir une ferme</label>
                <select
                  required
                  value={formData.farmLocation}
                  onChange={(e) => { const v = e.target.value; setFormData({ ...formData, farmLocation: v }); setErrors(prev=>({ ...prev, farmLocation: '' })); }}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 ${errors.farmLocation ? 'border-red-500' : ''}`}
                >
                  <option value="">-- Sélectionne une ferme --</option>
                  {farmLocations.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                {errors.farmLocation ? <p className="text-sm text-red-600 mt-1">{errors.farmLocation}</p> : null}
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

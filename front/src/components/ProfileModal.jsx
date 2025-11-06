import React, { useState, useEffect } from 'react';
import { X, Camera, User, Phone, Mail, MapPin, Truck, Sprout, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfileModal = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdateProfile, 
  onChangePassword, 
  onRefreshProfile 
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // États pour le profil
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    // Champs producteur
    producteurInfo: {
      cultureType: '',
      region: '',
      farmSize: '',
      description: '',
      certificates: []
    },
    // Champs livreur
    livreurInfo: {
      deliveryZone: '',
      vehicleType: '',
      isAvailable: true
    }
  });

  // États pour le mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Mettre à jour le formulaire quand le profil change
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        producteurInfo: {
          cultureType: profile.producteurInfo?.cultureType || '',
          region: profile.producteurInfo?.region || '',
          farmSize: profile.producteurInfo?.farmSize || '',
          description: profile.producteurInfo?.description || '',
          certificates: profile.producteurInfo?.certificates || []
        },
        livreurInfo: {
          deliveryZone: profile.livreurInfo?.deliveryZone || '',
          vehicleType: profile.livreurInfo?.vehicleType || '',
          isAvailable: profile.livreurInfo?.isAvailable ?? true
        }
      });
      if (profile.profilePicture) {
        setPreviewUrl(profile.profilePicture);
      }
    }
  }, [profile]);

  // Réinitialiser le formulaire quand on ferme/reouvre le modal
  useEffect(() => {
    if (!isOpen) {
      setProfilePicture(null);
      setPreviewUrl(null);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [isOpen]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('producteurInfo.')) {
      const field = name.split('.')[1];
      setProfileForm(prev => ({
        ...prev,
        producteurInfo: {
          ...prev.producteurInfo,
          [field]: value
        }
      }));
    } else if (name.startsWith('livreurInfo.')) {
      const field = name.split('.')[1];
      const newValue = field === 'isAvailable' ? value === 'true' : value;
      setProfileForm(prev => ({
        ...prev,
        livreurInfo: {
          ...prev.livreurInfo,
          [field]: newValue
        }
      }));
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone
      };

      // Ajouter les informations spécifiques au rôle
      if (profile?.role === 'producteur') {
        profileData.producteurInfo = profileForm.producteurInfo;
      } else if (profile?.role === 'livreur') {
        profileData.livreurInfo = profileForm.livreurInfo;
      }

      // Ajouter la photo si elle existe
      if (profilePicture) {
        profileData.profilePicture = profilePicture;
      }

      const response = await onUpdateProfile(profileData);
      
      // Vérifier le succès de la mise à jour
      if (response && response.status === 'success') {
        toast.success('Profil mis à jour avec succès');
        await onRefreshProfile();
        onClose();
      }
    } catch (error) {
      console.error('Erreur profil:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const success = await onChangePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Erreur mot de passe:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileForm = () => (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      {/* Photo de profil */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-semibold">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Photo de profil" 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              profile?.firstName?.[0] || 'U'
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
            <Camera className="w-4 h-4" />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Prénom
          </label>
          <input
            type="text"
            name="firstName"
            value={profileForm.firstName}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Votre prénom"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nom
          </label>
          <input
            type="text"
            name="lastName"
            value={profileForm.lastName}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Votre nom"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Téléphone
        </label>
        <input
          type="tel"
          name="phone"
          value={profileForm.phone}
          onChange={handleProfileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Votre numéro de téléphone"
          required
        />
      </div>

      {/* Champs spécifiques au rôle */}
      {profile?.role === 'producteur' && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <Sprout className="w-5 h-5 mr-2 text-green-600" />
            Informations Producteur
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de culture
              </label>
              <input
                type="text"
                name="producteurInfo.cultureType"
                value={profileForm.producteurInfo.cultureType}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Légumes biologiques"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Région
              </label>
              <input
                type="text"
                name="producteurInfo.region"
                value={profileForm.producteurInfo.region}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre région"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille de l'exploitation (hectares)
            </label>
            <input
              type="number"
              name="producteurInfo.farmSize"
              value={profileForm.producteurInfo.farmSize}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: 5"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="producteurInfo.description"
              value={profileForm.producteurInfo.description}
              onChange={handleProfileChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Décrivez votre activité..."
            />
          </div>
        </div>
      )}

      {profile?.role === 'livreur' && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-green-600" />
            Informations Livreur
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Zone de livraison
              </label>
              <input
                type="text"
                name="livreurInfo.deliveryZone"
                value={profileForm.livreurInfo.deliveryZone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Centre-ville"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de véhicule
              </label>
              <select
                name="livreurInfo.vehicleType"
                value={profileForm.livreurInfo.vehicleType}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="voiture">Voiture</option>
                <option value="moto">Moto</option>
                <option value="velo">Vélo</option>
                <option value="camion">Camion</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="livreurInfo.isAvailable"
                checked={profileForm.livreurInfo.isAvailable}
                onChange={(e) => handleProfileChange({
                  target: {
                    name: 'livreurInfo.isAvailable',
                    value: e.target.checked.toString()
                  }
                })}
                className="mr-2 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Disponible pour les livraisons
              </span>
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Save className="w-5 h-5 mr-2" />
        )}
        {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
      </button>
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handleChangePassword} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe actuel
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
            placeholder="Votre mot de passe actuel"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
            placeholder="Au moins 8 caractères"
            required
            minLength="8"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer le nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
            placeholder="Répétez le nouveau mot de passe"
            required
            minLength="8"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Save className="w-5 h-5 mr-2" />
        )}
        {loading ? 'Modification...' : 'Changer le mot de passe'}
      </button>
    </form>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mon Profil</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Mot de passe
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'profile' && renderProfileForm()}
          {activeTab === 'password' && renderPasswordForm()}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
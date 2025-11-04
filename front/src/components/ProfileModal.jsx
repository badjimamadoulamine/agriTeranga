import React, { useState, useEffect } from 'react';
import { X, Camera, User, Phone, Mail, MapPin, Truck, Sprout, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../services/apiService';

const ProfileModal = ({ isOpen, onClose, userRole = 'consommateur' }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  // États pour le profil
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profilePicture: null,
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

  // Charger le profil au montage
  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await apiService.getMyProfile();
      if (response.status === 'success' && response.data?.user) {
        const user = response.data.user;
        setProfile(user);
        setProfileForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          profilePicture: null,
          producteurInfo: {
            cultureType: user.producteurInfo?.cultureType || '',
            region: user.producteurInfo?.region || '',
            farmSize: user.producteurInfo?.farmSize || '',
            description: user.producteurInfo?.description || '',
            certificates: user.producteurInfo?.certificates || []
          },
          livreurInfo: {
            deliveryZone: user.livreurInfo?.deliveryZone || '',
            vehicleType: user.livreurInfo?.vehicleType || '',
            isAvailable: user.livreurInfo?.isAvailable ?? true
          }
        });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
      console.error('Erreur profil:', error);
    } finally {
      setProfileLoading(false);
    }
  };

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
      setProfileForm(prev => ({
        ...prev,
        profilePicture: file
      }));
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
      if (userRole === 'producteur' || userRole === 'producer') {
        profileData.producteurInfo = profileForm.producteurInfo;
      } else if (userRole === 'livreur' || userRole === 'deliverer') {
        profileData.livreurInfo = profileForm.livreurInfo;
      }

      // Ajouter la photo si elle existe
      if (profileForm.profilePicture) {
        profileData.profilePicture = profileForm.profilePicture;
      }

      const response = await apiService.updateProfile(profileData);
      
      if (response.status === 'success') {
        toast.success('Profil mis à jour avec succès');
        onClose();
        // Recharger la page pour refléter les changements
        window.location.reload();
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error('Erreur profil:', error);
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
      const response = await apiService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (response.status === 'success') {
        toast.success('Mot de passe modifié avec succès');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(message);
      console.error('Erreur mot de passe:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileFields = () => {
    const baseFields = [
      {
        name: 'firstName',
        label: 'Prénom',
        type: 'text',
        required: true
      },
      {
        name: 'lastName',
        label: 'Nom',
        type: 'text',
        required: true
      },
      {
        name: 'phone',
        label: 'Téléphone',
        type: 'tel'
      }
    ];

    if (userRole === 'producteur' || userRole === 'producer') {
      baseFields.push(
        {
          name: 'producteurInfo.cultureType',
          label: 'Type de culture',
          type: 'text'
        },
        {
          name: 'producteurInfo.region',
          label: 'Région',
          type: 'text'
        },
        {
          name: 'producteurInfo.farmSize',
          label: 'Taille de l\'exploitation',
          type: 'text'
        },
        {
          name: 'producteurInfo.description',
          label: 'Description',
          type: 'textarea',
          rows: 3
        }
      );
    } else if (userRole === 'livreur' || userRole === 'deliverer') {
      baseFields.push(
        {
          name: 'livreurInfo.deliveryZone',
          label: 'Zone de livraison',
          type: 'text'
        },
        {
          name: 'livreurInfo.vehicleType',
          label: 'Type de véhicule',
          type: 'text'
        },
        {
          name: 'livreurInfo.isAvailable',
          label: 'Disponible',
          type: 'select',
          options: [
            { value: true, label: 'Disponible' },
            { value: false, label: 'Indisponible' }
          ]
        }
      );
    }

    return baseFields;
  };

  const renderProfileForm = () => (
    <form onSubmit={handleUpdateProfile} className="space-y-4">
      {/* Photo de profil */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileForm.profilePicture ? (
              <img 
                src={URL.createObjectURL(profileForm.profilePicture)} 
                alt="Photo de profil" 
                className="w-full h-full object-cover"
              />
            ) : profile?.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt="Photo de profil" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full cursor-pointer hover:bg-green-700">
            <Camera className="w-3 h-3" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {profileForm.firstName} {profileForm.lastName}
          </h3>
          <p className="text-sm text-gray-500">{userRole}</p>
        </div>
      </div>

      {/* Champs du formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getProfileFields().map((field) => (
          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={field.name.startsWith('livreurInfo.') 
                  ? profileForm.livreurInfo[field.name.split('.')[1]]?.toString() || 'true'
                  : profileForm[field.name] || ''
                }
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={field.name.startsWith('producteurInfo.')
                  ? profileForm.producteurInfo[field.name.split('.')[1]] || ''
                  : profileForm[field.name] || ''
                }
                onChange={handleProfileChange}
                rows={field.rows || 3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={field.name.startsWith('producteurInfo.')
                  ? profileForm.producteurInfo[field.name.split('.')[1]] || ''
                  : field.name.startsWith('livreurInfo.')
                  ? profileForm.livreurInfo[field.name.split('.')[1]] || ''
                  : profileForm[field.name] || ''
                }
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ancien mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPasswords.current ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nouveau mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Modification...' : 'Modifier le mot de passe'}</span>
        </button>
      </div>
    </form>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Mon Profil
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
        <div className="p-6">
          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && renderProfileForm()}
              {activeTab === 'password' && renderPasswordForm()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
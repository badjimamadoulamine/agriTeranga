import { Bell, LogOut, User, Settings, X, GraduationCap, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileModal from '../ProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { getProfilePictureUrl } from '../../utils/imageUtils';
import useProducerData from '../../hooks/useProducerData';
import apiService from '../../services/apiService';

const ProducerHeader = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const {
    profile,
    profileLoading,
    profileError,
    updateProfile,
    changePassword,
    getProfile,
    refreshProfile
  } = useProducerData();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger le profil au montage
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Charger les notifications (nouvelles formations)
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Récupérer les formations récentes (ajoutées dans les 7 derniers jours)
        const response = await apiService.getFormations({ page: 1, limit: 10 });
        
        if (response.status === 'success') {
          const formations = response.data?.formations || response.data?.items || [];
          
          // Filtrer les formations ajoutées dans les 7 derniers jours
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const recentFormations = formations.filter(formation => {
            const createdAt = new Date(formation.createdAt);
            return createdAt > sevenDaysAgo;
          });

          // Créer des notifications pour les nouvelles formations
          const formationNotifications = recentFormations.map(formation => ({
            id: formation._id,
            type: 'formation',
            title: 'Nouvelle formation disponible',
            message: formation.title,
            date: formation.createdAt,
            read: false,
            link: '/producer/formations'
          }));

          setNotifications(formationNotifications);
          setUnreadCount(formationNotifications.length);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    };

    loadNotifications();
    
    // Recharger les notifications toutes les 5 minutes
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Formater la date
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right Section: Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to={notification.link}
                          onClick={() => {
                            markAsRead(notification.id);
                            setShowNotifications(false);
                          }}
                          className={`block p-4 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-green-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'formation' 
                                ? 'bg-blue-100' 
                                : 'bg-green-100'
                            }`}>
                              {notification.type === 'formation' ? (
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Bell className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {formatNotificationDate(notification.date)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <Link
                      to="/producer/formations"
                      onClick={() => setShowNotifications(false)}
                      className="block text-center text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Voir toutes les formations →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* User Avatar avec profil détaillé */}
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
                      src={`${getProfilePictureUrl(profile.profilePicture)}${avatarVersion ? `?v=${avatarVersion}` : ''}`}
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
            
            {/* Logout Button */}
            <button 
              onClick={() => setShowConfirm(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmer la déconnexion</h3>
            <p className="text-sm text-gray-600 mb-6">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => { setShowConfirm(false); logout(); }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={profile}
          onUpdateProfile={updateProfile}
          onChangePassword={changePassword}
          onRefreshProfile={async () => {
            await refreshProfile();
            setAvatarVersion(Date.now());
          }}
        />
      )}
    </header>
  );
};

export default ProducerHeader;
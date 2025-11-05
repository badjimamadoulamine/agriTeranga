  const handleUpdateProfile = async (profileData) => {
    try {
      const fn = typeof apiService.updateProfile === 'function' ? apiService.updateProfile : apiService.updateMyProfile;
      const res = await fn.call(apiService, profileData);
      const ok = res && res.status === 'success';
      if (ok) setAvatarVersion(Date.now());
      return ok;
    } catch (e) {
      return false;
    }
  };

  const handleChangePassword = async (data) => {
    try {
      const fn = typeof apiService.changePassword === 'function' ? apiService.changePassword : apiService.changeMyPassword;
      const res = await fn.call(apiService, data);
      return res && res.status === 'success';
    } catch (e) {
      return false;
    }
  };

  const handleRefreshProfile = async () => {
    try {
      // Optionally refetch profile; here we just bump avatar to refresh picture URL
      setAvatarVersion(Date.now());
    } catch {}
  };
import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfilePictureUrl } from '../../utils/imageUtils';
import ProfileModal from '../ProfileModal';
import apiService from '../../services/apiService';
import { io } from 'socket.io-client';

const DeliveryHeader = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef(null);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  // Socket.IO client
  useEffect(() => {
    if (!user) return;
    try {
      const token =
        localStorage.getItem('deliveryDashboardToken') ||
        localStorage.getItem('token');
      const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1')
        .replace(/\/?api\/v1\/?$/, '');
      const socket = io(base, {
        transports: ['websocket'],
        auth: { token }
      });
      socketRef.current = socket;

      const pushNotif = (n) => {
        setNotifications((prev) => [
          { id: Date.now() + Math.random(), ...n, createdAt: new Date().toISOString(), read: false },
          ...prev
        ].slice(0, 50));
        setUnread((u) => u + 1);
      };

      socket.on('notifications:hello', () => {});
      socket.on('delivery:new-assignment', (payload) => {
        pushNotif({
          type: 'new-assignment',
          title: 'Nouvelle commande assignée',
          message: `Commande ${payload?.orderNumber || ''} vous a été assignée.`
        });
      });
      socket.on('delivery:cancelled', (payload) => {
        pushNotif({
          type: 'cancelled',
          title: 'Commande annulée',
          message: `Commande ${payload?.orderNumber || ''} a été annulée.`
        });
      });
      socket.on('order:status-changed', (payload) => {
        pushNotif({
          type: 'status',
          title: 'Statut mis à jour',
          message: `Commande ${payload?.orderNumber || ''}: ${payload?.status || ''}`
        });
      });

      return () => {
        try { socket.disconnect(); } catch {}
      };
    } catch {}
  }, [user]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end gap-4">
        <div className="relative">
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-sm font-semibold text-gray-700">Notifications</span>
                <button onClick={markAllAsRead} className="text-xs text-green-600 hover:underline">Tout marquer comme lu</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-gray-500">Aucune notification</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-3 py-2 text-sm ${n.read ? 'bg-white' : 'bg-green-50'}`}>
                      <div className="font-medium text-gray-800">{n.title}</div>
                      <div className="text-gray-600 text-xs">{n.message}</div>
                      <div className="text-gray-400 text-[10px] mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition">
              <img
                src={`${getProfilePictureUrl(user.profilePicture)}${avatarVersion ? `?v=${avatarVersion}` : ''}`}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProfilePictureUrl(null); }}
                alt="Profil"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">{user.firstName}</span>
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button
                className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-green-50 transition"
                onClick={() => { setShowProfileModal(true); }}
              >
                Mon Profil
              </button>
              <hr className="my-1" />
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
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
                onClick={() => { setShowConfirm(false); handleLogout(); }}
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
          profile={user}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          onRefreshProfile={handleRefreshProfile}
        />
      )}
    </header>
  );
};

export default DeliveryHeader;
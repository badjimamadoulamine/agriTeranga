import { Bell, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProducerProfileModal from './ProducerProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { getProfilePictureUrl } from '../../utils/imageUtils';

const ProducerHeader = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
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
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={`${getProfilePictureUrl(user?.profilePicture)}${avatarVersion ? `?v=${avatarVersion}` : ''}`}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:block text-sm text-gray-700 font-medium">{user?.firstName}</span>
            </button>
            
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
        <ProducerProfileModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onUpdated={() => {
            setAvatarVersion(Date.now());
            setShowProfileModal(false);
          }}
        />
      )}
    </header>
  );
};

export default ProducerHeader;
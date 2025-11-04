import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeliveryHeader = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    
    // Afficher un message de confirmation
    toast.success('Déconnexion réussie');
    
    // Appeler la fonction onLogout si fournie (pour le parent)
    if (onLogout) {
      onLogout();
    }
    
    // Rediriger vers la page principale
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {/* Badge de notification (optionnel) */}
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DeliveryHeader;
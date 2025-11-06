import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Clock, LogOut } from 'lucide-react';
import logo from "../../assets/logo.png";

const DeliverySidebar = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/delivery/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble'
    },
    {
      path: '/delivery/deliveries',
      label: 'Livraisons',
      icon: Truck,
      description: 'Mes livraisons'
    },
    {
      path: '/delivery/history',
      label: 'Historique',
      icon: Clock,
      description: 'Historique des livraisons'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Supprimer les tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('deliveryDashboardToken');
    localStorage.removeItem('deliveryDashboardUser');
    
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } h-screen flex flex-col border-r border-gray-200`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img src={logo} alt="AgriTeranga" className="h-10 w-auto object-contain" />
            </div>
          )}
          <div className="flex items-center space-x-1">
            {/* Bouton collapse pour desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isCollapsed ? 'Déplier' : 'Réduire'}
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Bouton fermer pour mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fermer"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${
                  active ? 'text-green-700' : 'text-gray-500'
                } ${!isCollapsed ? 'mr-3' : ''}`} />
                {!isCollapsed && (
                  <span className="flex-1 font-medium">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className={`group w-full flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              isCollapsed ? 'px-3 py-2' : 'px-3 py-2'
            }`}
            title={isCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut className={`w-5 h-5 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span className="font-medium">Déconnexion</span>}
            {isCollapsed && (
              <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                Déconnexion
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverySidebar;
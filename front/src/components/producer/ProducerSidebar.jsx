import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Scale, BookOpen } from 'lucide-react';
import logo from "../../assets/logo.png"

const ProducerSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/producer/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble'
    },
    {
      path: '/producer/products',
      label: 'Mes produits',
      icon: Package,
      description: 'Gestion des produits'
    },
    {
      path: '/producer/statistics',
      label: 'Statistiques',
      icon: BarChart3,
      description: 'Performances'
    },
    {
      path: '/producer/sales',
      label: 'Ventes',
      icon: Scale,
      description: 'Gestion des ventes'
    },
    {
      path: '/producer/formations',
      label: 'Formations',
      icon: BookOpen,
      description: 'Formations disponibles'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`bg-white h-screen flex flex-col border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header avec Logo et bouton collapse */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="AgriTeranga logo" className="h-10 object-contain" />
            </div>
          )}
          
          {/* Bouton collapse/expand */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isCollapsed ? 'Déplier' : 'Réduire'}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg transition-colors relative group ${
                    isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                  } ${
                    active
                      ? 'bg-[#EBF8E7] text-[#59C94F] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-[#59C94F]' : ''}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                  
                  {/* Tooltip pour mode collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-20 bg-gray-800 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-300">{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ProducerSidebar;
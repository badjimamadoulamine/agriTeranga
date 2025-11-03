import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Scale, BookOpen } from 'lucide-react';
import logo from "../../assets/logo.png"

const ProducerSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/producer/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard
    },
    {
      path: '/producer/products',
      label: 'Mes produits',
      icon: Package
    },
    {
      path: '/producer/statistics',
      label: 'Statistiques',
      icon: BarChart3
    },
    {
      path: '/producer/sales',
      label: 'Ventes',
      icon: Scale
    },
    {
      path: '/producer/formations',
      label: 'Formations',
      icon: BookOpen
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="AgriTeranga logo" className="h-10 object-contain" />
            </div>
          </div>
      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#EBF8E7] text-[#59C94F] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
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
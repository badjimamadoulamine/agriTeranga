import ProducerLayout from '../../layouts/ProducerLayout';
import { DollarSign, ShoppingCart, Sprout, Eye } from 'lucide-react';

const ProducerStatistics = () => {
  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Ventes totales',
      value: '1,250,000 FCFA',
      icon: DollarSign,
      bgColor: 'bg-[#59C94F]',
      iconColor: 'text-white'
    },
    {
      title: 'Commandes',
      value: '320',
      icon: ShoppingCart,
      bgColor: 'bg-[#7FB8E1]',
      iconColor: 'text-white'
    },
    {
      title: 'Produits actifs',
      value: '45',
      icon: Sprout,
      bgColor: 'bg-[#F5CE5F]',
      iconColor: 'text-white'
    },
    {
      title: 'Vues totales',
      value: '12.5k',
      icon: Eye,
      bgColor: 'bg-[#E55F5F]',
      iconColor: 'text-white'
    }
  ];

  // Chart Data
  const chartData = [
    { month: 'JANVIER', bar: 28, line: 32 },
    { month: 'FÉVRIER', bar: 35, line: 38 },
    { month: 'MARS', bar: 48, line: 52 },
    { month: 'AVRIL', bar: 58, line: 62 },
    { month: 'MAI', bar: 70, line: 75 },
    { month: 'JUIN', bar: 85, line: 95 }
  ];

  // Top Products Data
  const topProducts = [
    { name: 'Tomates', quantity: '150 kg', percentage: 100 },
    { name: 'Oignons', quantity: '120 kg', percentage: 80 },
    { name: 'Piments', quantity: '95 kg', percentage: 63 },
    { name: 'Carottes', quantity: '80 kg', percentage: 53 },
    { name: 'Pommes de terre', quantity: '65 kg', percentage: 43 }
  ];

  return (
    <ProducerLayout
      pageTitle="Statistiques"
      pageSubtitle="Aperçu des performances de votre ferme"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.bgColor} ${card.iconColor} p-3 rounded-full`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Chart and Top Products */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sales Statistics Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#2A426F] uppercase mb-6">
            STATISTIQUES DE VENTE DE PRODUITS
          </h3>
          
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border-t border-gray-200"></div>
                ))}
              </div>

              {/* Bars and Line */}
              <div className="relative h-full flex items-end justify-between gap-4 pb-8">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center relative">
                    {/* Line point */}
                    <div
                      className="absolute w-3 h-3 bg-[#D24D57] rounded-full border-2 border-white z-10"
                      style={{ bottom: `${data.line}%` }}
                    ></div>
                    {/* Line connector */}
                    {index < chartData.length - 1 && (
                      <div
                        className="absolute w-full h-0.5 bg-[#D24D57]"
                        style={{
                          bottom: `${data.line}%`,
                          left: '50%',
                          width: 'calc(100% + 1rem)',
                          transformOrigin: 'left center',
                          transform: `rotate(${Math.atan2(
                            chartData[index + 1].line - data.line,
                            100 / chartData.length
                          )}rad)`
                        }}
                      ></div>
                    )}
                    {/* Bar */}
                    <div
                      className="w-full bg-[#2A426F] rounded-t"
                      style={{ height: `${data.bar}%` }}
                    ></div>
                    {/* Month label */}
                    <span className="absolute -bottom-6 text-xs text-gray-600 whitespace-nowrap">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Produits les plus vendus
          </h3>
          
          <div className="space-y-5">
            {topProducts.map((product, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">{product.name}</span>
                  <span className="text-gray-600">{product.quantity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#59C94F] h-2 rounded-full"
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProducerLayout>
  );
};

export default ProducerStatistics;
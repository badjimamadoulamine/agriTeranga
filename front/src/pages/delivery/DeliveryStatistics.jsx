import React from 'react';
import DeliveryLayout from '../../layouts/DeliveryLayout';
import useDeliveryData from '../../hooks/useDeliveryData';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const DeliveryStatistics = () => {
  const { stats } = useDeliveryData();

  // Données exemples (à remplacer si des stats backend existent)
  const performanceData = [
    { month: 'Jan', completed: 45, earnings: 125000 },
    { month: 'Fév', completed: 38, earnings: 98000 },
    { month: 'Mar', completed: 52, earnings: 143000 },
    { month: 'Avr', completed: 41, earnings: 118000 },
    { month: 'Mai', completed: 47, earnings: 135000 },
    { month: 'Juin', completed: 43, earnings: 128000 },
  ];

  const deliveryStatusData = [
    { name: 'Livrées', value: stats.completedDeliveries || 0 },
    { name: 'En cours', value: (stats.inTransitDeliveries ?? stats.pendingDeliveries) || 0 },
    { name: 'En préparation', value: stats.inPreparationDeliveries || 0 },
    { name: 'Annulées', value: stats.cancelledDeliveries || 0 },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <DeliveryLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Statistiques</h1>


        {/* Répartition des livraisons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition des livraisons</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deliveryStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryStatistics;

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Commandes</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Produits</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Messages</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
        <p className="text-gray-600">Aucune activité pour le moment</p>
      </div>
    </div>
  )
}

export default Dashboard

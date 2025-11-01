import ProducerLayout from '../../layouts/ProducerLayout';

const ProducerFormations = () => {
  return (
    <ProducerLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Formations</h1>
          <p className="text-lg text-gray-600">Découvrez et suivez des formations pour développer votre activité.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-700">
            Cette section est dédiée aux formations pour les producteurs. Intégrez ici la liste des formations,
            l'inscription, et le suivi de progression.
          </p>
        </div>
      </div>
    </ProducerLayout>
  );
};

export default ProducerFormations;

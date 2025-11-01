import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LivraisonDetailsModal from '../components/LivraisonDetailsModal';

const Livraison = ({ onOpenRegister, onOpenLogin }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleRetour = () => navigate('/panier');
  const handleVoirDetails = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header global */}
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />

      <section 
        className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/livraison.jpg')`
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Suivi de votre livraison
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white">
            Restez informé en temps réel sur l'avancée de votre commande
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col space-y-8">
        {/* Bloc 1: Informations de commande */}
        <div className="bg-white rounded-lg p-6 shadow-sm w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#333333] mb-1">Commande #AT-12345</h3>
              <p className="text-sm text-[#888888]">Livraison estimée : 25 Décembre 2025</p>
            </div>
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img
                src="/src/assets/livreur.jpg"
                alt="Produits de la commande"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button
            onClick={handleVoirDetails}
            className="bg-[#387C3F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2F6118] transition-colors"
          >
            Voir les détails
          </button>
        </div>

        {/* Bloc 2: Progression de la livraison */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Progression de la livraison</h3>
          <div className="flex justify-between items-center relative">
            {/* Barre horizontale */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-green-600 z-0"></div>

            {/* Étapes */}
            <div className="flex justify-between w-full relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <Check size={20} className="text-white" />
                </div>
                <span className="text-gray-800 font-medium text-center text-sm">En préparation</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <Truck size={20} className="text-white" />
                </div>
                <span className="text-gray-800 font-medium text-center text-sm">En route</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                </div>
                <span className="text-gray-800 font-medium text-center text-sm">Livré</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 3: Alerte de proximité */}
        <div className="bg-green-100 rounded-xl p-4 flex items-start w-full">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="text-green-700 font-bold mb-1">Votre livreur est à proximité !</h4>
            <p className="text-gray-800 text-sm">Il devrait arriver dans environ 5 minutes.</p>
          </div>
        </div>
      </main>

      {/* Footer global */}
      <Footer />

      {/* Modal des détails de livraison */}
      <LivraisonDetailsModal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        commandeDetails={{}}
      />
    </div>
  );
};

export default Livraison;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = ({ onOpenRegister, onOpenLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ouvrir automatiquement le modal de connexion
    onOpenLogin();
    // Si nécessaire, rester sur la page actuelle sans navigation
    navigate('/'); 
  }, [onOpenLogin, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />

      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border-2 border-[#2D5F3F] rounded-lg p-8 sm:p-10">
            {/* Logo et titre */}
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-2xl font-bold text-black">AgriTeranga</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Page de Connexion</h2>
              <p className="text-gray-600 mb-6">
                La connexion se fait maintenant via un modal plus pratique et moderne !
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-4">
              <button
                onClick={onOpenLogin}
                className="w-full bg-[#2D5F3F] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#234a32] transition-colors duration-200"
              >
                Ouvrir le modal de connexion
              </button>

              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Retour à l'accueil
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  onOpenRegister();
                  navigate('/');
                }}
                className="w-full text-green-600 hover:text-green-700 font-medium py-2 transition-colors duration-200"
              >
                Créer un nouveau compte
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

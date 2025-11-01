import React, { useState } from "react";
import ConsumerProfileModal from './consumer/ConsumerProfileModal';
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getProfilePictureUrl } from "../utils/imageUtils";

const Header = ({ onRegisterClick, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Fonction pour les classes CSS conditionnelles
  const getNavLinkClass = (path) => {
    return `transition ${
      isActive(path)
        ? 'text-green-600 font-medium'
        : 'text-gray-700 hover:text-green-600'
    }`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo AgriTeranga"
              className="w-32 h-12 md:w-46 md:h-16 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={getNavLinkClass('/')}>Accueil</Link>
            <Link to="/about" className={getNavLinkClass('/about')}>À Propos</Link>
            <Link to="/services" className={getNavLinkClass('/services')}>Nos services</Link>
            <Link to="/products" className={getNavLinkClass('/products')}>Produits</Link>
            <Link to="/contact" className={getNavLinkClass('/contact')}>Contact</Link>
          </nav>

          {/* Desktop Buttons + Hamburger */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-6 py-2 text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition hidden md:block"
                >
                  Se connecter
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition hidden md:block"
                >
                  S'inscrire
                </button>
              </>
            ) : (
              <>
                {/* Panier */}
                <Link
                  to="/panier"
                  className={`relative p-2 rounded-full transition hidden md:block ${
                    isActive('/panier') 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v8a2 2 0 002 2h10a2 2 0 002-2v-8m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount || 0}
                  </span>
                </Link>
                
                {/* Menu profil */}
                <div className="relative group hidden md:block">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-green-50 transition">
                    <img
                      src={`${getProfilePictureUrl(user.profilePicture)}${avatarVersion ? `?v=${avatarVersion}` : ''}`}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProfilePictureUrl(null); }}
                      alt="Profil"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-700 font-medium">{user.firstName}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Menu déroulant */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-green-50 transition"
                      onClick={() => { setShowProfileModal(true); setIsOpen(false); }}
                    >
                      Mon Profil
                    </button>
                    <Link
                      to="/commandes"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Mes Commandes
                    </Link>
                    <Link
                      to="/parametres"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Paramètres
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Hamburger mobile */}
            <button
              className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="fill-current h-6 w-6"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={
                    isOpen
                      ? "M4.293 4.293l11.414 11.414m0-11.414L4.293 15.707"
                      : "M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md transition ${
              isActive('/') 
                ? 'text-green-600 font-medium bg-green-50' 
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }`} 
            onClick={() => setIsOpen(false)}
          >
            Accueil
          </Link>
          <Link 
            to="/about" 
            className={`block px-3 py-2 rounded-md transition ${
              isActive('/about') 
                ? 'text-green-600 font-medium bg-green-50' 
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }`} 
            onClick={() => setIsOpen(false)}
          >
            À Propos
          </Link>
          <Link 
            to="/services" 
            className={`block px-3 py-2 rounded-md transition ${
              isActive('/services') 
                ? 'text-green-600 font-medium bg-green-50' 
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }`} 
            onClick={() => setIsOpen(false)}
          >
            Nos services
          </Link>
          <Link 
            to="/products" 
            className={`block px-3 py-2 rounded-md transition ${
              isActive('/products') 
                ? 'text-green-600 font-medium bg-green-50' 
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }`} 
            onClick={() => setIsOpen(false)}
          >
            Produits
          </Link>
          <Link 
            to="/contact" 
            className={`block px-3 py-2 rounded-md transition ${
              isActive('/contact') 
                ? 'text-green-600 font-medium bg-green-50' 
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }`} 
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile Buttons */}
          {!user ? (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="w-full px-4 py-2 text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition mt-2 text-center"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRegisterClick();
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition mt-2"
              >
                S'inscrire
              </button>
            </>
          ) : (
            <div className="space-y-2 mt-4">
              {/* Profil utilisateur mobile */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-green-50 rounded-lg">
                <img
                  src={`${getProfilePictureUrl(user.profilePicture)}${avatarVersion ? `?v=${avatarVersion}` : ''}`}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProfilePictureUrl(null); }}
                  alt="Profil"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              {/* Options mobiles */}
              <Link
                to="/panier"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive('/panier') 
                    ? 'text-green-600 font-medium bg-green-50' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v8a2 2 0 002 2h10a2 2 0 002-2v-8m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>Mon Panier</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </Link>
              
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition text-left"
                onClick={() => { setIsOpen(false); setShowProfileModal(true); }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mon Profil</span>
              </button>
              
              <Link
                to="/commandes"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Mes Commandes</span>
              </Link>
              
              <Link
                to="/parametres"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Paramètres</span>
              </Link>
              
              <hr className="my-2" />
              
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmer la déconnexion</h3>
            <p className="text-sm text-gray-600 mb-6">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => { setShowConfirm(false); setIsOpen(false); logout(); }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
      {showProfileModal && (
        <ConsumerProfileModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onUpdated={() => { setAvatarVersion(Date.now()); setShowProfileModal(false); }}
        />
      )}
    </header>
  );
};

export default Header;

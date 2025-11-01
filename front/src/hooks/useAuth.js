import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification au chargement du composant
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Mettre à jour l'état local
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success('Connexion réussie!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Vérifier si l'utilisateur est un consommateur (pas admin, producteur ou livreur)
  const isConsumer = () => {
    return user && ['consommateur', 'consumidor'].includes(user.role?.toLowerCase());
  };

  // Rediriger vers la page de connexion si pas connecté
  const requireAuth = (redirectTo = '/login') => {
    if (!isAuthenticated) {
      toast.warning('Veuillez vous connecter pour accéder à cette fonctionnalité');
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  // Rediriger vers la page de connexion pour les consommateurs non connectés
  const requireConsumerAuth = (redirectTo = '/login') => {
    if (!isAuthenticated) {
      toast.warning('Veuillez vous connecter pour accéder à cette fonctionnalité');
      navigate(redirectTo);
      return false;
    }
    
    // Vérifier si l'utilisateur est un consommateur
    if (!isConsumer()) {
      toast.info('Cette fonctionnalité est réservée aux consommateurs');
      navigate('/');
      return false;
    }
    
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    isConsumer,
    requireAuth,
    requireConsumerAuth
  };
};

export default useAuth;
 

/**
 * Hook personnalisé pour la gestion des données du tableau de bord Livreur
 * Gère les livraisons disponibles, assignées et l'historique
 */

 import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

const useDeliveryData = () => {
  const inFlight = useRef({ stats: false, available: false, my: false, history: false });
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  // États pour les données
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la pagination
  const [availablePagination, setAvailablePagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [myDeliveriesPagination, setMyDeliveriesPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [historyPagination, setHistoryPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  // États pour les filtres
  const [availableFilters, setAvailableFilters] = useState({});
  const [myDeliveriesFilters, setMyDeliveriesFilters] = useState({ status: '' });
  const [historyFilters, setHistoryFilters] = useState({ status: '', dateFrom: '', dateTo: '' });

  // États pour la gestion du profil
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  /**
   * Charger les statistiques du livreur
   */
  const loadStats = useCallback(async () => {
    try {
      if (inFlight.current.stats) return;
      inFlight.current.stats = true;
      const response = await apiService.getDeliveryStats();
      if (response.status === 'success' && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      inFlight.current.stats = false;
    }
  }, []);

  /**
   * Charger les livraisons disponibles
   */
  const loadAvailableDeliveries = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      if (inFlight.current.available) return;
      inFlight.current.available = true;
      const response = await apiService.getAvailableDeliveries(page, 10, filters);
      
      if (response.status === 'success' && response.data) {
        // Normaliser les données (les commandes deviennent des "livraisons disponibles")
        const orders = response.data.orders || response.data.deliveries || [];
        const normalized = orders.map((order) => ({
          id: order.id || order._id,
          productName: order.items?.[0]?.product?.name || 'Produit',
          quantity: order.items?.[0]?.quantity || 1,
          amount: order.totalPrice || 0,
          customer: {
            name: order.consumer?.firstName ? `${order.consumer.firstName} ${order.consumer.lastName || ''}` : 'Client',
            phone: order.consumer?.phone || '+221 77 123 45 67'
          },
          orderDate: order.createdAt || new Date().toISOString(),
          pickupAddress: {
            address: 'Adresse du producteur' // À obtenir du producteur
          },
          deliveryAddress: order.deliveryInfo?.address || { address: 'Adresse non disponible' },
          instructions: order.notes || 'Aucune instruction',
          notes: order.notes || '',
          productImage: order.items?.[0]?.product?.images?.[0] || '/api/placeholder/100'
        }));
        
        setAvailableDeliveries(normalized);
        setAvailablePagination({
          page: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || orders.length
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des livraisons disponibles:', err);
      setError(err.message || 'Erreur lors du chargement des livraisons disponibles');
      toast.error('Erreur lors du chargement des livraisons disponibles');
    } finally {
      setLoading(false);
      inFlight.current.available = false;
    }
  }, []);

  /**
   * Charger mes livraisons assignées
   */
  const loadMyDeliveries = useCallback(async (page = 1, filters = {}) => {
    try {
      if (inFlight.current.my) return;
      inFlight.current.my = true;
      const response = await apiService.getMyDeliveries(page, 10, filters);
      
      if (response.status === 'success' && response.data) {
        // Normaliser les données des livraisons
        const deliveries = response.data.deliveries || [];
        const normalized = deliveries.map((delivery) => {
          const orderStatus = delivery.order?.status || '';
          const baseStatus = delivery.status;
          const derivedStatus = (orderStatus === 'cancelled' || baseStatus === 'failed') ? 'cancelled' : baseStatus;
          return {
            id: delivery.id || delivery._id,
            productName: delivery.order?.items?.[0]?.product?.name || 'Produit',
            quantity: delivery.order?.items?.[0]?.quantity || 1,
            amount: delivery.order?.totalPrice || 0,
            customer: {
              name: delivery.order?.consumer?.firstName ? 
                `${delivery.order.consumer.firstName} ${delivery.order.consumer.lastName || ''}` : 'Client',
              phone: delivery.order?.consumer?.phone || '+221 77 123 45 67'
            },
            status: derivedStatus,
            orderStatus,
            deliveryAddress: delivery.deliveryLocation || { address: 'Adresse non disponible' },
            orderDate: delivery.createdAt || new Date().toISOString()
          };
        });
        
        setMyDeliveries(normalized);
        setMyDeliveriesPagination({
          page: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || deliveries.length
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement de mes livraisons:', err);
      setError(err.message || 'Erreur lors du chargement de mes livraisons');
      toast.error('Erreur lors du chargement de mes livraisons');
    } finally {
      inFlight.current.my = false;
    }
  }, []);

  /**
   * Charger l'historique des livraisons
   */
  const loadDeliveryHistory = useCallback(async (page = 1, filters = {}) => {
    try {
      if (inFlight.current.history) return;
      inFlight.current.history = true;
      const response = await apiService.getDeliveryHistory(page, 10, filters);
      
      if (response.status === 'success' && response.data) {
        // Normaliser les données d'historique
        const history = response.data.history || [];
        const normalized = history.map((delivery) => ({
          id: delivery.id || delivery._id,
          productName: delivery.order?.items?.[0]?.product?.name || 'Produit',
          customer: {
            name: delivery.order?.consumer?.firstName ? 
              `${delivery.order.consumer.firstName} ${delivery.order.consumer.lastName || ''}` : 'Client'
          },
          amount: delivery.order?.totalPrice || 0,
          completedDate: delivery.updatedAt || delivery.createdAt
        }));
        
        setDeliveryHistory(normalized);
        setHistoryPagination({
          page: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          total: response.data.total || history.length
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
      setError(err.message || 'Erreur lors du chargement de l\'historique');
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      inFlight.current.history = false;
    }
  }, []);

  /**
   * Accepter une livraison
   */
  const acceptDelivery = async (deliveryId) => {
    try {
      const response = await apiService.acceptDelivery(deliveryId);
      
      if (response.status === 'success') {
        toast.success('Livraison acceptée avec succès');
        
        // Retirer la livraison des disponibles
        setAvailableDeliveries(prev => prev.filter(delivery => delivery.id !== deliveryId));
        
        // Mettre à jour les statistiques
        await loadStats();
        
        // Recharger mes livraisons
        await loadMyDeliveries(myDeliveriesPagination.page, myDeliveriesFilters);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de l\'acceptation de la livraison');
    } catch (err) {
      console.error('Erreur lors de l\'acceptation:', err);
      const message = err.message || 'Erreur lors de l\'acceptation de la livraison';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Modifier le statut d'une livraison
   */
  const updateDeliveryStatus = async (deliveryId, status, notes = '') => {
    try {
      const response = await apiService.updateDeliveryStatus(deliveryId, status, notes);
      
      if (response.status === 'success') {
        toast.success('Statut de livraison mis à jour');
        
        // Mettre à jour la livraison dans la liste
        setMyDeliveries(prev => prev.map(delivery => 
          delivery.id === deliveryId ? { ...delivery, status } : delivery
        ));
        
        // Si la livraison est terminée, la déplacer vers l'historique
        if (status === 'completed') {
          setTimeout(() => {
            loadDeliveryHistory(1, historyFilters);
            loadMyDeliveries(1, myDeliveriesFilters);
            loadStats();
          }, 1000);
        }
        
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la mise à jour du statut');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      const message = err.message || 'Erreur lors de la mise à jour du statut';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Terminer une livraison
   */
  const completeDelivery = async (deliveryId, completionNotes = '') => {
    try {
      const response = await apiService.completeDelivery(deliveryId, completionNotes);
      
      if (response.status === 'success') {
        toast.success('Livraison terminée avec succès');
        
        // Mise à jour optimiste: marquer localement comme livrée
        setMyDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, status: 'delivered' } : d));
        
        // Recharger les listes et stats
        await Promise.all([
          loadMyDeliveries(myDeliveriesPagination.page, myDeliveriesFilters),
          loadDeliveryHistory(1, historyFilters),
          loadStats()
        ]);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la finalisation de la livraison');
    } catch (err) {
      console.error('Erreur lors de la finalisation:', err);
      const message = err.message || 'Erreur lors de la finalisation de la livraison';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Obtenir les détails d'une livraison
   */
  const getDeliveryDetails = async (deliveryId) => {
    try {
      const response = await apiService.getDeliveryDetails(deliveryId);
      
      if (response.status === 'success') {
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la récupération des détails');
    } catch (err) {
      console.error('Erreur lors de la récupération des détails:', err);
      const message = err.message || 'Erreur lors de la récupération des détails';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Filtrer mes livraisons par statut
   */
  const filterMyDeliveriesByStatus = useCallback((status) => {
    const newFilters = { ...myDeliveriesFilters, status };
    setMyDeliveriesFilters(newFilters);
    loadMyDeliveries(1, newFilters);
  }, [myDeliveriesFilters, loadMyDeliveries]);

  /**
   * Filtrer l'historique par période
   */
  const filterHistoryByDateRange = useCallback((dateFrom, dateTo, status = '') => {
    const newFilters = { ...historyFilters, dateFrom, dateTo, status };
    setHistoryFilters(newFilters);
    loadDeliveryHistory(1, newFilters);
  }, [historyFilters, loadDeliveryHistory]);

  /**
   * Changer de page pour les livraisons disponibles
   */
  const changeAvailablePage = useCallback((newPage) => {
    loadAvailableDeliveries(newPage, availableFilters);
  }, [availableFilters, loadAvailableDeliveries]);

  /**
   * Changer de page pour mes livraisons
   */
  const changeMyDeliveriesPage = useCallback((newPage) => {
    loadMyDeliveries(newPage, myDeliveriesFilters);
  }, [myDeliveriesFilters, loadMyDeliveries]);

  /**
   * Changer de page pour l'historique
   */
  const changeHistoryPage = useCallback((newPage) => {
    loadDeliveryHistory(newPage, historyFilters);
  }, [historyFilters, loadDeliveryHistory]);

  /**
   * Rafraîchir toutes les données
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await loadStats();
      await delay(150);
      await loadMyDeliveries(myDeliveriesPagination.page, myDeliveriesFilters);
      await delay(150);
      await loadAvailableDeliveries(availablePagination.page, availableFilters);
      await delay(150);
      await loadDeliveryHistory(historyPagination.page, historyFilters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    loadStats, 
    loadAvailableDeliveries, 
    loadMyDeliveries, 
    loadDeliveryHistory,
    availablePagination.page,
    availableFilters,
    myDeliveriesPagination.page,
    myDeliveriesFilters,
    historyPagination.page,
    historyFilters
  ]);

  /**
   * Effet pour charger les données au montage
   */
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await loadStats();
        await delay(200);
        await loadMyDeliveries(1);
        await delay(200);
        await loadAvailableDeliveries(1);
        await delay(200);
        await loadDeliveryHistory(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [loadStats, loadAvailableDeliveries, loadMyDeliveries, loadDeliveryHistory]);

  useEffect(() => {
    const id = setInterval(() => {
      refreshData();
    }, 15000);
    return () => clearInterval(id);
  }, [refreshData]);

  /**
   * Charger le profil de l'utilisateur
   */
  const getProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await apiService.getMyProfile();
      if (response.status === 'success' && response.data?.user) {
        setProfile(response.data.user);
      } else {
        setProfileError('Erreur lors du chargement du profil');
      }
    } catch (err) {
      console.error('Erreur profil:', err);
      setProfileError(err.response?.data?.message || 'Erreur lors du chargement du profil');
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /**
   * Mettre à jour le profil
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await apiService.updateProfile(profileData);
      if (response.status === 'success') {
        await getProfile(); // Recharger le profil
        toast.success('Profil mis à jour avec succès');
        return response;
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour du profil');
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      throw err;
    }
  }, [getProfile]);

  /**
   * Changer le mot de passe
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await apiService.changePassword(passwordData);
      if (response.status === 'success') {
        toast.success('Mot de passe modifié avec succès');
        return response;
      } else {
        toast.error(response.message || 'Erreur lors du changement de mot de passe');
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
      throw err;
    }
  }, []);

  /**
   * Rafraîchir le profil
   */
  const refreshProfile = useCallback(async () => {
    await getProfile();
  }, [getProfile]);

  return {
    // Données
    stats,
    availableDeliveries,
    myDeliveries,
    deliveryHistory,
    loading,
    error,
    
    // Pagination
    availablePagination,
    myDeliveriesPagination,
    historyPagination,
    
    // Filtres
    availableFilters,
    myDeliveriesFilters,
    historyFilters,
    
    // Actions
    acceptDelivery,
    updateDeliveryStatus,
    completeDelivery,
    getDeliveryDetails,
    filterMyDeliveriesByStatus,
    filterHistoryByDateRange,
    changeAvailablePage,
    changeMyDeliveriesPage,
    changeHistoryPage,
    refreshData,
    
    // Gestion du profil
    profile,
    profileLoading,
    profileError,
    updateProfile,
    changePassword,
    getProfile,
    refreshProfile
  };
};

export default useDeliveryData;
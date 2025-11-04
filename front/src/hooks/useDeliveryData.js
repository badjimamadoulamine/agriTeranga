/**
 * Hook personnalisé pour la gestion des données du tableau de bord Livreur
 * Gère les livraisons disponibles, assignées et l'historique
 */

import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

const useDeliveryData = () => {
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

  /**
   * Charger les statistiques du livreur
   */
  const loadStats = useCallback(async () => {
    try {
      const response = await apiService.getDeliveryStats();
      if (response.status === 'success' && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      toast.error('Erreur lors du chargement des statistiques');
    }
  }, []);

  /**
   * Charger les livraisons disponibles
   */
  const loadAvailableDeliveries = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
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
    }
  }, []);

  /**
   * Charger mes livraisons assignées
   */
  const loadMyDeliveries = useCallback(async (page = 1, filters = {}) => {
    try {
      const response = await apiService.getMyDeliveries(page, 10, filters);
      
      if (response.status === 'success' && response.data) {
        // Normaliser les données des livraisons
        const deliveries = response.data.deliveries || [];
        const normalized = deliveries.map((delivery) => ({
          id: delivery.id || delivery._id,
          productName: delivery.order?.items?.[0]?.product?.name || 'Produit',
          quantity: delivery.order?.items?.[0]?.quantity || 1,
          amount: delivery.order?.totalPrice || 0,
          customer: {
            name: delivery.order?.consumer?.firstName ? 
              `${delivery.order.consumer.firstName} ${delivery.order.consumer.lastName || ''}` : 'Client',
            phone: delivery.order?.consumer?.phone || '+221 77 123 45 67'
          },
          status: delivery.status,
          deliveryAddress: delivery.deliveryLocation || { address: 'Adresse non disponible' },
          orderDate: delivery.createdAt || new Date().toISOString()
        }));
        
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
    }
  }, []);

  /**
   * Charger l'historique des livraisons
   */
  const loadDeliveryHistory = useCallback(async (page = 1, filters = {}) => {
    try {
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
        
        // Mettre à jour les listes
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
      await Promise.all([
        loadStats(),
        loadAvailableDeliveries(availablePagination.page, availableFilters),
        loadMyDeliveries(myDeliveriesPagination.page, myDeliveriesFilters),
        loadDeliveryHistory(historyPagination.page, historyFilters)
      ]);
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
        await Promise.all([
          loadStats(),
          loadAvailableDeliveries(1),
          loadMyDeliveries(1),
          loadDeliveryHistory(1)
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [loadStats, loadAvailableDeliveries, loadMyDeliveries, loadDeliveryHistory]);

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
    
    // Utilitaires
    setError
  };
};

export default useDeliveryData;
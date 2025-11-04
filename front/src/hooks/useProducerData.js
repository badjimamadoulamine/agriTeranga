/**
 * Hook personnalisé pour la gestion des données du tableau de bord Producteur
 * Gère les produits, commandes et statistiques du producteur
 */

import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

const useProducerData = () => {
  // États pour les données
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la pagination et les filtres
  const [productsPagination, setProductsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [ordersPagination, setOrdersPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [productsFilters, setProductsFilters] = useState({ search: '', category: '', status: '' });
  const [ordersFilters, setOrdersFilters] = useState({ status: '', dateFrom: '', dateTo: '' });

  /**
   * Charger les statistiques du producteur
   */
  const loadStats = useCallback(async () => {
    try {
      const response = await apiService.getProducerStats();
      if (response.status === 'success' && response.data) {
        // Extraire les stats depuis la réponse du dashboard
        const dashboardData = response.data;
        setStats({
          totalProducts: dashboardData.totalProducts || 0,
          totalOrders: dashboardData.totalOrders || 0,
          totalRevenue: dashboardData.totalRevenue || 0,
          averageRating: dashboardData.averageRating || 0
        });
      } else {
        // Si pas de données, utiliser des valeurs par défaut
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageRating: 0
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      // Utiliser des valeurs par défaut en cas d'erreur
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: 0
      });
      // toast.error('Erreur lors du chargement des statistiques');
      // toast.info('Vérifiez votre connexion internet');
    }
  }, []);

  /**
   * Charger la liste des produits
   */
  const loadProducts = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getProducerProducts(
        page,
        20,
        filters?.search || '',
        filters?.category || ''
      );
      
      if (response?.status === 'success') {
        const data = response.data || {};
        const items = data.products || data.items || data.results || [];
        // Normaliser les produits pour l'UI (id au lieu de _id)
        const normalized = (items || []).map((p) => ({
          id: p.id || p._id || p.productId,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock,
          unit: p.unit,
          isAvailable: typeof p.isAvailable === 'boolean' ? p.isAvailable : (p.isPublished ?? false),
          image: p.image || p.images?.[0] || p.thumbnail,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }));

        setProducts(normalized);
        setProductsPagination({
          page: data.currentPage || data.page || page,
          totalPages: data.totalPages || data.pages || 1,
          total: data.total || data.count || normalized.length
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError(err.message || 'Erreur lors du chargement des produits');
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger les commandes
   */
  const loadOrders = useCallback(async (page = 1, filters = {}) => {
    try {
      const response = await apiService.getProducerOrders(page, 20, filters);
      
      if (response?.status === 'success') {
        const data = response.data || {};
        const items = data.orders || data.items || data.results || [];
        const normalized = (items || []).map((o) => ({
          id: o.id || o._id || o.orderId,
          status: o.status,
          totalAmount: o.totalAmount || o.amount || 0,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt
        }));
        setOrders(normalized);
        setOrdersPagination({
          page: data.currentPage || data.page || page,
          totalPages: data.totalPages || data.pages || 1,
          total: data.total || data.count || normalized.length
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    }
  }, []);

  /**
   * Créer un nouveau produit
   */
  const createProduct = async (productData) => {
    try {
      const response = await apiService.createProduct(productData);
      
      if (response.status === 'success') {
        toast.success('Produit créé avec succès');
        // Recharger la liste des produits
        await loadProducts(productsPagination.page, productsFilters);
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la création du produit');
    } catch (err) {
      console.error('Erreur lors de la création du produit:', err);
      const message = err.message || 'Erreur lors de la création du produit';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Modifier un produit
   */
  const updateProduct = async (productId, productData) => {
    try {
      const response = await apiService.updateProduct(productId, productData);
      
      if (response.status === 'success') {
        toast.success('Produit modifié avec succès');
        // Mettre à jour le produit dans la liste
        setProducts(prev => prev.map(product => 
          product.id === productId ? { ...product, ...productData } : product
        ));
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la modification du produit');
    } catch (err) {
      console.error('Erreur lors de la modification du produit:', err);
      const message = err.message || 'Erreur lors de la modification du produit';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Supprimer un produit
   */
  const deleteProduct = async (productId) => {
    try {
      const response = await apiService.deleteProduct(productId);
      
      if (response.status === 'success') {
        toast.success('Produit supprimé avec succès');
        // Retirer le produit de la liste
        setProducts(prev => prev.filter(product => product.id !== productId));
        // Mettre à jour les statistiques
        await loadStats();
      }
      
      throw new Error(response.message || 'Erreur lors de la suppression du produit');
    } catch (err) {
      console.error('Erreur lors de la suppression du produit:', err);
      const message = err.message || 'Erreur lors de la suppression du produit';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Publier un produit (le rendre visible sur le frontend)
   */
  const publishProduct = async (productId) => {
    try {
      const response = await apiService.publishProduct(productId);
      
      if (response.status === 'success') {
        toast.success('Produit publié avec succès');
        // Mettre à jour le produit dans la liste
        setProducts(prev => prev.map(product => 
          product.id === productId ? { ...product, isAvailable: true } : product
        ));
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la publication du produit');
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
      const message = err.message || 'Erreur lors de la publication du produit';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Dépublier un produit (le retirer du frontend)
   */
  const unpublishProduct = async (productId) => {
    try {
      const response = await apiService.unpublishProduct(productId);
      
      if (response.status === 'success') {
        toast.success('Produit dépublié avec succès');
        // Mettre à jour le produit dans la liste
        setProducts(prev => prev.map(product => 
          product.id === productId ? { ...product, isAvailable: false } : product
        ));
        return response.data;
      }
      
      throw new Error(response.message || 'Erreur lors de la dépublication du produit');
    } catch (err) {
      console.error('Erreur lors de la dépublication:', err);
      const message = err.message || 'Erreur lors de la dépublication du produit';
      toast.error(message);
      throw new Error(message);
    }
  };

  /**
   * Modifier le statut d'une commande
   */
  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    try {
      const response = await apiService.updateOrderStatus(orderId, newStatus, notes);
      
      if (response.status === 'success') {
        toast.success('Statut de commande mis à jour');
        // Mettre à jour la commande dans la liste
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
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
   * Rechercher des produits
   */
  const searchProducts = useCallback((searchTerm) => {
    const newFilters = { ...productsFilters, search: searchTerm };
    setProductsFilters(newFilters);
    loadProducts(1, newFilters);
  }, [productsFilters, loadProducts]);

  /**
   * Filtrer les produits par catégorie
   */
  const filterProductsByCategory = useCallback((category) => {
    const newFilters = { ...productsFilters, category };
    setProductsFilters(newFilters);
    loadProducts(1, newFilters);
  }, [productsFilters, loadProducts]);

  /**
   * Changer de page pour les produits
   */
  const changeProductsPage = useCallback((newPage) => {
    loadProducts(newPage, productsFilters);
  }, [productsFilters, loadProducts]);

  /**
   * Changer de page pour les commandes
   */
  const changeOrdersPage = useCallback((newPage) => {
    loadOrders(newPage, ordersFilters);
  }, [ordersFilters, loadOrders]);

  /**
   * Rafraîchir toutes les données
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      loadStats(),
      loadProducts(productsPagination.page, productsFilters),
      loadOrders(ordersPagination.page, ordersFilters)
    ]);
    setLoading(false);
  }, [loadStats, loadProducts, loadOrders, productsPagination.page, productsFilters, ordersPagination.page, ordersFilters]);

  // Agréger les ventes par mois à partir des commandes
  const salesChartData = React.useMemo(() => {
    try {
      const byMonth = new Map();
      (orders || []).forEach((o) => {
        const d = o.createdAt ? new Date(o.createdAt) : null;
        if (!d || isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const prev = byMonth.get(key) || { revenue: 0, orders: 0, year: d.getFullYear(), monthIndex: d.getMonth() };
        prev.revenue += Number(o.totalAmount || 0);
        prev.orders += 1;
        byMonth.set(key, prev);
      });
      // trier chronologiquement et formater
      const months = Array.from(byMonth.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([_, v]) => ({
          month: new Date(v.year, v.monthIndex, 1).toLocaleString('fr-FR', { month: 'short' }),
          revenue: v.revenue,
          orders: v.orders
        }));
      return months;
    } catch {
      return [];
    }
  }, [orders]);

  /**
   * Effet pour charger les données au montage
   */
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadStats(),
          loadProducts(1),
          loadOrders(1)
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [loadStats, loadProducts, loadOrders]);

  return {
    // Données
    stats,
    products,
    orders,
    loading,
    error,
    salesChartData,
    
    // Pagination
    productsPagination,
    ordersPagination,
    
    // Filtres
    productsFilters,
    ordersFilters,
    
    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct,
    updateOrderStatus,
    searchProducts,
    filterProductsByCategory,
    changeProductsPage,
    changeOrdersPage,
    refreshData,
    
    // Utilitaires
    setError
  };
};

export default useProducerData;
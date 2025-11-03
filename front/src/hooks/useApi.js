// Hook personnalisé pour gérer les données API
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result.data || result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook pour les statistiques du dashboard
export const useDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, byRole: [], newThisWeek: 0 },
    products: { total: 0, available: 0 },
    orders: { total: 0, byStatus: [] },
    revenue: { total: 0 },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDashboardStats();
      if (response.status === 'success') {
        setStats(response.data || response);
      } else {
        // Fallback avec des données par défaut
        setStats({
          users: { total: 0, byRole: [], newThisWeek: 0 },
          products: { total: 0, available: 0 },
          orders: { total: 0, byStatus: [] },
          revenue: { total: 0 },
          recentOrders: []
        });
      }
    } catch (err) {
      console.error('Erreur dashboard stats:', err);
      setError(err.message || 'Erreur lors du chargement des statistiques');
      // Fallback avec des données par défaut en cas d'erreur
      setStats({
        users: { total: 0, byRole: [], newThisWeek: 0 },
        products: { total: 0, available: 0 },
        orders: { total: 0, byStatus: [] },
        revenue: { total: 0 },
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook pour la gestion des utilisateurs
export const useUsers = (params = {}) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Stabiliser la dépendance params pour éviter des re-fetchs infinis
  const stableParams = JSON.stringify(params || {});

  const fetchUsers = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUsers({ ...params, ...searchParams });
      // Normaliser la réponse de l'API: plusieurs formats possibles
      // 1) response.data => array
      // 2) response.data.users => array (data object contenant users et total)
      // 3) response.users => array
      // 4) response => array
      const payload = response || {};

      let usersArray = [];
      if (Array.isArray(payload.data)) {
        usersArray = payload.data;
      } else if (payload.data && Array.isArray(payload.data.users)) {
        usersArray = payload.data.users;
      } else if (Array.isArray(payload.users)) {
        usersArray = payload.users;
      } else if (Array.isArray(payload)) {
        usersArray = payload;
      }

      const totalCount = payload.total || payload.count || (payload.data && (payload.data.total || payload.data.count)) || 0;

      setUsers(usersArray);
      setTotal(totalCount);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  const toggleUserStatus = useCallback(async (userId) => {
    try {
      await apiService.toggleUserStatus(userId);
      // Rafraîchir la liste après modification
      fetchUsers();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchUsers]);

  const updateUserRole = useCallback(async (userId, role) => {
    try {
      await apiService.updateUserRole(userId, role);
      // Rafraîchir la liste après modification
      fetchUsers();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId) => {
    try {
      await apiService.deleteUser(userId);
      // Rafraîchir la liste après suppression
      fetchUsers();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchUsers]);

  const blockUser = useCallback(async (userId, reason = '') => {
    try {
      await apiService.blockUser(userId, reason);
      // Rafraîchir la liste après blocage
      fetchUsers();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchUsers]);

  const unblockUser = useCallback(async (userId) => {
    try {
      await apiService.unblockUser(userId);
      // Rafraîchir la liste après déblocage
      fetchUsers();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchUsers]);

  // Appeler fetchUsers lorsque les paramètres changent (comparaison profonde via JSON)
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableParams]);

  return { 
    users, 
    total, 
    loading, 
    error, 
    refetch: fetchUsers,
    toggleUserStatus,
    updateUserRole,
    deleteUser,
    blockUser,
    unblockUser
  };
};

// Hook pour la gestion des produits
export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Stabiliser la dépendance params (éviter les objets inline qui changent à chaque rendu)
  const stableParams = JSON.stringify(params || {});

  const fetchProducts = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const parsedParams = JSON.parse(stableParams || '{}');
      const response = await apiService.getProducts({ ...parsedParams, ...searchParams });

      // Normaliser la réponse comme pour useUsers
      const payload = response || {};
      let productsArray = [];
      if (Array.isArray(payload.data)) {
        productsArray = payload.data;
      } else if (payload.data && Array.isArray(payload.data.products)) {
        productsArray = payload.data.products;
      } else if (Array.isArray(payload.products)) {
        productsArray = payload.products;
      } else if (Array.isArray(payload)) {
        productsArray = payload;
      }

      const totalCount = payload.total || payload.count || (payload.data && (payload.data.total || payload.data.count)) || 0;

      setProducts(productsArray);
      setTotal(totalCount);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  const approveProduct = useCallback(async (productId) => {
    try {
      await apiService.approveProduct(productId);
      fetchProducts();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (productId, productData) => {
    try {
      await apiService.updateProduct(productId, productData);
      fetchProducts();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (productId) => {
    try {
      await apiService.deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableParams]);

  return { 
    products, 
    total, 
    loading, 
    error, 
    refetch: fetchProducts,
    approveProduct,
    updateProduct,
    deleteProduct
  };
};

// Hook pour les produits en attente
export const usePendingProducts = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPendingProducts();
      setPendingProducts(response.data || response.products || []);
    } catch (err) {
      setError(err.message);
      setPendingProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveProduct = useCallback(async (productId) => {
    try {
      await apiService.approveProduct(productId);
      fetchPendingProducts();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchPendingProducts]);

  useEffect(() => {
    fetchPendingProducts();
  }, [fetchPendingProducts]);

  return { 
    pendingProducts, 
    loading, 
    error, 
    refetch: fetchPendingProducts,
    approveProduct
  };
};

// Hook pour la gestion des commandes
export const useOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Stabiliser la dépendance params pour éviter des re-fetchs infinis
  const stableParams = JSON.stringify(params || {});

  const fetchOrders = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const parsedParams = JSON.parse(stableParams || '{}');
      const response = await apiService.getOrders({ ...parsedParams, ...searchParams });

      // Normaliser la réponse (plusieurs formes possibles selon backend)
      const payload = response || {};
      let ordersArray = [];
      if (Array.isArray(payload.data)) {
        ordersArray = payload.data;
      } else if (payload.data && Array.isArray(payload.data.orders)) {
        ordersArray = payload.data.orders;
      } else if (payload.data && Array.isArray(payload.data.docs)) {
        ordersArray = payload.data.docs;
      } else if (Array.isArray(payload.orders)) {
        ordersArray = payload.orders;
      } else if (Array.isArray(payload)) {
        ordersArray = payload;
      }

      const totalCount = payload.total || payload.count || (payload.data && (payload.data.total || payload.data.count)) || 0;

      setOrders(ordersArray);
      setTotal(totalCount);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { 
    orders, 
    total, 
    loading, 
    error, 
    refetch: fetchOrders,
    updateOrderStatus
  };
};

// Hook pour la gestion des formations
export const useFormations = (params = {}) => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Stabiliser la dépendance params pour éviter des re-fetchs infinis
  const stableParams = JSON.stringify(params || {});

  const fetchFormations = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const parsedParams = JSON.parse(stableParams || '{}');
      const response = await apiService.getFormations({ ...parsedParams, ...searchParams });

      // Normaliser la réponse (plusieurs formats possibles)
      const payload = response || {};
      let formationsArray = [];
      if (Array.isArray(payload.data)) {
        formationsArray = payload.data;
      } else if (payload.data && Array.isArray(payload.data.formations)) {
        formationsArray = payload.data.formations;
      } else if (payload.data && Array.isArray(payload.data.docs)) {
        formationsArray = payload.data.docs;
      } else if (Array.isArray(payload.formations)) {
        formationsArray = payload.formations;
      } else if (Array.isArray(payload)) {
        formationsArray = payload;
      }

      const totalCount = payload.total || payload.count || (payload.data && (payload.data.total || payload.data.count)) || 0;

      setFormations(formationsArray);
      setTotal(totalCount);
      if (payload.data && Array.isArray(payload.data.categories)) {
        setCategories(payload.data.categories);
      }
    } catch (err) {
      setError(err.message);
      setFormations([]);
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  const togglePublish = useCallback(async (formationId) => {
    try {
      await apiService.toggleFormationPublish(formationId);
      fetchFormations();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchFormations]);

  const createFormation = useCallback(async (formationData) => {
    try {
      await apiService.createFormation(formationData);
      fetchFormations();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchFormations]);

  const updateFormation = useCallback(async (formationId, formationData) => {
    try {
      await apiService.updateFormation(formationId, formationData);
      fetchFormations();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchFormations]);

  const deleteFormation = useCallback(async (formationId) => {
    try {
      await apiService.deleteFormation(formationId);
      fetchFormations();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchFormations]);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  // Fetch categories list from backend
  const fetchCategories = useCallback(async () => {
    try {
      const resp = await apiService.getFormationCategories();
      const payload = resp || {};
      let cats = [];
      if (payload.data && Array.isArray(payload.data.categories)) cats = payload.data.categories;
      else if (Array.isArray(payload.categories)) cats = payload.categories;
      else if (Array.isArray(payload)) cats = payload;
      setCategories(cats);
    } catch (err) {
      console.warn('Could not fetch formation categories:', err.message);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    formations, 
    categories,
    total, 
    loading, 
    error, 
    refetch: fetchFormations,
    togglePublish,
    createFormation,
    updateFormation,
    deleteFormation
  };
};

// Hook pour les statistiques de vente
export const useSalesStats = (period = 'month') => {
  const [salesStats, setSalesStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesStats = useCallback(async (periodParam = period) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSalesStats(periodParam);
      setSalesStats(response.data || response);
    } catch (err) {
      setError(err.message);
      setSalesStats(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSalesStats();
  }, [fetchSalesStats]);

  return { salesStats, loading, error, refetch: fetchSalesStats };
};

// Hook pour l'authentification admin
export const useAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.login(credentials);
      setAdmin(response.admin);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
      setAdmin(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const getCurrentAdmin = useCallback(() => {
    const currentAdmin = apiService.getCurrentAdmin();
    setAdmin(currentAdmin);
    return currentAdmin;
  }, []);

  useEffect(() => {
    getCurrentAdmin();
  }, [getCurrentAdmin]);

  return { admin, loading, error, login, logout, getCurrentAdmin };
};
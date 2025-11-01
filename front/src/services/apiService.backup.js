/**
 * Service API pour AgriTeranga - Connexion à l'API agriculture-api
 * Gère toutes les requêtes vers l'API backend
 */

import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT = 10000; // 10 secondes

// Créer une instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  /**
   * Requête générique avec gestion d'erreurs
   */
  async request(endpoint, options = {}) {
    try {
      const response = await apiClient.request({
        url: endpoint,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.response) {
        // Erreur avec réponse du serveur
        throw {
          status: error.response.status,
          message: error.response.data?.message || 'Erreur serveur',
          data: error.response.data
        };
      } else if (error.request) {
        // Pas de réponse (timeout, problème réseau)
        throw {
          status: 0,
          message: 'Problème de connexion - vérifiez votre réseau',
          data: null
        };
      } else {
        // Erreur de configuration
        throw {
          status: 500,
          message: 'Erreur de configuration',
          data: null
        };
      }
    }
  }

  // =====================
  // AUTHENTIFICATION
  // =====================

  /**
   * Connexion utilisateur (email ou téléphone)
   */
  async login(identifier, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      data: { identifier, password }
    });

    if (response.status === 'success' && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * Connexion dashboard avec gestion des rôles
   */
  async dashboardLogin(identifier, password, dashboardType) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      data: { identifier, password }
    });

    if (response.status === 'success' && response.data.token) {
      const { user } = response.data;
      const { role } = user;

      // Vérifier que l'utilisateur a le bon rôle pour le dashboard
      let isValidRole = false;
      let tokenKey = 'token';
      
      switch (dashboardType) {
        case 'admin':
          isValidRole = role === 'admin';
          tokenKey = 'adminDashboardToken';
          break;
        case 'producer':
          isValidRole = role === 'producteur';
          tokenKey = 'producerDashboardToken';
          break;
        case 'delivery':
          isValidRole = role === 'livreur';
          tokenKey = 'deliveryDashboardToken';
          break;
        default:
          throw { status: 400, message: 'Type de dashboard invalide' };
      }

      if (!isValidRole) {
        throw { 
          status: 403, 
          message: `Accès refusé. Ce dashboard est réservé aux ${dashboardType}s.` 
        };
      }

      // Stocker le token spécifique au dashboard
      localStorage.setItem(tokenKey, response.data.token);
      localStorage.setItem(`${dashboardType}DashboardUser`, JSON.stringify(user));
      
      return {
        ...response,
        user: user,
        role: role,
        dashboardType: dashboardType
      };
    }

    return response;
  }

  /**
   * Déconnexion
   */
  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Obtenir le profil utilisateur actuel
   */
  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // =====================
  // ADMIN DASHBOARD
  // =====================

  /**
   * Données du tableau de bord admin
   */
  async getAdminDashboard() {
    return await this.request('/admin/dashboard');
  }

  /**
   * Statistiques générales
   */
  async getGeneralStats() {
    try {
      const [usersStats, salesStats] = await Promise.all([
        this.getUsersStats(),
        this.getSalesStats()
      ]);

      return {
        status: 'success',
        data: {
          users: usersStats.data,
          sales: salesStats.data
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Statistiques des utilisateurs
   */
  async getUsersStats() {
    return await this.request('/admin/stats/users');
  }

  /**
   * Statistiques des ventes
   */
  async getSalesStats() {
    return await this.request('/admin/stats/sales');
  }

  // =====================
  // GESTION UTILISATEURS
  // =====================

  /**
   * Liste de tous les utilisateurs (admin)
   */
  async getAllUsers(page = 1, limit = 50, search = '', filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search) params.append('search', search);
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    return await this.request(`/admin/users?${params.toString()}`);
  }

  /**
   * Activer/Désactiver un utilisateur
   */
  async toggleUserStatus(userId) {
    return await this.request(`/admin/users/${userId}/toggle`, {
      method: 'PATCH'
    });
  }

  /**
   * Modifier le rôle d'un utilisateur
   */
  async changeUserRole(userId, newRole) {
    return await this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      data: { role: newRole }
    });
  }

  /**
   * Liste des producteurs
   */
  async getProducers(page = 1, limit = 50, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search) params.append('search', search);

    return await this.request(`/users/producers?${params.toString()}`);
  }

  /**
   * Détails d'un utilisateur
   */
  async getUserDetails(userId) {
    return await this.request(`/users/profile/${userId}`);
  }

  // =====================
  // PRODUCER DASHBOARD
  // =====================

  /**
   * Données du tableau de bord producteur
   */
  async getProducerDashboard() {
    return await this.request('/users/producer/dashboard');
  }

  /**
   * Statistiques du producteur
   */
  async getProducerStats() {
    return await this.request('/users/producer/stats');
  }

  /**
   * Mes produits
   */
  async getMyProducts(page = 1, limit = 50, search = '', category = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search) params.append('search', search);
    if (category) params.append('category', category);

    return await this.request(`/products/my?${params.toString()}`);
  }

  /**
   * Mes commandes
   */
  async getMyOrders(page = 1, limit = 50, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (status) params.append('status', status);

    return await this.request(`/orders/my?${params.toString()}`);
  }

  /**
   * Mes formations
   */
  async getMyFormations(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return await this.request(`/formations/my?${params.toString()}`);
  }

  // =====================
  // DELIVERY DASHBOARD
  // =====================

  /**
   * Données du tableau de bord livreur
   */
  async getDeliveryDashboard() {
    return await this.request('/users/deliverer/dashboard');
  }

  /**
   * Statistiques du livreur
   */
  async getDeliveryDashboardStats() {
    return await this.request('/users/deliverer/stats');
  }

  /**
   * Mes livraisons en cours
   */
  async getMyActiveDeliveries() {
    return await this.request('/deliveries/my/active');
  }

  /**
   * Mes livraisons à venir
   */
  async getMyUpcomingDeliveries() {
    return await this.request('/deliveries/my/upcoming');
  }

  /**
   * Historique des livraisons
   */
  async getMyDeliveryHistory(page = 1, limit = 50, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (status) params.append('status', status);

    return await this.request(`/deliveries/my/history?${params.toString()}`);
  }

  /**
   * Accepter une livraison
   */
  async acceptDelivery(deliveryId) {
    return await this.request(`/deliveries/${deliveryId}/accept`, {
      method: 'PATCH'
    });
  }

  /**
   * Refuser une livraison
   */
  async declineDelivery(deliveryId, reason = '') {
    return await this.request(`/deliveries/${deliveryId}/decline`, {
      method: 'PATCH',
      data: { reason }
    });
  }

  /**
   * Mettre à jour le statut d'une livraison
   */
  async updateDeliveryStatus(deliveryId, status, notes = '') {
    return await this.request(`/deliveries/${deliveryId}/status`, {
      method: 'PATCH',
      data: { status, notes }
    });
  }

  // =====================
  // GESTION PRODUITS
  // =====================

  /**
   * Liste des produits avec filtres
   */
  async getProducts(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.isOrganic !== undefined) params.append('isOrganic', filters.isOrganic.toString());
    if (filters.sort) params.append('sort', filters.sort);

    return await this.request(`/products?${params.toString()}`);
  }

  /**
   * Produits en attente de validation
   */
  async getPendingProducts(page = 1, limit = 50) {
    return await this.request(`/admin/products/pending?page=${page}&limit=${limit}`);
  }

  /**
   * Approuver un produit
   */
  async approveProduct(productId) {
    return await this.request(`/admin/products/${productId}/approve`, {
      method: 'PATCH'
    });
  }

  /**
   * Supprimer un produit
   */
  async deleteProduct(productId) {
    return await this.request(`/products/${productId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Détails d'un produit
   */
  async getProductDetails(productId) {
    return await this.request(`/products/${productId}`);
  }

  // =====================
  // GESTION COMMANDES
  // =====================

  /**
   * Liste de toutes les commandes (admin)
   */
  async getAllOrders(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.search) params.append('search', filters.search);

    return await this.request(`/admin/orders?${params.toString()}`);
  }

  /**
   * Historique des transactions avec filtres
   */
  async getOrderHistory(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return await this.request(`/orders/history?${params.toString()}`);
  }

  /**
   * Détails d'une commande
   */
  async getOrderDetails(orderId) {
    return await this.request(`/orders/${orderId}`);
  }

  /**
   * Modifier le statut d'une commande
   */
  async updateOrderStatus(orderId, newStatus, notes = '') {
    return await this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      data: { 
        status: newStatus,
        notes 
      }
    });
  }

  /**
   * Annuler une commande
   */
  async cancelOrder(orderId, reason = '') {
    return await this.request(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
      data: { reason }
    });
  }

  // =====================
  // GESTION PRODUCTEURS
  // =====================

  /**
   * Liste des produits du producteur
   */
  async getProducerProducts(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);

    return await this.request(`/products?${params.toString()}`);
  }

  /**
   * Créer un nouveau produit
   */
  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      data: productData
    });
  }

  /**
   * Modifier un produit
   */
  async updateProduct(productId, productData) {
    return await this.request(`/products/${productId}`, {
      method: 'PUT',
      data: productData
    });
  }

  /**
   * Commandes du producteur
   */
  async getProducerOrders(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    return await this.request(`/orders/producer/list?${params.toString()}`);
  }

  /**
   * Statistiques du producteur
   */
  async getProducerStats() {
    return await this.request('/users/stats');
  }

  /**
   * Mettre à jour le profil producteur
   */
  async updateProducerProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      data: profileData
    });
  }

  // =====================
  // GESTION LIVRAISONS
  // =====================

  /**
   * Livraisons disponibles pour le livreur
   */
  async getAvailableDeliveries(page = 1, limit = 50) {
    return await this.request(`/deliveries/available?page=${page}&limit=${limit}`);
  }

  /**
   * Mes livraisons assignées
   */
  async getMyDeliveries(page = 1, limit = 50, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (status) params.append('status', status);

    return await this.request(`/deliveries?${params.toString()}`);
  }

  /**
   * Accepter une livraison
   */
  async acceptDelivery(deliveryId) {
    return await this.request(`/deliveries/${deliveryId}/accept`, {
      method: 'POST'
    });
  }

  /**
   * Modifier le statut d'une livraison
   */
  async updateDeliveryStatus(deliveryId, status, notes = '') {
    return await this.request(`/deliveries/${deliveryId}/status`, {
      method: 'PATCH',
      data: { status, notes }
    });
  }

  /**
   * Terminer une livraison
   */
  async completeDelivery(deliveryId, completionNotes = '') {
    return await this.request(`/deliveries/${deliveryId}/complete`, {
      method: 'PATCH',
      data: { notes: completionNotes }
    });
  }

  /**
   * Historique des livraisons
   */
  async getDeliveryHistory(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    return await this.request(`/deliveries/my/history?${params.toString()}`);
  }

  /**
   * Statistiques du livreur
   */
  async getDeliveryStats() {
    return await this.request('/users/deliverer/stats');
  }

  /**
   * Détails d'une livraison
   */
  async getDeliveryDetails(deliveryId) {
    return await this.request(`/deliveries/${deliveryId}`);
  }

  // =====================
  // UTILITAIRES
  // =====================

  /**
   * Export de données en CSV
   */
  async exportData(type, filters = {}) {
    const params = new URLSearchParams(filters);
    return await this.request(`/admin/export/${type}?${params.toString()}`, {
      headers: {
        'Accept': 'text/csv'
      }
    });
  }

  /**
   * Vérifier la santé de l'API
   */
  async healthCheck() {
    return await this.request('/health');
  }
}

// Instance singleton
const apiService = new ApiService();
export default apiService;

// Export des statuts de commande pour utilisation dans les composants
export const ORDER_STATUSES = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
};

export const USER_ROLES = {
  consommateur: 'Consommateur',
  producteur: 'Producteur',
  livreur: 'Livreur',
  admin: 'Administrateur'
};

export const PRODUCT_CATEGORIES = {
  fruits: 'Fruits',
  légumes: 'Légumes',
  céréales: 'Céréales',
  tubercules: 'Tubercules',
  élevage: 'Élevage',
  'produits-transformés': 'Produits Transformés'
};
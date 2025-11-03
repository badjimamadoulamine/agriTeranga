/**
 * Service API pour AgriTeranga - Connexion à l'API agriculture-api
 * Gère toutes les requêtes vers l'API backend avec intégration complète des dashboards
 */

import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT = 30000; // 30 secondes

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
    // Chercher le token approprié selon le contexte
    let token = localStorage.getItem('token');

    // Si on est dans un dashboard, essayer le token spécifique; sinon, fallback au token général
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin')) {
      const adminToken = localStorage.getItem('adminDashboardToken');
      if (adminToken) token = adminToken;
    } else if (currentPath.includes('/producer')) {
      const producerToken = localStorage.getItem('producerDashboardToken');
      if (producerToken) token = producerToken;
    } else if (currentPath.includes('/delivery')) {
      const deliveryToken = localStorage.getItem('deliveryDashboardToken');
      if (deliveryToken) token = deliveryToken;
    }

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
      // Token expiré ou invalide - rediriger vers la page de connexion appropriée
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Supprimer aussi les tokens spécifiques aux dashboards
      localStorage.removeItem('adminDashboardToken');
      localStorage.removeItem('producerDashboardToken');
      localStorage.removeItem('deliveryDashboardToken');
      localStorage.removeItem('adminDashboardUser');
      localStorage.removeItem('producerDashboardUser');
      localStorage.removeItem('deliveryDashboardUser');
      
      // Rediriger selon le contexte
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin')) {
        window.location.href = '/admin/login';
      } else if (currentPath.includes('/producer')) {
        window.location.href = '/producer/login';
      } else if (currentPath.includes('/delivery')) {
        window.location.href = '/login';
      } else {
        window.location.href = '/login';
      }
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
   * Connexion utilisateur (email ou téléphone) - Utilisation générale
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
   * Connexion via Google Identity Services
   * Le backend doit exposer POST /auth/google et retourner { status, data: { token, user } }
   */
  async loginWithGoogle(credential) {
    const response = await this.request('/auth/google', {
      method: 'POST',
      data: { credential }
    });

    if (response.status === 'success' && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * Connexion dashboard avec gestion des rôles et validation
   */
  async dashboardLogin(identifier, password, dashboardType) {
    try {
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
        let userKey = 'user';
        
        switch (dashboardType) {
          case 'admin':
            isValidRole = role === 'admin';
            tokenKey = 'adminDashboardToken';
            userKey = 'adminDashboardUser';
            break;
          case 'producer':
            isValidRole = role === 'producteur';
            tokenKey = 'producerDashboardToken';
            userKey = 'producerDashboardUser';
            break;
          case 'delivery':
            isValidRole = role === 'livreur';
            tokenKey = 'deliveryDashboardToken';
            userKey = 'deliveryDashboardUser';
            break;
          default:
            throw { 
              status: 400, 
              message: 'Type de dashboard invalide' 
            };
        }

        if (!isValidRole) {
          // Supprimer le token général et nettoyer
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          throw { 
            status: 403, 
            message: `Accès refusé. Ce dashboard est réservé aux ${dashboardType}s.` 
          };
        }

        // Stocker le token spécifique au dashboard
        localStorage.setItem(tokenKey, response.data.token);
        localStorage.setItem(userKey, JSON.stringify(user));
        
        return {
          ...response,
          user: user,
          role: role,
          dashboardType: dashboardType
        };
      }

      return response;
    } catch (error) {
      // Si c'est une erreur de connexion API
      throw error;
    }
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
      // Nettoyer tous les tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminDashboardToken');
      localStorage.removeItem('producerDashboardToken');
      localStorage.removeItem('deliveryDashboardToken');
      localStorage.removeItem('adminDashboardUser');
      localStorage.removeItem('producerDashboardUser');
      localStorage.removeItem('deliveryDashboardUser');
    }
  }

  /**
   * Obtenir le profil utilisateur actuel
   */
  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  /**
   * Récupérer l'admin courant depuis le stockage local (synchrone)
   * Utilisé par les hooks sans await (ex: useAuth.getCurrentAdmin())
   */
  getCurrentAdmin() {
    try {
      const raw =
        localStorage.getItem('adminDashboardUser') ||
        localStorage.getItem('user');
      if (!raw) return null;
      const user = JSON.parse(raw);
      if (user && (user.role === 'admin' || user.isSuperAdmin === true)) {
        return user;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Mettre à jour mon profil (inclut upload photo)
   */
  async updateMyProfile(profileData) {
    const form = new FormData();
    Object.entries(profileData || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });
    return await this.request('/users/profile', {
      method: 'PUT',
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Changer mon mot de passe (requiert ancien mot de passe)
   */
  async changeMyPassword(currentPassword, newPassword, confirmPassword) {
    return await this.request('/users/change-password', {
      method: 'PUT',
      data: { currentPassword, newPassword, confirmPassword }
    });
  }

  /**
   * Demander la réinitialisation du mot de passe (envoi email)
   */
  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      data: { email }
    });
  }

  /**
   * Réinitialiser le mot de passe avec un token
   */
  async resetPassword(token, password) {
    return await this.request(`/auth/reset-password/${encodeURIComponent(token)}`, {
      method: 'PUT',
      data: { password }
    });
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
    return await this.request('/admin/stats');
  }

  /**
   * Données statistiques pour dashboard admin (alias pour compatibilité)
   */
  async getDashboardStats() {
    return await this.getAdminDashboard();
  }

  /**
   * Statistiques livreur
   */
  async getDeliveryStats() {
    return await this.request('/users/deliverer/stats');
  }

  /**
   * Liste des utilisateurs avec filtres
   */
  async getUsers(page = 1, limit = 50, search = '', role = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search) params.append('search', search);
    if (role) params.append('role', role);

    return await this.request(`/admin/users?${params.toString()}`);
  }

  /**
   * Détails d'un utilisateur
   */
  async getUserDetails(userId) {
    return await this.request(`/admin/users/${userId}`);
  }

  /**
   * Modifier le statut d'un utilisateur
   */
  async updateUserStatus(userId, status) {
    return await this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      data: { status }
    });
  }

  /**
   * Changer le statut d'un utilisateur (alternative)
   */
  async changeUserStatus(userId, status) {
    return await this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      data: { status }
    });
  }

  /**
   * Changer le rôle d'un utilisateur
   */
  async changeUserRole(userId, newRole) {
    return await this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      data: { role: newRole }
    });
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
    // Backend route is /users/stats (protected, producteur only)
    return await this.request('/users/stats');
  }

  /**
   * Mes produits
   */
  async getProducerProducts(page = 1, limit = 50, search = '', category = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Defensive: ensure flat strings for search and category
    const normalize = (v) => {
      if (!v) return '';
      if (typeof v === 'string') return v;
      if (Array.isArray(v)) return v.filter(Boolean).join(',');
      if (typeof v === 'object') {
        if ('value' in v) return String(v.value);
        if ('label' in v) return String(v.label);
        // Unknown object shape → ignore instead of sending [object Object]
        return '';
      }
      try { return String(v); } catch { return ''; }
    };

    // Accept either (search, category) or a filters object as 3rd arg
    let searchValue = '';
    let categoryValue = '';
    if (typeof search === 'object' && search !== null) {
      searchValue = normalize(search.search);
      categoryValue = normalize(search.category);
    } else {
      searchValue = normalize(search);
      categoryValue = normalize(category);
    }
    if (searchValue) params.append('search', searchValue);
    if (categoryValue) params.append('category', categoryValue);

    return await this.request(`/products/my?${params.toString()}`);
  }

  /**
   * Alias pour compatibilité
   */
  async getMyProducts(page = 1, limit = 50, search = '', category = '') {
    return await this.getProducerProducts(page, limit, search, category);
  }

  // =====================
  // GESTION PRODUITS (général)
  // =====================

  /**
   * Liste des produits avec filtres (publique/admin)
   * Signature souple: getProducts(page, limit, filters) ou getProducts(filtersObject)
   */
  async getProducts(pageOrFilters = 1, limit = 50, filters = {}) {
    let page = 1;
    let lim = 50;
    let f = {};

    if (typeof pageOrFilters === 'object' && pageOrFilters !== null) {
      f = pageOrFilters;
    } else {
      page = Number(pageOrFilters) || 1;
      lim = Number(limit) || 50;
      f = filters || {};
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: lim.toString()
    });

    if (f.search) params.append('search', String(f.search));
    if (f.category) params.append('category', String(f.category));
    if (f.minPrice) params.append('minPrice', String(f.minPrice));
    if (f.maxPrice) params.append('maxPrice', String(f.maxPrice));
    if (f.isOrganic !== undefined) params.append('isOrganic', String(f.isOrganic));
    if (f.sort) params.append('sort', String(f.sort));

    return await this.request(`/products?${params.toString()}`);
  }

  /**
   * Produits en attente de validation (admin)
   */
  async getPendingProducts(page = 1, limit = 50) {
    return await this.request(`/admin/products/pending?page=${page}&limit=${limit}`);
  }

  /**
   * Approuver un produit (admin)
   */
  async approveProduct(productId) {
    return await this.request(`/admin/products/${productId}/approve`, {
      method: 'PATCH'
    });
  }

  /**
   * Détails d'un produit
   */
  async getProductDetails(productId) {
    return await this.request(`/products/${productId}`);
  }

  // =====================
  // PANIER
  // =====================
  async getCart() {
    return await this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return await this.request('/cart/add', {
      method: 'POST',
      data: { product: productId, quantity }
    });
  }

  async updateCartItem(productId, quantity) {
    return await this.request(`/cart/update/${productId}`, {
      method: 'PUT',
      data: { quantity }
    });
  }

  async removeFromCart(productId) {
    return await this.request(`/cart/remove/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return await this.request('/cart/clear', {
      method: 'DELETE'
    });
  }

  /**
   * Liste des produits (admin/général) avec filtres flexibles
   */
  async getProducts(filters = {}) {
    // Supporter à la fois un objet de filtres et (page, limit, ...)
    const {
      page = 1,
      limit = 50,
      search = '',
      category = '',
      minPrice,
      maxPrice,
      isOrganic,
      sort
    } = (typeof filters === 'object' ? filters : {}) || {};

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });

    const appendIf = (key, value) => {
      if (value !== undefined && value !== null && value !== '') params.append(key, String(value));
    };

    appendIf('search', search);
    appendIf('category', category);
    appendIf('minPrice', minPrice);
    appendIf('maxPrice', maxPrice);
    if (isOrganic !== undefined) params.append('isOrganic', String(Boolean(isOrganic)));
    appendIf('sort', sort);

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
   * Supprimer un produit
   */
  async deleteProduct(productId) {
    return await this.request(`/products/${productId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Produits en attente de validation (admin)
   */
  async getPendingProducts(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });
    return await this.request(`/admin/products/pending?${params.toString()}`);
  }

  /**
   * Approuver un produit (admin)
   */
  async approveProduct(productId) {
    return await this.request(`/admin/products/${productId}/approve`, {
      method: 'PATCH'
    });
  }

  /**
   * Catégories produits (helper backend)
   */
  async getProductCategories() {
    return await this.request('/products/categories');
  }

  /**
   * Publier un produit (le rendre visible sur le frontend)
   */
  async publishProduct(productId) {
    return await this.request(`/products/${productId}/publish`, {
      method: 'PATCH'
    });
  }

  /**
   * Dépublier un produit (le retirer du frontend)
   */
  async unpublishProduct(productId) {
    return await this.request(`/products/${productId}/unpublish`, {
      method: 'PATCH'
    });
  }

  /**
   * Mes commandes (producteur)
   */
  async getProducerOrders(page = 1, limit = 50, status = '') {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });

    // Defensive: ensure status is a flat string
    let statusValue = status;
    if (status && typeof status === 'object') {
      // If filters object was passed, extract .status first
      if ('status' in status) {
        statusValue = status.status;
      }
      if (Array.isArray(statusValue)) {
        statusValue = statusValue.filter(Boolean).join(',');
      } else if (statusValue && typeof statusValue === 'object') {
        if ('value' in statusValue) statusValue = String(statusValue.value);
        else if ('label' in statusValue) statusValue = String(statusValue.label);
        else statusValue = '';
      }
    }
    if (statusValue) params.append('status', statusValue);

    // Backend route lives under /users/producer/orders
    return await this.request(`/users/producer/orders?${params.toString()}`);
  }

  /**
   * Alias pour compatibilité
   */
  async getMyOrders(page = 1, limit = 50, status = '') {
    return await this.getProducerOrders(page, limit, status);
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateOrderStatus(orderId, status) {
    return await this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      data: { status }
    });
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

  /**
   * Formations (admin/général) avec filtres
   */
  async getFormations(filters = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      type,
      level,
      search,
      isPublished,
      sort
    } = (filters || {});

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });

    const appendIf = (key, value) => {
      if (value !== undefined && value !== null && value !== '') params.append(key, String(value));
    };

    appendIf('category', category);
    appendIf('type', type);
    appendIf('level', level);
    appendIf('search', search);
    if (isPublished !== undefined) params.append('isPublished', String(Boolean(isPublished)));
    appendIf('sort', sort);

    return await this.request(`/formations?${params.toString()}`);
  }

  /**
   * Publier/Dépublier une formation (toggle)
   */
  async toggleFormationPublish(formationId) {
    return await this.request(`/formations/${formationId}/publish`, {
      method: 'PATCH'
    });
  }

  /**
   * Créer une formation
   */
  async createFormation(formationData) {
    return await this.request('/formations', {
      method: 'POST',
      data: formationData
    });
  }

  /**
   * Mettre à jour une formation
   */
  async updateFormation(formationId, formationData) {
    return await this.request(`/formations/${formationId}`, {
      method: 'PUT',
      data: formationData
    });
  }

  /**
   * Supprimer une formation
   */
  async deleteFormation(formationId) {
    return await this.request(`/formations/${formationId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Options/Formations metadata (catégories, types, niveaux, statuts)
   */
  async getFormationOptions() {
    return await this.request('/formations/options');
  }

  /**
   * Catégories de formations
   */
  async getFormationCategories() {
    return await this.request('/formations/categories');
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
  async getDeliveryStats() {
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
   * Livraisons disponibles à accepter
   */
  async getAvailableDeliveries() {
    return await this.request('/deliveries/available');
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
   * Détails d'une livraison
   */
  async getDeliveryDetails(deliveryId) {
    return await this.request(`/deliveries/${deliveryId}`);
  }

  /**
   * Alias pour les livraisons disponibles (pagination)
   */
  async getAvailableDeliveries(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (filters.status) params.append('status', filters.status);
    return await this.request(`/deliveries/available?${params.toString()}`);
  }

  /**
   * Alias pour mes livraisons (pagination)
   */
  async getMyDeliveries(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (filters.status) params.append('status', filters.status);
    return await this.request(`/deliveries/my?${params.toString()}`);
  }

  /**
   * Alias pour l'historique des livraisons (pagination)
   */
  async getDeliveryHistory(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    return await this.request(`/deliveries/history?${params.toString()}`);
  }

  /**
   * Changer le statut d'un utilisateur (alias)
   */
  async toggleUserStatus(userId) {
    return await this.changeUserStatus(userId, 'toggle');
  }

  /**
   * Changer le rôle d'un utilisateur (alias)
   */
  async updateUserRole(userId, role) {
    return await this.changeUserRole(userId, role);
  }

  /**
   * Supprimer un utilisateur (admin uniquement)
   */
  async deleteUser(userId) {
    return await this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Bloquer un utilisateur (admin uniquement)
   */
  async blockUser(userId, reason = '') {
    return await this.request(`/admin/users/${userId}/block`, {
      method: 'PATCH',
      data: { reason }
    });
  }

  /**
   * Débloquer un utilisateur (admin uniquement)
   */
  async unblockUser(userId) {
    return await this.request(`/admin/users/${userId}/unblock`, {
      method: 'PATCH'
    });
  }

  /**
   * Vérifier si un utilisateur est bloqué (helper)
   */
  async isUserBlocked(userId) {
    return await this.request(`/admin/users/${userId}/status`);
  }

  // =====================
  // UTILITAIRES
  // =====================

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

// Export des statuts pour utilisation dans les composants
export const ORDER_STATUSES = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
};

export const DELIVERY_STATUSES = {
  available: 'Disponible',
  assigned: 'Assigné',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée'
};

export const USER_ROLES = {
  consommateur: 'Consommateur',
  producteur: 'Producteur',
  livreur: 'Livreur',
  admin: 'Administrateur'
};
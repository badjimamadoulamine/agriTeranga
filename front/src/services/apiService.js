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
  async (response) => response,
  async (error) => {
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

// Helpers & in-memory cache for GET requests
const GET_CACHE = new Map();
const CACHE_TTL_MS = 30000; // 30s
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const buildCacheKey = (endpoint, options = {}) => {
  try {
    const method = (options.method || 'GET').toUpperCase();
    if (method !== 'GET') return null;
    const params = options.params ? JSON.stringify(options.params) : '';
    return `${endpoint}::${params}`;
  } catch {
    return `${endpoint}`;
  }
};

class ApiService {
  /**
   * Requête générique avec gestion d'erreurs
   */
  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const isGet = method === 'GET';
    const noCache = options.noCache === true;
    const cacheKey = isGet && !noCache ? buildCacheKey(endpoint, options) : null;

    // Serve from cache if fresh
    if (cacheKey && GET_CACHE.has(cacheKey)) {
      const entry = GET_CACHE.get(cacheKey);
      if (Date.now() - entry.time < CACHE_TTL_MS) {
        return entry.data; // already response.data
      }
    }

    // Retry loop for 429 on GETs
    const maxAttempts = isGet ? 4 : 1;
    let attempt = 0;
    while (true) {
      try {
        // Éviter notre cache mémoire si noCache
        const reqOptions = { ...options };
        delete reqOptions.noCache;
        const response = await apiClient.request({ url: endpoint, method, ...reqOptions });
        const data = response.data;
        if (isGet) {
          if (cacheKey) GET_CACHE.set(cacheKey, { time: Date.now(), data });
        } else {
          // Invalidate all GET cache entries after a mutating request
          GET_CACHE.clear();
        }
        return data;
      } catch (error) {
        // Handle 429 with backoff
        const status = error?.response?.status;
        if (isGet && status === 429 && attempt < maxAttempts - 1) {
          attempt++;
          const retryAfter = error.response?.headers?.['retry-after'];
          let delay = 0;
          if (retryAfter) {
            const sec = parseInt(retryAfter, 10);
            if (!Number.isNaN(sec)) delay = sec * 1000;
          }
          if (!delay) {
            // exponential backoff with jitter: 400ms * 2^attempt ± 20%
            const base = 400 * Math.pow(2, attempt - 1);
            delay = Math.min(30000, Math.round(base * (0.8 + Math.random() * 0.4)));
          }
          await sleep(delay);
          continue;
        }
      console.error('API Error:', error);

      if (error.response) {
        // Erreur avec réponse du serveur
        const data = error.response.data || {};
        // Concaténer les détails de validation si présents
        let detailedMsg = data.message || 'Erreur serveur';
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const first = data.errors[0];
          const details = data.errors
            .map(e => `${e.field ? `${e.field}: ` : ''}${e.message}`)
            .join(' | ');
          detailedMsg = `${detailedMsg} - ${details}`;
        }
        throw {
          status: error.response.status,
          message: detailedMsg,
          data
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
    // Get producer dashboard data which includes stats
    return await this.request('/users/producer/dashboard');
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
    return await this.request('/cart', { noCache: true });
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

  // =====================
  // COMMANDES (consommateur)
  // =====================
  /**
   * Créer une commande (consommateur)
   */
  async createOrder(orderData) {
    return await this.request('/orders', {
      method: 'POST',
      data: orderData
    });
  }

  /**
   * Mes commandes (consommateur)
   */
  async getConsumerOrders(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });
    // Backend exposes GET /orders for current consumer (protected)
    return await this.request(`/orders?${params.toString()}`);
  }

  // Alias explicite pour éviter la collision avec le producteur
  async getMyOrdersConsumer(page = 1, limit = 50) {
    return await this.getConsumerOrders(page, limit);
  }

  /**
   * Détails d'une commande (consommateur)
   */
  async getOrderDetails(orderId) {
    return await this.request(`/orders/${orderId}`);
  }

  /**
   * Annuler une commande (consommateur)
   */
  async cancelOrder(orderId, reason = '') {
    return await this.request(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
      data: { reason }
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

    // Backend route is /orders/producer/list for producer orders
    return await this.request(`/orders/producer/list?${params.toString()}`);
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
    const response = await this.request('/deliveries', { noCache: true });
    if (response.status === 'success' && response.data?.deliveries) {
      const deliveries = response.data.deliveries;
      const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;
      const inPreparationDeliveries = deliveries.filter(d => d.status === 'assigned').length;
      const inTransitDeliveries = deliveries.filter(d => ['picked-up', 'in-transit'].includes(d.status)).length;
      const cancelledDeliveries = deliveries.filter(d => d.status === 'failed' || (d.order && d.order.status === 'cancelled')).length;
      const stats = {
        totalDeliveries: response.total || deliveries.length,
        completedDeliveries,
        pendingDeliveries: inPreparationDeliveries + inTransitDeliveries,
        inPreparationDeliveries,
        inTransitDeliveries,
        cancelledDeliveries,
        totalEarnings: completedDeliveries * 1000 // Calcul approximatif
      };
      return { status: 'success', data: stats };
    }
    return response;
  }

  /**
   * Mes livraisons (pagination)
   */
  async getMyDeliveries(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (filters.status) params.append('status', filters.status);
    return await this.request(`/deliveries?${params.toString()}`, { noCache: true });
  }

  /**
   * Livraisons disponibles à accepter
   */
  async getAvailableDeliveries(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return await this.request(`/deliveries/available?${params.toString()}`, { noCache: true });
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

    return await this.request(`/deliveries/my/history?${params.toString()}`, { noCache: true });
  }

  /**
   * Historique des livraisons (alias)
   * Compatible avec les appels existants: getDeliveryHistory(page, limit, filters)
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
    return await this.request(`/deliveries/${deliveryId}`, { noCache: true });
  }

  /**
   * Changer le statut d'un utilisateur (alias)
   */
  
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

  // =====================
  // GESTION DU PROFIL
  // =====================

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getMyProfile() {
    return await this.request('/users/me');
  }

  /**
   * Obtenir le profil d'un utilisateur spécifique
   */
  async getUserProfile(userId) {
    return await this.request(`/users/profile/${userId}`);
  }

  /**
   * Mettre à jour le profil de l'utilisateur
   */
  async updateProfile(profileData) {
    // Si une photo est incluse, utiliser FormData
    if (profileData.profilePicture instanceof File || profileData.profilePicture instanceof Blob) {
      const formData = new FormData();
      
      // Ajouter tous les champs
      Object.keys(profileData).forEach(key => {
        if (key === 'profilePicture') {
          formData.append('profilePicture', profileData[key]);
        } else if (typeof profileData[key] === 'object') {
          formData.append(key, JSON.stringify(profileData[key]));
        } else {
          formData.append(key, profileData[key]);
        }
      });

      return await this.request('/users/profile', {
        method: 'PUT',
        headers: {
          // Ne pas définir Content-Type pour multipart/form-data
        },
        data: formData
      });
    } else {
      // Utilisation JSON pour les données normales
      return await this.request('/users/profile', {
        method: 'PUT',
        data: profileData
      });
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(passwordData) {
    return await this.request('/users/change-password', {
      method: 'PUT',
      data: passwordData
    });
  }

  /**
   * Mettre à jour les préférences
   */
  async updatePreferences(preferences) {
    return await this.request('/users/preferences', {
      method: 'PUT',
      data: preferences
    });
  }

  /**
   * Supprimer son compte
   */
  async deleteAccount() {
    return await this.request('/users/account', {
      method: 'DELETE'
    });
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
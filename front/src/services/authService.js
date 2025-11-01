import api from './api'

const authService = {
  // Inscription
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Vérification email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      // Stocker aussi les tokens spécifiques selon le rôle
      const role = response.data.user?.role
      if (role === 'admin') {
        localStorage.setItem('adminDashboardToken', response.data.token)
        localStorage.setItem('adminDashboardUser', JSON.stringify(response.data.user))
      } else if (role === 'producteur') {
        localStorage.setItem('producerDashboardToken', response.data.token)
        localStorage.setItem('producerDashboardUser', JSON.stringify(response.data.user))
      } else if (role === 'livreur') {
        localStorage.setItem('deliveryDashboardToken', response.data.token)
        localStorage.setItem('deliveryDashboardUser', JSON.stringify(response.data.user))
      }
    }
    return response.data
  },

  // Connexion
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      // Stocker aussi les tokens spécifiques selon le rôle
      const role = response.data.user?.role
      if (role === 'admin') {
        localStorage.setItem('adminDashboardToken', response.data.token)
        localStorage.setItem('adminDashboardUser', JSON.stringify(response.data.user))
      } else if (role === 'producteur') {
        localStorage.setItem('producerDashboardToken', response.data.token)
        localStorage.setItem('producerDashboardUser', JSON.stringify(response.data.user))
      } else if (role === 'livreur') {
        localStorage.setItem('deliveryDashboardToken', response.data.token)
        localStorage.setItem('deliveryDashboardUser', JSON.stringify(response.data.user))
      }
    }
    return response.data
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: () => {
    const userString = localStorage.getItem('user')
    if (!userString || userString === 'undefined' || userString === 'null') {
      return null
    }
    try {
      return JSON.parse(userString)
    } catch (error) {
      // En cas d'erreur de parsing, nettoyer le localStorage corrompu
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return null
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}

export default authService

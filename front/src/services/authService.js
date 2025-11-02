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
    const apiUser = response.data?.data?.user || response.data?.user
    const apiToken = response.data?.token
    if (apiToken && apiUser) {
      localStorage.setItem('token', apiToken)
      localStorage.setItem('user', JSON.stringify(apiUser))
      // Stocker aussi les tokens spécifiques selon le rôle
      const role = apiUser?.role
      if (role === 'admin') {
        localStorage.setItem('adminDashboardToken', apiToken)
        localStorage.setItem('adminDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'producteur') {
        localStorage.setItem('producerDashboardToken', apiToken)
        localStorage.setItem('producerDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'livreur') {
        localStorage.setItem('deliveryDashboardToken', apiToken)
        localStorage.setItem('deliveryDashboardUser', JSON.stringify(apiUser))
      }
    }
    return response.data
  },

  // Connexion
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const apiUser = response.data?.data?.user || response.data?.user
    const apiToken = response.data?.token
    if (apiToken && apiUser) {
      localStorage.setItem('token', apiToken)
      localStorage.setItem('user', JSON.stringify(apiUser))
      // Stocker aussi les tokens spécifiques selon le rôle
      const role = apiUser?.role
      if (role === 'admin') {
        localStorage.setItem('adminDashboardToken', apiToken)
        localStorage.setItem('adminDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'producteur') {
        localStorage.setItem('producerDashboardToken', apiToken)
        localStorage.setItem('producerDashboardUser', JSON.stringify(apiUser))
      } else if (role === 'livreur') {
        localStorage.setItem('deliveryDashboardToken', apiToken)
        localStorage.setItem('deliveryDashboardUser', JSON.stringify(apiUser))
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

import React, { useState, useEffect, createContext, useContext } from 'react'

/**
 * Contexte pour les notifications toast
 */
const ToastContext = createContext()

/**
 * Hook pour utiliser les notifications toast
 */
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Composant Toast pour afficher une notification individuelle
 */
const Toast = ({ toast, onRemove }) => {
  const { position = 'top-right', duration = 5000 } = toast

  useEffect(() => {
    if (duration > 0 && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, toast, onRemove])

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
  }

  const typeStyles = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600',
    warning: 'bg-yellow-500 text-white border-yellow-600',
    info: 'bg-blue-500 text-white border-blue-600',
    loading: 'bg-gray-500 text-white border-gray-600'
  }

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    loading: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )
  }

  return (
    <div className={`fixed z-50 ${positions[position]} max-w-sm w-full`}>
      <div className={`
        ${typeStyles[toast.type]} 
        px-4 py-3 rounded-lg shadow-lg border flex items-start gap-3 
        transform transition-all duration-300 ease-in-out
        ${toast.type === 'loading' ? 'cursor-wait' : 'hover:shadow-xl'}
      `}>
        <div className="flex-shrink-0">
          {icons[toast.type]}
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-sm">{toast.title}</p>
          )}
          <p className={`text-sm ${toast.title ? 'mt-1' : ''}`}>
            {toast.message}
          </p>
          
          {/* Actions personnalisées */}
          {toast.actions && (
            <div className="flex gap-2 mt-2">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="text-xs px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                  disabled={toast.type === 'loading'}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Bouton fermer (sauf pour loading) */}
        {toast.type !== 'loading' && (
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 hover:opacity-75 transition-opacity"
            disabled={toast.type === 'loading'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Composant Provider pour les notifications Toast
 */
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      position,
      duration: 5000,
      ...toast
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      return updated.slice(0, maxToasts) // Limiter le nombre de toasts
    })

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearAll = () => {
    setToasts([])
  }

  // Méthodes de convenance
  const success = (message, options = {}) => {
    return addToast({ type: 'success', message, ...options })
  }

  const error = (message, options = {}) => {
    return addToast({ type: 'error', message, ...options })
  }

  const warning = (message, options = {}) => {
    return addToast({ type: 'warning', message, ...options })
  }

  const info = (message, options = {}) => {
    return addToast({ type: 'info', message, ...options })
  }

  const loading = (message, options = {}) => {
    return addToast({ type: 'loading', message, duration: 0, ...options })
  }

  // Méthodes pour les notifications d'authentification
  const showAuthError = (error, context = 'general') => {
    let message = 'Une erreur inattendue s\'est produite'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          if (data.message?.includes('email')) {
            message = 'Cette adresse email est déjà utilisée ou invalide'
          } else if (data.message?.includes('password')) {
            message = 'Le mot de passe ne respecte pas les critères de sécurité'
          } else if (data.message?.includes('phone')) {
            message = 'Numéro de téléphone invalide'
          } else {
            message = data.message || 'Données invalides'
          }
          break
          
        case 401:
          message = 'Email ou mot de passe incorrect'
          break
          
        case 403:
          if (data.message?.includes('not verified')) {
            message = 'Veuillez vérifier votre email avant de vous connecter'
          } else {
            message = 'Accès refusé'
          }
          break
          
        case 404:
          message = 'Aucun compte trouvé avec ces identifiants'
          break
          
        case 409:
          message = 'Un compte existe déjà avec cet email'
          break
          
        case 500:
          message = 'Erreur serveur temporaire. Réessayez dans quelques minutes'
          break
          
        default:
          message = data.message || `Erreur serveur (${status})`
      }
    } else if (error.request) {
      message = 'Problème de connexion. Vérifiez votre internet'
    }

    return errorFunction(message, {
      title: 'Erreur d\'authentification',
      duration: 7000
    })
  }

  // Alias pour éviter le conflit de noms
  const errorFunction = error

  const showAuthSuccess = (message, options = {}) => {
    return success(message, {
      title: 'Succès',
      ...options
    })
  }

  const contextValue = {
    // État
    toasts,
    
    // Méthodes de base
    addToast,
    removeToast,
    clearAll,
    
    // Méthodes de convenance
    success,
    error,
    warning,
    info,
    loading,
    
    // Méthodes spécifiques à l'auth
    showAuthError,
    showAuthSuccess
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Rendu des toasts */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/**
 * Hook pour les notifications d'authentification simplifiées
 */
export const useAuthToast = () => {
  const toast = useToast()
  
  return {
    showSuccess: toast.showAuthSuccess,
    showError: toast.showAuthError,
    showInfo: (message) => toast.info(message, { title: 'Information' }),
    showWarning: (message) => toast.warning(message, { title: 'Attention' }),
    showLoading: (message) => toast.loading(message, { title: 'Chargement...' }),
    removeToast: toast.removeToast
  }
}

export default ToastProvider
import React from 'react'

/**
 * Composant pour afficher les erreurs avec style et contexte
 */
export const ErrorMessage = ({ 
  error, 
  field = 'general', 
  type = 'error', 
  showIcon = true, 
  className = '',
  context = '',
  onDismiss 
}) => {
  if (!error) return null

  const baseClasses = 'flex items-start gap-3 p-4 rounded-lg border'
  
  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  const icons = {
    error: (
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  }

  // Messages d'aide contextuels
  const contextHelp = {
    email: {
      error: 'Assurez-vous que votre adresse email est correctement écrite et n\'a pas déjà été utilisée pour créer un compte.',
      info: 'Utilisez une adresse email valide que vous consultez régulièrement pour recevoir les notifications importantes.'
    },
    password: {
      error: 'Votre mot de passe doit contenir au moins 8 caractères avec au moins une majuscule, une minuscule et un chiffre.',
      info: 'Choisissez un mot de passe facile à retenir mais difficile à deviner pour protéger votre compte.'
    },
    phone: {
      error: 'Entrez un numéro de téléphone valide avec l\'indicatif pays si nécessaire.',
      info: 'Nous utilisons votre numéro pour les notifications importantes et la livraison.'
    },
    firstName: {
      error: 'Le prénom est requis et doit contenir au moins 2 caractères.',
      info: 'Utilisez votre prénom officiel pour faciliter les communications.'
    },
    lastName: {
      error: 'Le nom est requis et doit contenir au moins 2 caractères.',
      info: 'Utilisez votre nom de famille officiel.'
    },
    address: {
      error: 'L\'adresse est requise pour la livraison de vos commandes.',
      info: 'Spécifiez une adresse précise où vous pouvez recevoir vos commandes.'
    },
    general: {
      error: 'Une erreur s\'est produite. Vérifiez vos informations et réessayez.',
      info: 'Besoin d\'aide ? Contactez notre support client.',
      warning: 'Cette action peut prendre quelques instants. Veuillez patienter.',
      success: 'Action réalisée avec succès !'
    }
  }

  const helpText = contextHelp[field]?.[type] || contextHelp.general?.[type]

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {showIcon && icons[type]}
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{error}</p>
        {helpText && (
          <p className="text-xs mt-1 opacity-75">{helpText}</p>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-current hover:opacity-75 transition-opacity"
          type="button"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * Composant pour afficher une liste d'erreurs
 */
export const ErrorList = ({ 
  errors, 
  type = 'error', 
  className = '',
  onDismiss 
}) => {
  if (!errors || Object.keys(errors).length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      {Object.entries(errors).map(([field, error]) => (
        <ErrorMessage
          key={field}
          error={error}
          field={field}
          type={type}
          onDismiss={onDismiss ? () => onDismiss(field) : undefined}
        />
      ))}
    </div>
  )
}

/**
 * Composant pour afficher un champ avec indicateur d'erreur
 */
export const FieldWithError = ({ 
  label, 
  name, 
  error, 
  children, 
  required = false,
  helpText = '',
  className = '' 
}) => {
  const hasError = !!error
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`relative ${hasError ? 'ring-2 ring-red-500 rounded-lg' : ''}`}>
        {children}
        
        {/* Indicateur d'erreur visuel */}
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Message d'erreur */}
      {hasError && (
        <ErrorMessage
          error={error}
          field={name}
          type="error"
          className="mt-2"
          showIcon={false}
        />
      )}
      
      {/* Texte d'aide */}
      {helpText && !hasError && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

/**
 * Composant Toast pour notifications temporaires
 */
export const ErrorToast = ({ 
  message, 
  type = 'error', 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!message) return null

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
  }

  const typeStyles = {
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white'
  }

  return (
    <div className={`fixed z-50 ${positions[position]} max-w-sm`}>
      <div className={`${typeStyles[type]} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <span className="flex-1 text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-75 transition-opacity"
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

export default ErrorMessage
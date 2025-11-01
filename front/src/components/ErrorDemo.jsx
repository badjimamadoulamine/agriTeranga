import React, { useState } from 'react'
import useErrorHandler from '../hooks/useErrorHandler'
import { useAuthToast } from '../contexts/ToastContext'
import { FieldWithError, ErrorList } from './ErrorMessage'

/**
 * Composant de démonstration pour le système de gestion d'erreurs
 */
const ErrorDemo = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    name: ''
  })

  const { 
    errors, 
    isSubmitting, 
    clearErrors, 
    setFieldError, 
    validateField, 
    validateForm,
    setLoading,
    handleApiError
  } = useErrorHandler()

  const toast = useAuthToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validation en temps réel
    const validationRules = {
      email: { required: true },
      password: { required: true, minLength: 8 },
      phone: { required: true },
      name: { required: true, minLength: 2 }
    }

    if (validationRules[name]) {
      const error = validateField(name, value, validationRules[name])
      if (error) {
        setFieldError(name, error)
      } else {
        // Effacer l'erreur si la validation passe
        clearErrors()
      }
    }
  }

  const simulateApiError = (errorType) => {
    const mockErrors = {
      email: {
        response: { 
          status: 400, 
          data: { message: 'Email already exists' } 
        }
      },
      password: {
        response: { 
          status: 400, 
          data: { message: 'Password too weak' } 
        }
      },
      network: {
        request: true
      },
      server: {
        response: { 
          status: 500, 
          data: { message: 'Internal server error' } 
        }
      },
      auth: {
        response: { 
          status: 401, 
          data: { message: 'Invalid credentials' } 
        }
      }
    }

    const mockError = mockErrors[errorType]
    if (mockError) {
      handleApiError(mockError, 'demo')
      toast.showError('Erreur simulée pour démonstration')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validationSchema = {
      email: { required: true },
      password: { required: true, minLength: 8 },
      phone: { required: true },
      name: { required: true, minLength: 2 }
    }

    const { isValid } = validateForm(formData, validationSchema)
    if (!isValid) {
      toast.showError('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    setLoading(true)
    
    // Simuler un appel API
    setTimeout(() => {
      setLoading(false)
      toast.showSuccess('Formulaire soumis avec succès !')
      clearErrors()
      setFormData({ email: '', password: '', phone: '', name: '' })
    }, 2000)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Démonstration du Système de Gestion d'Erreurs
      </h2>

      {/* Démonstration des toasts */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Notifications Toast</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast.showSuccess('Opération réussie !')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Succès
          </button>
          <button
            onClick={() => toast.showError('Une erreur s\'est produite')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Erreur
          </button>
          <button
            onClick={() => toast.showWarning('Attention : action risquée')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Avertissement
          </button>
          <button
            onClick={() => toast.showInfo('Information importante')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Information
          </button>
          <button
            onClick={() => {
              const id = toast.showLoading('Chargement en cours...')
              setTimeout(() => toast.removeToast(id), 3000)
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Chargement
          </button>
        </div>
      </div>

      {/* Démonstration des erreurs API simulées */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Erreurs API Simulées</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => simulateApiError('email')}
            className="px-3 py-2 bg-red-100 text-red-700 rounded border hover:bg-red-200"
          >
            Erreur Email
          </button>
          <button
            onClick={() => simulateApiError('password')}
            className="px-3 py-2 bg-red-100 text-red-700 rounded border hover:bg-red-200"
          >
            Erreur Mot de passe
          </button>
          <button
            onClick={() => simulateApiError('network')}
            className="px-3 py-2 bg-red-100 text-red-700 rounded border hover:bg-red-200"
          >
            Erreur Réseau
          </button>
          <button
            onClick={() => simulateApiError('server')}
            className="px-3 py-2 bg-red-100 text-red-700 rounded border hover:bg-red-200"
          >
            Erreur Serveur
          </button>
          <button
            onClick={() => simulateApiError('auth')}
            className="px-3 py-2 bg-red-100 text-red-700 rounded border hover:bg-red-200"
          >
            Erreur Auth
          </button>
        </div>
      </div>

      {/* Formulaire avec validation */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-semibold text-lg">Formulaire de Test</h3>

        {/* Liste des erreurs */}
        {Object.keys(errors).length > 0 && (
          <ErrorList 
            errors={errors} 
            onDismiss={(field) => {
              console.log('Dismiss error for field:', field)
            }}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <FieldWithError
            label="Email"
            name="email"
            error={errors.email}
            required
            helpText="Adresse email valide requise"
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="exemple@email.com"
            />
          </FieldWithError>

          <FieldWithError
            label="Mot de passe"
            name="password"
            error={errors.password}
            required
            helpText="Minimum 8 caractères avec majuscule, minuscule et chiffre"
          >
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
          </FieldWithError>

          <FieldWithError
            label="Téléphone"
            name="phone"
            error={errors.phone}
            required
            helpText="Numéro de téléphone valide"
          >
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+33 6 12 34 56 78"
            />
          </FieldWithError>

          <FieldWithError
            label="Nom complet"
            name="name"
            error={errors.name}
            required
            helpText="Votre nom et prénom"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Jean Dupont"
            />
          </FieldWithError>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Envoi...' : 'Soumettre'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              clearErrors()
              setFormData({ email: '', password: '', phone: '', name: '' })
              toast.showInfo('Formulaire réinitialisé')
            }}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {/* Informations sur le système */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Fonctionnalités du Système</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✓ Validation en temps réel des champs</li>
          <li>✓ Messages d'erreur contextuels et en français</li>
          <li>✓ Indicateurs visuels d'erreur</li>
          <li>✓ Notifications toast informatives</li>
          <li>✓ Gestion centralisée des erreurs API</li>
          <li>✓ Messages d'aide contextuels</li>
          <li>✓ Système de retry automatique</li>
          <li>✓ Interface utilisateur intuitive</li>
        </ul>
      </div>
    </div>
  )
}

export default ErrorDemo
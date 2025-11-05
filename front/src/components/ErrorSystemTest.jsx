import React, { useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { useToast } from '../contexts/ToastContext'
import { ErrorMessage, FieldWithError, ErrorList } from './ErrorMessage'

/**
 * Composant de test pour vérifier le bon fonctionnement du système d'erreurs
 * À utiliser temporairement pour valider les corrections
 */
const ErrorSystemTest = () => {
  const { errors, setFieldError, clearError, validateField, handleApiError } = useErrorHandler()
  const toast = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    firstName: ''
  })

  // Test des validations
  const testValidations = () => {
    const results = {
      email: validateField('email', 'invalid-email'),
      password: validateField('password', '123'),
      phone: validateField('phone', '123'),
      firstName: validateField('firstName', 'A') // Trop court
    }
    
    console.log('Validation Results:', results)
    alert('Tests de validation exécutés ! Regardez la console.')
  }

  // Test des toasts
  const testToasts = () => {
    toast.success('Test de toast succès')
    setTimeout(() => toast.error('Test de toast erreur'), 1000)
    setTimeout(() => toast.warning('Test de toast warning'), 2000)
    setTimeout(() => toast.info('Test de toast info'), 3000)
  }

  // Test d'erreur API simulée
  const testApiError = () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Email already exists' }
      }
    }
    
    const { errorMessage } = handleApiError(mockError, 'test')
    toast.showAuthError(mockError)
    console.log('API Error handled:', errorMessage)
  }

  // Test des champs avec erreurs
  const simulateFieldErrors = () => {
    setFieldError('email', 'Cette adresse email est déjà utilisée')
    setFieldError('password', 'Le mot de passe est trop faible')
    setFieldError('phone', 'Numéro de téléphone invalide')
  }

  const clearAllErrors = () => {
    Object.keys(errors).forEach(field => clearError(field))
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validation en temps réel
    const error = validateField(field, value)
    if (error) {
      setFieldError(field, error)
    } else {
      clearError(field)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Test du Système de Gestion des Erreurs
        </h1>

        {/* Tests rapides */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Tests Rapides</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={testValidations}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tester les Validations
            </button>
            <button 
              onClick={testToasts}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Tester les Toasts
            </button>
            <button 
              onClick={testApiError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Tester Erreur API
            </button>
            <button 
              onClick={simulateFieldErrors}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Simuler Erreurs Champs
            </button>
            <button 
              onClick={clearAllErrors}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Effacer Erreurs
            </button>
          </div>
        </div>

        {/* Formulaire de test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Formulaire de Test</h3>
            
            <FieldWithError 
              label="Email" 
              error={errors.email}
              help="Format: utilisateur@domaine.com"
            >
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
            </FieldWithError>

            <FieldWithError 
              label="Mot de passe" 
              error={errors.password}
              help="8+ caractères, majuscule, minuscule, chiffre"
            >
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mot de passe sécurisé"
              />
            </FieldWithError>

            <FieldWithError 
              label="Téléphone" 
              error={errors.phone}
              help="Format international: +221701234567"
            >
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+221701234567"
              />
            </FieldWithError>

            <FieldWithError 
              label="Prénom" 
              error={errors.firstName}
              help="Minimum 2 caractères"
            >
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Votre prénom"
              />
            </FieldWithError>
          </div>

          {/* État actuel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">État Actuel</h3>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Données du formulaire :</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(formData, null, 2)}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Erreurs détectées :</h4>
              {Object.keys(errors).length > 0 ? (
                <ErrorList errors={errors} />
              ) : (
                <p className="text-green-600 text-sm">Aucune erreur détectée ✅</p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h4 className="font-medium text-yellow-800 mb-2">Instructions de Test</h4>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Utilisez les boutons "Tests Rapides" pour vérifier chaque fonctionnalité</li>
            <li>Tapez dans les champs pour voir la validation en temps réel</li>
            <li>Vérifiez que les messages d'erreur sont en français</li>
            <li>Observez les toasts pour les notifications</li>
            <li>Ouvrez la console développeur pour voir les logs détaillés</li>
          </ol>
        </div>

        {/* Messages d'état */}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Statut du système :</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>✅ Hook useErrorHandler fonctionnel</li>
            <li>✅ Context Toast configuré</li>
            <li>✅ Composants ErrorMessage chargés</li>
            <li>⚠️ Backend API requis pour les tests complets</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorSystemTest
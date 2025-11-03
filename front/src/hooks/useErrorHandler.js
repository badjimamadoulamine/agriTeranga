import { useState, useCallback } from 'react'

/**
 * Hook pour la gestion centralisée des erreurs
 * Fournit des méthodes pour gérer différents types d'erreurs avec des messages contextualisés
 */
export const useErrorHandler = () => {
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Nettoie toutes les erreurs
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Supprime une erreur spécifique
   */
  const clearError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  /**
   * Définit une erreur pour un champ spécifique
   */
  const setFieldError = useCallback((field, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }))
  }, [])

  /**
   * Définit plusieurs erreurs
   */
  const setMultipleErrors = useCallback((errorObject) => {
    setErrors(prev => ({
      ...prev,
      ...errorObject
    }))
  }, [])

  /**
   * Gère les erreurs d'API avec des messages contextualisés
   */
  const handleApiError = useCallback((error, context = 'general') => {
    console.error('API Error:', error)
    
    let errorMessage = 'Une erreur inattendue s\'est produite'
    let fieldErrors = {}

    if (error.response) {
      // Erreur de réponse HTTP
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          if (data.message?.includes('email')) {
            errorMessage = 'Adresse email invalide ou déjà utilisée'
            fieldErrors.email = 'Cette adresse email est déjà enregistrée'
          } else if (data.message?.includes('password')) {
            errorMessage = 'Mot de passe non conforme'
            fieldErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'
          } else if (data.message?.includes('phone')) {
            errorMessage = 'Numéro de téléphone invalide'
            fieldErrors.phone = 'Veuillez entrer un numéro de téléphone valide'
          } else if (data.message?.includes('firstName') || data.message?.includes('lastName')) {
            errorMessage = 'Nom ou prénom invalide'
            fieldErrors.general = 'Veuillez vérifier vos informations personnelles'
          } else {
            errorMessage = data.message || 'Données invalides'
          }
          break
          
        case 401:
          errorMessage = 'Identifiants de connexion incorrects'
          fieldErrors.general = 'Vérifiez votre email et votre mot de passe'
          break
          
        case 403:
          if (data.message?.includes('not verified')) {
            errorMessage = 'Votre compte n\'est pas encore vérifié'
            fieldErrors.general = 'Veuillez vérifier votre email et cliquer sur le lien de validation'
          } else {
            errorMessage = 'Accès refusé'
          }
          break
          
        case 404:
          errorMessage = 'Utilisateur non trouvé'
          fieldErrors.general = 'Aucun compte associé à ces identifiants'
          break
          
        case 409:
          errorMessage = 'Compte déjà existant'
          fieldErrors.email = 'Un compte existe déjà avec cette adresse email'
          break
          
        case 422:
          // Erreurs de validation du serveur
          if (data.errors) {
            Object.keys(data.errors).forEach(field => {
              fieldErrors[field] = data.errors[field].message
            })
            errorMessage = 'Veuillez corriger les erreurs dans le formulaire'
          } else {
            errorMessage = data.message || 'Données invalides'
          }
          break
          
        case 500:
          errorMessage = 'Erreur serveur temporaire'
          fieldErrors.general = 'Notre équipe travaille sur le problème. Réessayez dans quelques minutes'
          break
          
        case 503:
          errorMessage = 'Service temporairement indisponible'
          fieldErrors.general = 'Le service est temporairement hors ligne. Réessayez plus tard'
          break
          
        default:
          errorMessage = data.message || `Erreur serveur (${status})`
          fieldErrors.general = 'Une erreur s\'est produite. Veuillez réessayer'
      }
    } else if (error.request) {
      // Erreur réseau
      errorMessage = 'Problème de connexion'
      fieldErrors.general = 'Vérifiez votre connexion internet et réessayez'
    } else {
      // Erreur de configuration
      errorMessage = 'Erreur de configuration'
      fieldErrors.general = 'Problème temporaire. Veuillez rafraîchir la page'
    }

    setMultipleErrors(fieldErrors)
    return { errorMessage, fieldErrors }
  }, [])

  /**
   * Valide un champ en temps réel
   */
  const validateField = useCallback((field, value, validationRules = {}) => {
    const rules = {
      required: 'Ce champ est obligatoire',
      email: 'Adresse email invalide',
      phone: 'Numéro de téléphone invalide',
      password: 'Mot de passe trop faible',
      minLength: 'Trop court',
      ...validationRules
    }

    // Validation requise
    if (rules.required && (!value || value.trim() === '')) {
      return rules.required
    }

    // Validation email
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Adresse email invalide'
      }
    }

    // Validation téléphone
    if (field === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Numéro de téléphone invalide'
      }
    }

    // Validation mot de passe
    if (field === 'password' && value) {
      if (value.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères'
      }
      if (!/[A-Z]/.test(value)) {
        return 'Le mot de passe doit contenir au moins une majuscule'
      }
      if (!/[a-z]/.test(value)) {
        return 'Le mot de passe doit contenir au moins une minuscule'
      }
      if (!/\d/.test(value)) {
        return 'Le mot de passe doit contenir au moins un chiffre'
      }
    }

    // Validation longueur minimale
    if (validationRules.minLength && value && value.length < validationRules.minLength) {
      return `Minimum ${validationRules.minLength} caractères requis`
    }

    return null // Aucune erreur
  }, [])

  /**
   * Valide tout le formulaire
   */
  const validateForm = useCallback((formData, validationSchema) => {
    const fieldErrors = {}
    let isValid = true

    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, formData[field], validationSchema[field])
      if (error) {
        fieldErrors[field] = error
        isValid = false
      }
    })

    setMultipleErrors(fieldErrors)
    return { isValid, errors: fieldErrors }
  }, [validateField, setMultipleErrors])

  /**
   * Gestion du loading state
   */
  const setLoading = useCallback((loading) => {
    setIsSubmitting(loading)
  }, [])

  /**
   * Gestion des erreurs avec retry
   */
  const handleErrorWithRetry = useCallback(async (error, retryFunction, maxRetries = 3) => {
    let retryCount = 0
    let lastError = error

    while (retryCount < maxRetries) {
      try {
        setLoading(true)
        return await retryFunction()
      } catch (err) {
        lastError = err
        retryCount++
        
        if (retryCount < maxRetries) {
          // Attendre avant de réessayer (exponentiel backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
        }
      } finally {
        setLoading(false)
      }
    }

    // Si tous les retries ont échoué, handle l'erreur finale
    return handleApiError(lastError)
  }, [handleApiError, setLoading])

  return {
    errors,
    isSubmitting,
    clearErrors,
    clearError,
    setFieldError,
    setMultipleErrors,
    handleApiError,
    validateField,
    validateForm,
    setLoading,
    handleErrorWithRetry
  }
}

export default useErrorHandler
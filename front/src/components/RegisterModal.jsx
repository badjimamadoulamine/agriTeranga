import { useState } from 'react'
import StepIndicator from './StepIndicator'
import authService from '../services/authService'
import useErrorHandler from '../hooks/useErrorHandler'
import { FieldWithError } from './ErrorMessage'
import { useAuthToast } from '../contexts/ToastContext'
import { fileToBase64, getProfilePictureUrl, isValidImageFile } from '../utils/imageUtils'

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    // Étape 1 - Informations de base
    profilePicture: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    
    // Étape 3 - Informations spécifiques
    // Pour Livreur
    interventionZone: '',
    vehicle: '',
    loadCapacity: '',
    drivingLicense: '',
    
    // Pour Producteur
    cultureType: '',
    cultivatedArea: '',
    experience: '',
    certificate: null,
    
    // Pour Consommateur
    preferences: '',
    bio: '',
    isSubscribed: false
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Gestionnaires d'erreurs et notifications
  const { 
    errors, 
    isSubmitting, 
    clearErrors, 
    setFieldError, 
    validateField, 
    validateForm, 
    handleApiError, 
    setLoading 
  } = useErrorHandler()
  const toast = useAuthToast()

  const steps = ['Informations de base', 'Sélection du rôle', 'Informations spécifiques']

  const roles = [
    {
      id: 'consommateur',
      title: 'Consommateur',
      description: 'J\'achète des produits locaux et de saison directement auprès des producteurs.',
      icon: '🛒'
    },
    {
      id: 'producteur',
      title: 'Producteur',
      description: 'Je vends ma production et développe mon activité sur une plateforme dédiée.',
      icon: '🌱'
    },
    {
      id: 'livreur',
      title: 'Livreur',
      description: 'Je propose mes services de livraison pour acheminer les commandes de produits agricoles.',
      icon: '🚚'
    }
  ]

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
    const newValue = type === 'file' ? files[0] : value
    
    // Validation spéciale pour les images
    if (type === 'file' && name === 'profilePicture') {
      if (newValue && !isValidImageFile(newValue)) {
        setFieldError('profilePicture', 'Veuillez sélectionner une image valide (JPEG, PNG, GIF, WebP) de moins de 5MB')
        return
      } else {
        clearErrors()
      }
    }
    
    // Validation en temps réel pour certains champs
    if (name === 'email' || name === 'password' || name === 'confirmPassword' || name === 'phone' || 
        name === 'firstName' || name === 'lastName') {
      const validationRules = {
        email: { required: true },
        password: { required: true, minLength: 8 },
        confirmPassword: { required: true, minLength: 8 },
        phone: { required: true },
        firstName: { required: true, minLength: 2 },
        lastName: { required: true, minLength: 2 }
      }
      
      const error = validateField(name, newValue, validationRules[name])
      if (error) {
        setFieldError(name, error)
      } else {
        // Validation spéciale pour la confirmation du mot de passe
        if (name === 'password' || name === 'confirmPassword') {
          const nextPassword = name === 'password' ? newValue : formData.password
          const nextConfirm = name === 'confirmPassword' ? newValue : formData.confirmPassword
          if (nextPassword && nextConfirm && nextPassword !== nextConfirm) {
            setFieldError('confirmPassword', 'Les mots de passe ne correspondent pas')
          } else {
            clearErrors()
          }
        } else {
          // Effacer l'erreur si la validation passe
          clearErrors()
        }
      }
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    })
  }

  const handleNext = () => {
    if (currentStep === 2 && !selectedRole) {
      setFieldError('role', 'Veuillez sélectionner un rôle pour continuer')
      return
    }
    
    // Validation de l'étape 1 avant de passer à l'étape 2
    if (currentStep === 1) {
      const validationSchema = {
        firstName: { required: true, minLength: 2 },
        lastName: { required: true, minLength: 2 },
        email: { required: true },
        password: { required: true, minLength: 8 },
        confirmPassword: { required: true, minLength: 8 },
        phone: { required: true },
        address: { required: true }
      }
      
      // Vérification que les mots de passe correspondent
      if (formData.password !== formData.confirmPassword) {
        setFieldError('confirmPassword', 'Les mots de passe ne correspondent pas')
        toast.showError('Veuillez corriger les erreurs avant de continuer')
        return
      }
      
      const { isValid } = validateForm(formData, validationSchema)
      if (!isValid) {
        toast.showError('Veuillez corriger les erreurs avant de continuer')
        return
      }
    }
    
    clearErrors() // Effacer les erreurs avant de passer à l'étape suivante
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedRole) {
      setFieldError('role', 'Veuillez sélectionner un rôle pour vous inscrire')
      return
    }

    // Validation finale du formulaire
    const validationSchema = {
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      email: { required: true },
      password: { required: true, minLength: 8 },
      confirmPassword: { required: true, minLength: 8 },
      phone: { required: true },
      address: { required: true }
    }

    // Vérification que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setFieldError('confirmPassword', 'Les mots de passe ne correspondent pas')
      toast.showError('Les mots de passe ne correspondent pas')
      return
    }

    // Validation spécifique selon le rôle
    if (selectedRole === 'producteur') {
      validationSchema.cultureType = { required: true }
      validationSchema.cultivatedArea = { required: true }
      validationSchema.experience = { required: true }
    } else if (selectedRole === 'livreur') {
      validationSchema.interventionZone = { required: true }
      validationSchema.vehicle = { required: true }
      validationSchema.loadCapacity = { required: true }
      validationSchema.drivingLicense = { required: true }
    }

    const { isValid } = validateForm(formData, validationSchema)
    if (!isValid) {
      toast.showError('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    setLoading(true)
    clearErrors()

    // Afficher un toast de chargement
    const loadingToastId = toast.showLoading('Création de votre compte en cours...')

    try {
      // Préparer les données selon le rôle (format initial qui fonctionnait)
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        profilePicture: formData.profilePicture ?
          await fileToBase64(formData.profilePicture) :
          'https://via.placeholder.com/150x150?text=Photo',
        role: selectedRole
      }

      // Ajouter les informations spécifiques selon le rôle
      if (selectedRole === 'consommateur') {
        userData.consumerInfo = {
          preferences: formData.preferences,
          deliveryAddress: formData.address.trim(),
          bio: formData.bio.trim(),
          isSubscribed: formData.isSubscribed
        }
      } else if (selectedRole === 'producteur') {
        userData.producteurInfo = {
          cultureType: formData.cultureType.trim(),
          region: formData.cultivatedArea.trim(),
          farmSize: formData.cultivatedArea.trim(),
          description: formData.experience.toString(),
          certificates: formData.certificate ? 
            [await fileToBase64(formData.certificate)] : 
            []
        }
      } else if (selectedRole === 'livreur') {
        userData.livreurInfo = {
          deliveryZone: formData.interventionZone.trim(),
          vehicleType: formData.vehicle.trim(),
          capaciteCharge: formData.loadCapacity.trim(),
          permisConduire: formData.drivingLicense.trim()
        }
      }

      const result = await authService.register(userData)
      
      if (result.status === 'success') {
        // Supprimer le toast de chargement
        toast.removeToast(loadingToastId)
        
        // Fermer le modal après 3 secondes
        setTimeout(() => {
          onClose()
          onSwitchToLogin()
          if (onSuccess) onSuccess(result)
        }, 3000)
      }
    } catch (error) {
      toast.removeToast(loadingToastId)
      if (error?.status === 409) {
        const msg = error?.message?.toLowerCase() || ''
        if (msg.includes('email')) setFieldError('email', 'Cet email est déjà utilisé')
        if (msg.includes('phone') || msg.includes('téléphone')) setFieldError('phone', 'Ce numéro est déjà utilisé')
        toast.showError(error?.message || 'Ce compte existe déjà')
      } else {
        const { errorMessage } = handleApiError(error, 'register')
        toast.showError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Créer votre compte AgriTeranga</h2>
            <p className="text-gray-600 mt-1">Rejoignez notre plateforme et connectez-vous au monde agricole.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <StepIndicator currentStep={currentStep} steps={steps} />

          {/* Message d'erreur général */}
          {errors.general && (
            <div className="mb-6">
              <div className="p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Étape 1 - Informations de base */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Photo de profil */}
                <div className="flex flex-col items-center mb-8">
                  <label className="cursor-pointer">
                    <div className="w-28 h-28 bg-green-600 rounded-full flex items-center justify-center mb-2 hover:bg-green-700 transition-colors group">
                      {formData.profilePicture ? (
                        <img 
                          src={URL.createObjectURL(formData.profilePicture)} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg className="w-14 h-14 text-white group-hover:opacity-80 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity">Ajouter</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-600 text-center">
                    {formData.profilePicture ? 'Cliquez pour changer' : 'Cliquez pour ajouter une photo'}
                  </p>
                  {errors.profilePicture && (
                    <p className="text-sm text-red-600 mt-2">{errors.profilePicture}</p>
                  )}
                </div>

                {/* Champs du formulaire avec validation */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FieldWithError
                    label="Prénom"
                    name="firstName"
                    error={errors.firstName}
                    required
                    helpText="Votre prénom officiel"
                  >
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.firstName ? 'border-red-500' : ''
                      }`}
                      placeholder="Votre prénom"
                    />
                  </FieldWithError>

                  <FieldWithError
                    label="Nom"
                    name="lastName"
                    error={errors.lastName}
                    required
                    helpText="Votre nom de famille"
                  >
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.lastName ? 'border-red-500' : ''
                      }`}
                      placeholder="Votre nom"
                    />
                  </FieldWithError>

                  <FieldWithError
                    label="Adresse e-mail"
                    name="email"
                    error={errors.email}
                    required
                    helpText="Vous recevrez la confirmation sur cette adresse"
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.email ? 'border-red-500' : ''
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
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 pr-12 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        minLength={8}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.07.45-2.22 1.237-3.363M6.228 6.228C7.907 5.145 9.89 4.5 12 4.5c5 0 9 4 9 7 0 1.112-.455 2.299-1.29 3.45M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </FieldWithError>

                  <FieldWithError
                    label="Numéro de téléphone"
                    name="phone"
                    error={errors.phone}
                    required
                    helpText="Pour les notifications de livraison"
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                      placeholder="+221 77 123 56 78"
                    />
                  </FieldWithError>

                  <FieldWithError
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    error={errors.confirmPassword}
                    required
                    helpText="Veuillez saisir le même mot de passe"
                  >
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 pr-12 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.confirmPassword ? 'border-red-500' : ''
                        }`}
                        minLength={8}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.07.45-2.22 1.237-3.363M6.228 6.228C7.907 5.145 9.89 4.5 12 4.5c5 0 9 4 9 7 0 1.112-.455 2.299-1.29 3.45M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </FieldWithError>

                </div>
                <FieldWithError
                    label="Adresse"
                    name="address"
                    error={errors.address}
                    required
                    helpText="Adresse complète pour la livraison"
                  >
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.address ? 'border-red-500' : ''
                      }`}
                      placeholder="Dakar"
                    />
                  </FieldWithError>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-lg mt-6"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Étape 2 - Sélection du rôle */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Message d'erreur pour le rôle */}
                {errors.role && (
                  <div className="p-3 rounded-lg bg-red-100 text-red-800 border border-red-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">{errors.role}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id)
                        clearErrors()
                      }}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRole === role.id
                          ? 'border-green-600 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-5xl mb-4 text-center">{role.icon}</div>
                      <h3 className="font-bold text-xl text-gray-800 mb-3 text-center">
                        {role.title}
                      </h3>
                      <p className="text-gray-600 text-sm text-center">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-full transition-colors text-lg"
                  >
                    Précédent
                  </button>
                  {selectedRole === 'consommateur' ? (
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-full transition-colors text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-lg"
                    >
                      Suivant
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Étape 3 - Informations spécifiques */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {selectedRole === 'livreur' && (
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Zone d'intervention</label>
                      <input
                        type="text"
                        name="interventionZone"
                        value={formData.interventionZone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Véhicule</label>
                      <input
                        type="text"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Capacité de charge</label>
                      <input
                        type="text"
                        name="loadCapacity"
                        value={formData.loadCapacity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Permis de conduire</label>
                      <input
                        type="text"
                        name="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'consommateur' && (
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Préférences alimentaires</label>
                      <select
                        name="preferences"
                        value={formData.preferences}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Sélectionnez vos préférences</option>
                        <option value="bio">Produits biologiques uniquement</option>
                        <option value="local">Produits locaux</option>
                        <option value="saisonnier">Produits de saison</option>
                        <option value="sans-gluten">Sans gluten</option>
                        <option value="vegetarien">Végétarien</option>
                        <option value="tous">Tous types de produits</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Biographie (optionnel)</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isSubscribed"
                        name="isSubscribed"
                        checked={formData.isSubscribed}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label htmlFor="isSubscribed" className="text-gray-700">
                        Je souhaite recevoir les offres et nouveautés par email
                      </label>
                    </div>
                  </div>
                )}

                {selectedRole === 'producteur' && (
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Type de culture</label>
                      <input
                        type="text"
                        name="cultureType"
                        value={formData.cultureType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Superficie cultivée</label>
                      <input
                        type="text"
                        name="cultivatedArea"
                        value={formData.cultivatedArea}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Expérience (en années)</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Télécharger un certificat</label>
                      <div className="space-y-2">
                        <label className="cursor-pointer inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                          Choisir un fichier
                          <input 
                            type="file" 
                            name="certificate"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </label>
                        {formData.certificate && (
                          <p className="text-sm text-gray-600 mt-2">{formData.certificate.name}</p>
                        )}
                        <p className="text-xs text-gray-500">Formats acceptés : JPG, PNG. Taille maximale : 5 Mo.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-full transition-colors text-lg"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-full transition-colors text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-green-800 px-8 py-4 rounded-b-lg">
          <p className="text-green-100 text-center text-sm">
            Déjà un compte ?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-300 hover:text-white font-semibold transition-colors underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal
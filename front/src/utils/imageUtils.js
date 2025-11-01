/**
 * Utilitaires pour la gestion des images
 */

/**
 * Convertit un fichier en base64
 * @param {File} file - Le fichier à convertir
 * @returns {Promise<string>} - La représentation base64 du fichier
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * Valide si un fichier est une image valide
 * @param {File} file - Le fichier à valider
 * @returns {boolean} - True si le fichier est une image valide
 */
export const isValidImageFile = (file) => {
  if (!file) return false
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

/**
 * Obtient l'URL de l'image de profil avec fallback
 * @param {string|null} profilePicture - L'URL de la photo de profil
 * @returns {string} - L'URL de l'image ou une URL par défaut
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+$/, '')

export const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) return 'https://via.placeholder.com/150x150?text=Photo'
  // Absolute URL already
  if (/^https?:\/\//i.test(profilePicture)) return profilePicture
  // Data URL (preview/base64)
  if (profilePicture.startsWith('data:')) return profilePicture
  // If already includes /uploads path from backend
  if (profilePicture.startsWith('/uploads')) return `${API_ORIGIN}${profilePicture}`
  if (profilePicture.startsWith('uploads/')) return `${API_ORIGIN}/${profilePicture}`
  // Otherwise assume it's a plain filename stored under /uploads/profiles or /uploads
  return `${API_ORIGIN}/uploads/${profilePicture}`
}

/**
 * Redimensionne une image
 * @param {File} file - Le fichier image
 * @param {number} maxWidth - Largeur maximale
 * @param {number} maxHeight - Hauteur maximale
 * @param {number} quality - Qualité (0.1 à 1.0)
 * @returns {Promise<string>} - L'URL base64 de l'image redimensionnée
 */
export const resizeImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculer les nouvelles dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      // Définir les dimensions du canvas
      canvas.width = width
      canvas.height = height
      
      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convertir en base64
      const base64 = canvas.toDataURL('image/jpeg', quality)
      resolve(base64)
    }
    
    img.src = URL.createObjectURL(file)
  })
}
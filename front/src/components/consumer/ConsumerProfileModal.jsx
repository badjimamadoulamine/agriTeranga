import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'

const ConsumerProfileModal = ({ isOpen, onClose, onUpdated }) => {
  const { user, updateUser } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
    setPhone(user?.phone || '')
    setProfilePicture(null)
    setPreview('')
    setError('')
  }, [isOpen, user])

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setProfilePicture(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview('')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { firstName, lastName, phone }
      if (profilePicture) payload.profilePicture = profilePicture
      const res = await apiService.updateMyProfile(payload)
      const updated = res?.data?.user || { ...user, firstName, lastName, phone }
      if (res?.data?.user?.profilePicture) {
        updated.profilePicture = res.data.user.profilePicture
      }
      updateUser(updated)
      if (onUpdated) onUpdated()
    } catch (err) {
      setError(err?.message || 'Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Modifier mon profil</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {error && (
          <div className="mb-3 rounded bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Prénom</label>
              <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nom</label>
              <input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Téléphone</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Photo de profil</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full" />
            {preview && (
              <img src={preview} alt="Aperçu" className="mt-2 w-20 h-20 rounded-full object-cover" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Annuler</button>
            <button disabled={saving} type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConsumerProfileModal

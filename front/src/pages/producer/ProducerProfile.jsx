import { useState } from 'react'
import ProducerLayout from '../../layouts/ProducerLayout'
import apiService from '../../services/apiService'
import { useAuth } from '../../contexts/AuthContext'

const ProducerProfile = () => {
  const { user, updateUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [profilePicture, setProfilePicture] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        firstName,
        lastName,
        phone,
      }
      if (profilePicture) payload.profilePicture = profilePicture
      const res = await apiService.updateMyProfile(payload)
      if (res?.status === 'success' && res.data?.user) {
        updateUser(res.data.user)
        setSuccess('Profil mis à jour avec succès')
      } else {
        setSuccess('Profil mis à jour')
      }
    } catch (err) {
      setError(err?.message || 'Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProducerLayout pageTitle="Mon profil" pageSubtitle="Mettre à jour vos informations">
      <div className="max-w-2xl">
        {error && <div className="mb-4 rounded bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>}
        {success && <div className="mb-4 rounded bg-green-50 text-green-700 px-4 py-2 text-sm">{success}</div>}
        <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
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
            <input type="file" accept="image/*" onChange={(e)=>setProfilePicture(e.target.files?.[0]||null)} className="w-full" />
          </div>
          <div className="flex justify-end">
            <button disabled={saving} type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </ProducerLayout>
  )
}

export default ProducerProfile

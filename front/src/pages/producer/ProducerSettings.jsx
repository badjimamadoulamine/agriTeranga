import { useState } from 'react'
import ProducerLayout from '../../layouts/ProducerLayout'
import apiService from '../../services/apiService'

const ProducerSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs')
      return false
    }
    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('La confirmation ne correspond pas au nouveau mot de passe')
      return false
    }
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validate()) return
    setSaving(true)
    try {
      const res = await apiService.changeMyPassword(currentPassword, newPassword, confirmPassword)
      if (res?.status === 'success') {
        setSuccess('Mot de passe modifié avec succès')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setSuccess('Mot de passe mis à jour')
      }
    } catch (err) {
      setError(err?.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProducerLayout pageTitle="Paramètres" pageSubtitle="Sécurité du compte">
      <div className="max-w-lg">
        {error && <div className="mb-4 rounded bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>}
        {success && <div className="mb-4 rounded bg-green-50 text-green-700 px-4 py-2 text-sm">{success}</div>}
        <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Ancien mot de passe</label>
            <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nouveau mot de passe</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex justify-end">
            <button disabled={saving} type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Validation...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </ProducerLayout>
  )
}

export default ProducerSettings

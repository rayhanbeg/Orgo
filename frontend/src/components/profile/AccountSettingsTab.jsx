import { useState } from 'react'
import userService from '../../services/userService'

function AccountSettingsTab({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      await userService.updateProfile(formData)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      onUpdate?.()
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="metric-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="metric-card-label text-base">ACCOUNT INFORMATION</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[var(--color-primary)] font-semibold text-sm hover:underline"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--color-danger-light)] border border-[var(--color-danger)] rounded-lg text-[var(--color-danger)] text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-[var(--color-success-light)] border border-[var(--color-success)] rounded-lg text-[var(--color-success)] text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input disabled:bg-[var(--color-background)] disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input disabled:bg-[var(--color-background)] disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input disabled:bg-[var(--color-background)] disabled:cursor-not-allowed"
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                  })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Password Change Section */}
      <div className="metric-card">
        <h2 className="metric-card-label text-base mb-6">CHANGE PASSWORD</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">
          For security reasons, you can change your password here.
        </p>
        <button className="btn-secondary">
          Change Password
        </button>
      </div>
    </div>
  )
}

export default AccountSettingsTab

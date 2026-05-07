import { useState, useEffect } from 'react'
import userService from '../../services/userService'

function AddressesTab({ user }) {
  const [addresses, setAddresses] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true)
        // Fetch from user profile or dedicated addresses endpoint
        const response = await userService.getUserProfile()
        setAddresses(response.addresses || [])
      } catch (err) {
        console.error('Failed to load addresses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Add or update address logic
      if (editingId) {
        // Update existing address
        await userService.updateAddress(editingId, formData)
      } else {
        // Add new address
        await userService.addAddress(formData)
      }
      
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
      })
      setIsAdding(false)
      setEditingId(null)
      
      // Refresh addresses
      const response = await userService.getUserProfile()
      setAddresses(response.addresses || [])
    } catch (err) {
      console.error('Failed to save address:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (addressId) => {
    if (!window.confirm('Delete this address?')) return
    try {
      setLoading(true)
      await userService.deleteAddress(addressId)
      setAddresses(addresses.filter(a => a._id !== addressId))
    } catch (err) {
      console.error('Failed to delete address:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address) => {
    setFormData(address)
    setEditingId(address._id)
    setIsAdding(true)
  }

  return (
    <div className="space-y-6">
      {/* Address List */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="metric-card-label text-base">SAVED ADDRESSES</h2>
          {!isAdding && (
            <button
              onClick={() => {
                setIsAdding(true)
                setEditingId(null)
              }}
              className="text-[var(--color-primary)] font-semibold text-sm hover:underline"
            >
              ➕ Add Address
            </button>
          )}
        </div>

        {addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="border border-[var(--color-border)] rounded-lg p-4 hover:bg-[var(--color-primary-light)] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--color-text)]">
                        {address.firstName} {address.lastName}
                      </h3>
                      {address.isDefault && (
                        <span className="status-badge delivered">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-text)]">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-sm text-[var(--color-text)]">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {address.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-sm px-3 py-1 border border-[var(--color-border)] rounded hover:bg-[var(--color-background)] transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-sm px-3 py-1 border border-[var(--color-danger-light)] text-[var(--color-danger)] rounded hover:bg-[var(--color-danger-light)] transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-text-muted)]">No addresses saved yet</p>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="metric-card">
          <h2 className="metric-card-label text-base mb-6">
            {editingId ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="isDefault" className="text-sm text-[var(--color-text)]">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AddressesTab

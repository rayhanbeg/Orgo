import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from '../redux/slices/uiSlice'
import { loginSuccess } from '../redux/slices/authSlice'
import userService from '../services/userService'

function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const addressData = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }

      const result = await userService.updateProfile(formData.name, formData.phone, addressData)
      dispatch(loginSuccess(result))
      dispatch(addNotification({ type: 'success', message: 'Profile updated successfully!' }))
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error.response?.data?.message || 'Failed to update profile',
        })
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      )
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      dispatch(addNotification({ type: 'success', message: 'Password changed successfully!' }))
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error.response?.data?.message || 'Failed to change password',
        })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-dark mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-3 text-center font-semibold transition ${
                activeTab === 'profile'
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 text-dark hover:bg-gray-100'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-3 text-center font-semibold transition ${
                activeTab === 'password'
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 text-dark hover:bg-gray-100'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-dark font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-dark mt-6">Shipping Address</h3>

                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleProfileChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleProfileChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleProfileChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleProfileChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-dark font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

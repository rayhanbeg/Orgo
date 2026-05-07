import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { addNotification } from '../redux/slices/uiSlice'
import { loginSuccess } from '../redux/slices/authSlice'
import userService from '../services/userService'
import orderService from '../services/orderService'

const VALID_TABS = ['orders', 'account', 'addresses', 'payment']

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const initialTab = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState(() => (
    VALID_TABS.includes(initialTab) ? initialTab : 'orders'
  ))
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (searchParams.get('tab') !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [activeTab, searchParams, setSearchParams])

  const fetchOrders = async () => {
    await Promise.resolve()
    setOrdersLoading(true)
    try {
      const data = await orderService.getUserOrders()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await userService.logout()
      dispatch(loginSuccess(null))
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      dispatch(addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile',
      }))
    } finally {
      setLoading(false)
    }
  }


  const setTab = (tab) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    if (activeTab === 'orders') {
      const timer = setTimeout(() => {
        void fetchOrders()
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-white">
      <div className="container-fluid py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h1 className="mb-8 text-3xl font-bold text-neutral-950">My Account</h1>

            <nav className="space-y-2">
              <button
                onClick={() => setTab('orders')}
                className={`w-full px-4 py-3 text-left font-medium transition ${
                  activeTab === 'orders'
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setTab('account')}
                className={`w-full px-4 py-3 text-left font-medium transition ${
                  activeTab === 'account'
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                Account Details
              </button>
              <button
                onClick={() => setTab('addresses')}
                className={`w-full px-4 py-3 text-left font-medium transition ${
                  activeTab === 'addresses'
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setTab('payment')}
                className={`w-full px-4 py-3 text-left font-medium transition ${
                  activeTab === 'payment'
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                Payment Methods
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left font-medium text-red-600 transition hover:text-red-700"
              >
                Log Out
              </button>
            </nav>
          </div>

          <div className="md:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h2 className="mb-1 text-2xl font-bold text-neutral-950">Order History</h2>
                <p className="mb-8 text-neutral-600">View and manage your recent orders.</p>

                {ordersLoading ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#2d7c5f]" />
                    <p className="text-sm text-neutral-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 py-12 text-center">
                    <p className="text-sm text-neutral-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="rounded-lg border border-neutral-200 p-6">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-neutral-950">
                              Order #{order._id?.slice(-5).toUpperCase()}
                            </h3>
                            <p className="mt-1 text-sm text-neutral-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                order.orderStatus?.toLowerCase() === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.orderStatus?.toLowerCase() === 'processing'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                            </span>
                            <p className="mt-2 text-lg font-bold text-neutral-950">
                              ৳{order.totalAmount?.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <p className="mb-4 text-sm text-neutral-600">
                          {order.items?.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                        </p>

                        <button className="text-sm font-medium text-[#2d7c5f] hover:underline">
                          View Order Details →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <form onSubmit={handleSaveProfile} className="space-y-8">
                <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
                  <h2 className="mb-6 text-lg font-semibold text-neutral-950">Personal Information</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
                  <h2 className="mb-6 text-lg font-semibold text-neutral-950">Shipping Address</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={handleProfileChange}
                      className="form-input"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="mb-8 text-2xl font-bold text-neutral-950">Addresses</h2>
                <p className="mb-8 text-neutral-600">Manage your saved addresses.</p>
                <p className="text-sm text-neutral-600">No saved addresses yet.</p>
              </div>
            )}

            {activeTab === 'payment' && (
              <div>
                <h2 className="mb-8 text-2xl font-bold text-neutral-950">Payment Methods</h2>
                <p className="mb-8 text-neutral-600">Manage your payment methods.</p>
                <p className="text-sm text-neutral-600">No saved payment methods yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

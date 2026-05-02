import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlice'
import { addNotification } from '../redux/slices/uiSlice'
import orderService from '../services/orderService'

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.address?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    paymentMethod: 'cod',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (items.length === 0) {
      dispatch(addNotification({ type: 'error', message: 'Your cart is empty' }))
      return
    }

    setLoading(true)

    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }

      const result = await orderService.createOrder(items, shippingAddress, formData.paymentMethod)

      dispatch(clearCart())
      dispatch(addNotification({ type: 'success', message: 'Order placed successfully!' }))
      navigate(`/order-success/${result.orderId || 'ORD-' + Date.now()}`)
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error.response?.data?.message || 'Order creation failed',
        })
      )
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">CHECKOUT</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-black mb-8">CHECKOUT</h1>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact Section */}
              <div>
                <h2 className="text-xs font-bold text-black mb-6 tracking-wide">CONTACT</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="news"
                    className="w-4 h-4 accent-black"
                  />
                  <label htmlFor="news" className="ml-3 text-sm text-black">
                    Email me with news and offers
                  </label>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div>
                <h2 className="text-xs font-bold text-black mb-6 tracking-wide">SHIPPING ADDRESS</h2>
                
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-600 tracking-wide">COUNTRY / REGION</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country / Region"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="form-input mt-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 tracking-wide">FIRST NAME</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-input mt-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 tracking-wide">LAST NAME</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-input mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-600 tracking-wide">ADDRESS</label>
                  <input
                    type="text"
                    name="street"
                    placeholder="Address"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="form-input mt-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-600 tracking-wide">APARTMENT, SUITE, ETC. (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="form-input mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 tracking-wide">CITY</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input mt-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 tracking-wide">POSTAL CODE</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Postal code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="form-input mt-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-8 pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-xs font-bold text-gray-600 hover:text-black transition tracking-wide"
                >
                  ← RETURN TO CART
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'CONTINUE TO SHIPPING'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-8 sticky top-20">
              <h2 className="text-lg font-bold text-black mb-6">PRODUCT</h2>
              <div className="space-y-6 mb-8 pb-8 border-b border-gray-200 max-h-80 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.weight || '100g'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-black">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated at next step</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-black">TOTAL</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">USD </span>
                    <span className="text-3xl font-bold text-black">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

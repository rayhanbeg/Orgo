import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlice'
import { addNotification } from '../redux/slices/uiSlice'
import orderService from '../services/orderService'

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
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

  const isInsideDhaka = formData.city.trim().toLowerCase() === 'dhaka'
  const deliveryCharge = isInsideDhaka ? 70 : 120

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
      navigate(`/order-success/${result.orderId || result.order?._id || 'ORD-' + Date.now()}`, {
        state: { order: result.order || null },
      })
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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-950 mb-4">Your cart is empty</h1>
          <p className="text-neutral-600 mb-8">Add a product before checking out.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container-fluid py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">Contact Information</h2>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">Shipping Address</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Placeholder"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Placeholder"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Placeholder"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      placeholder="Placeholder"
                      className="form-input"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Placeholder"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Placeholder"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">ZIP</label>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Placeholder"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">Payment</h2>
                <div className="border border-neutral-200 rounded-lg p-6 bg-neutral-50">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="cod" className="cursor-pointer flex-1">
                      <div className="font-semibold text-neutral-950">Cash on Delivery (COD)</div>
                      <div className="text-sm text-neutral-600 mt-1">Pay when your order arrives</div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn-text"
                >
                  ← Return to cart
                </button>
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50 ml-auto">
                  {loading ? 'Processing...' : 'Complete Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-lg p-8 sticky top-24">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 pb-6 border-b border-neutral-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded bg-neutral-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 text-sm">{item.name}</h3>
                      <p className="text-xs text-neutral-600">Standard</p>
                      <p className="font-semibold text-neutral-950 text-sm mt-2">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-700">Delivery charge</span>
                  <span className="text-neutral-700">৳{deliveryCharge.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Total</span>
                  <span className="text-2xl font-bold text-neutral-950">
                    ৳{(totalPrice + deliveryCharge).toFixed(2)}
                  </span>
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

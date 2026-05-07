import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import orderService from '../services/orderService'

function OrderSuccess() {
  const params = useParams()
  const orderId = params.orderId || params.id
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || order) {
        setLoading(false)
        return
      }

      try {
        const data = await orderService.getOrderById(orderId)
        setOrder(data.order)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, order])

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/products" className="btn-primary">
            BACK TO SHOP
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-4">Order not found</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    )
  }

  const contactEmail = order.shippingAddress?.email || user?.email || 'your email'
  const orderTotal = order.totalAmount ?? order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0
  const status = order.orderStatus || 'pending'
  const statusTimeline = [
    { label: 'Order Confirmed', complete: true },
    { label: 'Processing', complete: ['processing', 'shipped', 'delivered'].includes(status) },
    { label: 'Shipped', complete: ['shipped', 'delivered'].includes(status) },
    { label: 'Delivered', complete: status === 'delivered' },
  ]

  return (
    <div className="bg-white min-h-screen">
      <div className="container-fluid py-20">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">ORDER CONFIRMED</h1>
          <p className="text-gray-600 mb-2">
            Order <span className="font-bold text-black">#{order._id?.slice(-8).toUpperCase()}</span> is now {status}.
          </p>
          <p className="text-gray-600">
            A confirmation email was sent to <span className="font-bold text-black">{contactEmail}</span>.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-black mb-8">ORDER STATUS</h2>
          <div className="space-y-6">
            {statusTimeline.map((step, idx) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${step.complete ? 'bg-black' : 'bg-gray-300'}`}></div>
                  {idx < statusTimeline.length - 1 && (
                    <div className={`w-0.5 h-12 ${step.complete ? 'bg-black' : 'bg-gray-300'}`}></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-black">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
          <button
            onClick={() => navigate(user ? '/orders' : '/products')}
            className="btn-primary flex-1 text-center"
          >
            {user ? 'VIEW ORDERS' : 'CONTINUE SHOPPING'}
          </button>
          <Link to="/products" className="btn-secondary flex-1 text-center">
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className="max-w-2xl mx-auto mt-12 pt-12 border-t border-gray-200">
          <h3 className="text-lg font-bold text-black mb-6">ORDER SUMMARY</h3>
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            {order.items?.map((item, idx) => (
              <div key={`${item.productId || idx}`} className="flex justify-between gap-4">
                <span className="text-gray-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold text-black">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-lg font-bold text-black">
            <span>Total</span>
            <span>৳{orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import orderService from '../../services/orderService'
import OrderDetailsPanel from './OrderDetailsPanel'

function OrderHistoryTab() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await orderService.getUserOrders()
        setOrders(response.orders || [])
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      delivered: 'status-badge delivered',
      processing: 'status-badge processing',
      pending: 'status-badge pending',
      shipped: 'status-badge shipped',
      cancelled: 'status-badge cancelled',
    }
    return statusMap[status?.toLowerCase()] || 'status-badge pending'
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.orderStatus?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="metric-card">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h2 className="metric-card-label text-base">YOUR ORDERS</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-[var(--color-border)] rounded text-sm bg-[var(--color-card-bg)] text-[var(--color-text)]"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-[var(--color-danger-light)] border border-[var(--color-danger)] rounded-lg text-[var(--color-danger)] text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-muted)]">Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderDetailsPanel key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-muted)]">No orders found</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary mt-4"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistoryTab

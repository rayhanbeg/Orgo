import { useNavigate } from 'react-router-dom'

function RecentOrdersCard({ orders = [], onViewAll }) {
  const navigate = useNavigate()

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

  return (
    <div className="metric-card">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="metric-card-label text-base">RECENT ORDERS</h2>
        <button
          onClick={onViewAll}
          className="text-sm font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="max-h-80 space-y-4 overflow-y-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex cursor-pointer items-start justify-between rounded-lg border-b border-[var(--color-border-light)] px-2 py-2 transition hover:bg-[var(--color-primary-light)] last:border-0"
              onClick={() => navigate('/admin?tab=orders')}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  #{order._id?.slice(-6).toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {order.shippingAddress?.firstName || 'Guest'} {order.shippingAddress?.lastName || ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  ৳{Number(order.totalAmount || 0).toFixed(2)}
                </p>
                <p className={`mt-1 text-xs ${getStatusBadgeClass(order.orderStatus)}`}>
                  {(order.orderStatus || 'pending').toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)]">No orders yet</p>
      )}
    </div>
  )
}

export default RecentOrdersCard

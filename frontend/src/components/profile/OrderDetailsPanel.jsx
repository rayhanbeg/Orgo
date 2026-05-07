import { useState } from 'react'
import { ChevronDownIcon } from '../common/Icons'

function OrderDetailsPanel({ order }) {
  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-background)] transition"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[var(--color-text)]">
              Order #{order._id?.slice(-6).toUpperCase()}
            </h3>
            <span className={getStatusBadgeClass(order.orderStatus)}>
              {order.orderStatus?.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} • ৳{Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-background)]">
          {/* Shipping Address */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
              Shipping Address
            </h4>
            <div className="space-y-1 text-sm text-[var(--color-text)]">
              <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
              Items
            </h4>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded border border-[var(--color-border)]">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">{item.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      ৳{Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span>৳{Number((order.totalAmount || 0) * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                <span>Tax</span>
                <span>৳{Number((order.totalAmount || 0) * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[var(--color-text)] border-t border-[var(--color-border)] pt-2">
                <span>Total</span>
                <span>৳{Number(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsPanel

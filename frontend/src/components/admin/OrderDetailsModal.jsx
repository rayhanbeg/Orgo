import { useState } from 'react'
import Modal from 'react-modal'
import { X, Loader } from 'lucide-react'

function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true)
    try {
      await onStatusChange(order._id, newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#a855f7',
      delivered: '#10b981',
      cancelled: '#ef4444',
    }
    return colorMap[status?.toLowerCase()] || '#6b7280'
  }

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      contentLabel={`Order #${order._id?.slice(-6).toUpperCase()}`}
      ariaHideApp={false}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Order #{order._id?.slice(-6).toUpperCase()}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadgeClass(order.orderStatus)}`}>
              {order.orderStatus?.toUpperCase()}
            </span>
            <span className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Customer Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-600">Name</p>
              <p className="mt-1 text-gray-900">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-600">Email</p>
              <p className="mt-1 text-gray-900">{order.shippingAddress?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-600">Phone</p>
              <p className="mt-1 text-gray-900">{order.shippingAddress?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-600">User ID</p>
              <p className="mt-1 font-mono text-sm text-gray-900">{order.userId?.slice(-8) || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h3>
          <div className="space-y-2 text-gray-900">
            <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">৳{Number(item.price || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    Subtotal: ৳{Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>৳{Number((order.totalAmount || 0) * 0.85).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>৳{Number((order.totalAmount || 0) * 0.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>৳{Number(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Update Status</h3>
          <div className="flex items-center gap-2">
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {isUpdating && (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default OrderDetailsModal

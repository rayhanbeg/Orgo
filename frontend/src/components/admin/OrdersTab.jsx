import AdminTable from './AdminTable'

function OrdersTab({
  orders,
  filterOrderStatus,
  sortOrdersBy,
  onFilterChange,
  onSortChange,
  onViewDetails,
  onStatusChange,
  savingOrderId,
}) {
  const getSortedOrders = () => {
    let filtered = orders
    if (filterOrderStatus !== 'all') {
      filtered = orders.filter((o) => o.orderStatus === filterOrderStatus)
    }

    const sorted = [...filtered]
    if (sortOrdersBy === 'date-desc') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortOrdersBy === 'date-asc') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortOrdersBy === 'amount-desc') {
      sorted.sort((a, b) => b.totalAmount - a.totalAmount)
    } else if (sortOrdersBy === 'amount-asc') {
      sorted.sort((a, b) => a.totalAmount - b.totalAmount)
    }
    return sorted
  }

  const orderColumns = [
    { key: '_id', label: 'ORDER', render: (val) => val?.slice(-6).toUpperCase() || 'N/A' },
    {
      key: 'shippingAddress',
      label: 'CUSTOMER',
      render: (val) => `${val?.firstName || 'Guest'} ${val?.lastName || ''}`.trim() || 'Guest',
    },
    { key: 'totalAmount', label: 'AMOUNT', render: (val) => `৳${Number(val || 0).toFixed(2)}` },
    {
      key: 'orderStatus',
      label: 'STATUS',
      render: (val) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          processing: 'bg-blue-100 text-blue-800',
          shipped: 'bg-purple-100 text-purple-800',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
        }

        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusColors[val?.toLowerCase()] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {val || 'PENDING'}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
      <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">ORDERS</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={filterOrderStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sortOrdersBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
        <AdminTable
          columns={orderColumns}
          data={getSortedOrders()}
          actions={(order) => (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onViewDetails(order)}
                className="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
              >
                DETAILS
              </button>
              <select
                defaultValue={order.orderStatus}
                className="rounded border border-[var(--color-border)] bg-[var(--color-card-bg)] px-2 py-1 text-sm text-[var(--color-text)]"
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                disabled={savingOrderId === order._id}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default OrdersTab

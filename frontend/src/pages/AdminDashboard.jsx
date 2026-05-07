import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import adminService from '../services/adminService'
import orderService from '../services/orderService'
import productService from '../services/productService'
import MetricCard from '../components/admin/MetricCard'
import SimpleChart from '../components/admin/SimpleChart'
import AdminTable from '../components/admin/AdminTable'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import RecentOrdersCard from '../components/admin/RecentOrdersCard'
import OrderDetailsModal from '../components/admin/OrderDetailsModal'
import {
  ChartIcon,
  MoneyIcon,
  OrdersIcon,
  ProductsIcon,
} from '../components/common/Icons'

const VALID_TABS = ['overview', 'orders', 'products', 'customers', 'settings']

function AdminDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')

  const [stats, setStats] = useState(null)
  const [orderStats, setOrderStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(() => (
    VALID_TABS.includes(initialTab) ? initialTab : 'overview'
  ))
  const [savingOrderId, setSavingOrderId] = useState(null)
  const [sortOrdersBy, setSortOrdersBy] = useState('date-desc')
  const [sortProductsBy, setSortProductsBy] = useState('name')
  const [filterOrderStatus, setFilterOrderStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const [dashboard, orderSummary, productList, orderList] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getOrderStats(),
        productService.getAllProducts(),
        orderService.getAllOrders(),
      ])

      setStats(dashboard)
      setOrderStats(orderSummary)
      setProducts(productList.products || [])
      setOrders(orderList.orders || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchData()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (searchParams.get('tab') !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [activeTab])

  const monthlyData = useMemo(() => orderStats?.ordersByMonth || [], [orderStats])
  const chartData = useMemo(() => monthlyData.map((m) => m.totalAmount || 0).slice(-12), [monthlyData])
  const chartLabels = useMemo(() => monthlyData.map((m) => m._id?.slice(5) || '').slice(-12), [monthlyData])

  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    try {
      setSavingOrderId(orderId)
      await orderService.updateOrderStatus(orderId, orderStatus)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status')
    } finally {
      setSavingOrderId(null)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productService.deleteProduct(productId)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product')
    }
  }

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleModalStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus)
      await loadData()
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status')
    }
  }

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

  const getSortedProducts = () => {
    const sorted = [...products]
    if (sortProductsBy === 'name') {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortProductsBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortProductsBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortProductsBy === 'stock-asc') {
      sorted.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    } else if (sortProductsBy === 'stock-desc') {
      sorted.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0))
    }
    return sorted
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md px-6 text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button onClick={loadData} className="btn-primary">
            RETRY
          </button>
        </div>
      </div>
    )
  }

  if (loading || !stats || !orderStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const recentOrders = stats?.recentOrders || []
  const totalStats = stats?.stats || {}

  const productColumns = [
    { key: 'name', label: 'PRODUCT', render: (val) => val || 'N/A' },
    { key: 'price', label: 'PRICE', render: (val) => `৳${Number(val || 0).toFixed(2)}` },
    { key: 'category', label: 'CATEGORY', render: (val) => val || 'Uncategorized' },
    { key: 'stock', label: 'STOCK', render: (val) => val ?? 0 },
  ]

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
    <div className="min-h-screen bg-[#faf9f7] lg:pl-64">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        productsCount={products.length}
      />

      <div className="min-h-screen bg-[#faf9f7]">
        <AdminHeader
          title={
            activeTab === 'overview' ? 'DASHBOARD OVERVIEW'
              : activeTab === 'orders' ? 'ORDERS'
                : activeTab === 'products' ? 'PRODUCTS'
                  : activeTab === 'customers' ? 'CUSTOMERS'
                    : 'ANALYTICS'
          }
          actionButton={activeTab === 'products' ? { label: 'Add Product', onClick: () => navigate('/admin/products/new') } : null}
          onRefresh={loadData}
          isLoading={loading}
        />

        {error && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 sm:mx-6 lg:mx-8">
            {error}
            <button onClick={loadData} className="ml-4 font-semibold underline">
              Retry
            </button>
          </div>
        )}

        {loading || !stats || !orderStats ? (
          <div className="flex min-h-[24rem] items-center justify-center bg-[#faf9f7]">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e5ddd2] border-t-[#2d7c5f]" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-8 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    title="TOTAL REVENUE"
                    value={`৳${Number(totalStats.totalRevenue || 0).toFixed(2)}`}
                    trend="Total earnings"
                    trendDirection="up"
                    trendPercent={12}
                    icon={<MoneyIcon className="h-10 w-10" />}
                  />
                  <MetricCard
                    title="ORDERS TODAY"
                    value={totalStats.totalOrders || 0}
                    trend="Orders placed today"
                    trendDirection="up"
                    trendPercent={8}
                    icon={<OrdersIcon className="h-10 w-10" />}
                  />
                  <MetricCard
                    title="AVERAGE ORDER"
                    value={`৳${Number((totalStats.totalRevenue || 0) / (totalStats.totalOrders || 1)).toFixed(2)}`}
                    trend="Average order value"
                    trendDirection="up"
                    trendPercent={2}
                    icon={<ChartIcon className="h-10 w-10" />}
                  />
                  <MetricCard
                    title="ACTIVE MENU ITEMS"
                    value={totalStats.totalProducts || 0}
                    trend="Active food items"
                    trendDirection="up"
                    trendPercent={0}
                    icon={<ProductsIcon className="h-10 w-10" />}
                  />
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <SimpleChart data={chartData} labels={chartLabels} title="REVENUE BY MONTH" />
                  </div>
                  <RecentOrdersCard
                    orders={recentOrders}
                    onViewAll={() => setActiveTab('orders')}
                  />
                </div>

                <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
                  <h2 className="mb-6 text-xs font-bold uppercase tracking-wide text-gray-900">
                    RECENT ORDERS
                  </h2>
                  <AdminTable
                    columns={[
                      { key: '_id', label: 'ORDER ID', render: (val) => `#${val?.slice(-5).toUpperCase() || 'N/A'}` },
                      {
                        key: 'shippingAddress',
                        label: 'CUSTOMER',
                        render: (val) => `${val?.firstName || 'Guest'} ${val?.lastName || ''}`.trim() || 'Guest',
                      },
                      { key: 'totalAmount', label: 'AMOUNT', render: (val) => `৳${Number(val || 0).toFixed(2)}` },
                      { key: 'orderStatus', label: 'STATUS', render: (val) => val || 'Pending' },
                      { key: 'createdAt', label: 'DATE', render: (val) => new Date(val).toLocaleDateString() },
                    ]}
                    data={recentOrders}
                  />
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">RECENT ORDERS</h2>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select
                        value={filterOrderStatus}
                        onChange={(e) => setFilterOrderStatus(e.target.value)}
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
                        onChange={(e) => setSortOrdersBy(e.target.value)}
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
                          onClick={() => handleViewOrderDetails(order)}
                          className="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
                        >
                          DETAILS
                        </button>
                        <select
                          defaultValue={order.orderStatus}
                          className="rounded border border-[var(--color-border)] bg-[var(--color-card-bg)] px-2 py-1 text-sm text-[var(--color-text)]"
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
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
            )}

            {activeTab === 'products' && (
              <div className="space-y-6 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">PRODUCTS</h2>
                    <select
                      value={sortProductsBy}
                      onChange={(e) => setSortProductsBy(e.target.value)}
                      className="rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="stock-asc">Stock: Low to High</option>
                      <option value="stock-desc">Stock: High to Low</option>
                    </select>
                  </div>
                  <AdminTable
                    columns={productColumns}
                    data={getSortedProducts()}
                    actions={(product) => (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                          className="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="rounded border border-[var(--color-danger-light)] px-3 py-1 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                        >
                          DELETE
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="rounded-lg border border-[#e5ddd2] bg-white p-6">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">CUSTOMERS</h2>
                  <p className="mt-6 text-sm text-gray-600">Customer management coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="rounded-lg border border-[#e5ddd2] bg-white p-6">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">ANALYTICS</h2>
                  <p className="mt-6 text-sm text-gray-600">Analytics coming soon...</p>
                </div>
              </div>
            )}
          </>
        )}

        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleModalStatusChange}
        />
      </div>
    </div>
  )
}

export default AdminDashboard

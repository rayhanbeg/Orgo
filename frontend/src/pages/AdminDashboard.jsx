import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import adminService from '../services/adminService'
import categoryService from '../services/categoryService'
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

const VALID_TABS = ['overview', 'orders', 'products', 'categories', 'customers', 'settings']

const emptyCategoryForm = {
  key: '',
  name: '',
  description: '',
  sortOrder: 0,
  subcategories: '',
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')

  const [stats, setStats] = useState(null)
  const [orderStats, setOrderStats] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(() => (
    VALID_TABS.includes(initialTab) ? initialTab : 'overview'
  ))
  const [savingOrderId, setSavingOrderId] = useState(null)
  const [sortOrdersBy, setSortOrdersBy] = useState('date-desc')
  const [sortProductsBy, setSortProductsBy] = useState('name')
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [savingCategory, setSavingCategory] = useState(false)
  const [filterOrderStatus, setFilterOrderStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const [dashboard, orderSummary, productList, orderList, categoryList] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getOrderStats(),
        productService.getAllProducts(),
        orderService.getAllOrders(),
        categoryService.getCategories(),
      ])

      setStats(dashboard)
      setOrderStats(orderSummary)
      setProducts(productList.products || [])
      setOrders(orderList.orders || [])
      setCategories(categoryList.categories || [])
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

  const refreshCategories = async () => {
    const categoryList = await categoryService.getCategories()
    setCategories(categoryList.categories || [])
    setError(null)
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

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategoryForm)
    setEditingCategoryId(null)
  }

  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id)
    setCategoryForm({
      key: category.key || '',
      name: category.name || '',
      description: category.description || '',
      sortOrder: category.sortOrder ?? 0,
      subcategories: Array.isArray(category.subcategories) ? category.subcategories.join(', ') : '',
    })
    setActiveTab('categories')
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()

    try {
      setSavingCategory(true)
      const payload = {
        key: categoryForm.key,
        name: categoryForm.name,
        description: categoryForm.description,
        sortOrder: Number(categoryForm.sortOrder) || 0,
        subcategories: categoryForm.subcategories,
      }

      if (editingCategoryId) {
        await categoryService.updateCategory(editingCategoryId, payload)
      } else {
        await categoryService.createCategory(payload)
      }

      resetCategoryForm()
      await refreshCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category')
    } finally {
      setSavingCategory(false)
    }
  }

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return

    try {
      setSavingCategory(true)
      await categoryService.deleteCategory(category._id)
      if (editingCategoryId === category._id) {
        resetCategoryForm()
      }
      await refreshCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category')
    } finally {
      setSavingCategory(false)
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
    {
      key: 'category',
      label: 'CATEGORY',
      render: (val, row) => {
        const categoryLabel = categories.find((category) => category.key === val)?.name || val || 'Uncategorized'
        const subcategoryLabel = row?.subcategory ? ` / ${row.subcategory}` : ''
        return `${categoryLabel}${subcategoryLabel}`
      },
    },
    { key: 'stock', label: 'STOCK', render: (val) => val ?? 0 },
  ]

  const categoryColumns = [
    { key: 'name', label: 'CATEGORY', render: (val, row) => val || row?.key || 'N/A' },
    { key: 'key', label: 'KEY', render: (val) => val || 'N/A' },
    { key: 'sortOrder', label: 'SORT', render: (val) => val ?? 0 },
    {
      key: 'subcategories',
      label: 'SUBCATEGORIES',
      render: (val) => (Array.isArray(val) && val.length > 0 ? val.join(', ') : 'None'),
    },
    { key: 'productCount', label: 'PRODUCTS', render: (val) => val ?? 0 },
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
                  : activeTab === 'categories' ? 'CATEGORIES'
                  : activeTab === 'customers' ? 'CUSTOMERS'
                    : 'ANALYTICS'
          }
          actionButton={
            activeTab === 'products'
              ? { label: 'Add Product', onClick: () => navigate('/admin/products/new') }
              : activeTab === 'categories'
                ? { label: 'Add Category', onClick: resetCategoryForm }
                : null
          }
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

            {activeTab === 'categories' && (
              <div className="space-y-6 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
                <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                  <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
                    <div className="mb-5">
                      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">
                        {editingCategoryId ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        Manage category names, ordering, and subcategory options from one place.
                      </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleCategorySubmit}>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Key
                        </label>
                        <input
                          name="key"
                          value={categoryForm.key}
                          onChange={handleCategoryChange}
                          className="w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#2d7c5f] focus:outline-none disabled:bg-gray-50"
                          placeholder="organic-snacks"
                          disabled={Boolean(editingCategoryId)}
                          required={!editingCategoryId}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          The key is what products use internally. Keep it stable after products are assigned.
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Name
                        </label>
                        <input
                          name="name"
                          value={categoryForm.name}
                          onChange={handleCategoryChange}
                          className="w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
                          placeholder="Organic Snacks"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Sort Order
                        </label>
                        <input
                          name="sortOrder"
                          value={categoryForm.sortOrder}
                          onChange={handleCategoryChange}
                          type="number"
                          className="w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Subcategories
                        </label>
                        <textarea
                          name="subcategories"
                          value={categoryForm.subcategories}
                          onChange={handleCategoryChange}
                          className="min-h-28 w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
                          placeholder="Citrus, Berries, Tropical"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={categoryForm.description}
                          onChange={handleCategoryChange}
                          className="min-h-28 w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
                          placeholder="Short category description"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={savingCategory}
                          className="rounded bg-[#2d7c5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#235844]"
                        >
                          {savingCategory ? 'Saving...' : editingCategoryId ? 'Save Category' : 'Create Category'}
                        </button>
                        <button
                          type="button"
                          onClick={resetCategoryForm}
                          disabled={savingCategory}
                          className="rounded border border-[#e5ddd2] px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-[#f5f2ed]"
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">
                          CATEGORIES
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Categories are sorted by sortOrder, then by name.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        disabled={savingCategory}
                        className="rounded border border-[#e5ddd2] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-[#f5f2ed]"
                      >
                        New Category
                      </button>
                    </div>
                    <AdminTable
                      columns={categoryColumns}
                      data={categories}
                      actions={(category) => (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                            className="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category)}
                            className="rounded border border-[var(--color-danger-light)] px-3 py-1 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
                          >
                            DELETE
                          </button>
                        </div>
                      )}
                    />
                  </div>
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

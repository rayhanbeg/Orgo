import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import adminService from '../services/adminService'
import categoryService from '../services/categoryService'
import orderService from '../services/orderService'
import productService from '../services/productService'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import OrderDetailsModal from '../components/admin/OrderDetailsModal'
import OverviewTab from '../components/admin/OverviewTab'
import OrdersTab from '../components/admin/OrdersTab'
import ProductsTab from '../components/admin/ProductsTab'
import CategoriesTab from '../components/admin/CategoriesTab'
import CustomersTab from '../components/admin/CustomersTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'

const VALID_TABS = ['overview', 'orders', 'products', 'categories', 'customers', 'analytics']

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
  const [savingCategory, setSavingCategory] = useState(false)
  const [filterOrderStatus, setFilterOrderStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

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

  const handleCategorySave = async (categoryForm, editingCategoryId) => {
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

      await refreshCategories()
      setIsCategoryModalOpen(false)
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
                ? { label: 'Add Category', onClick: () => { setEditingCategory(null); setIsCategoryModalOpen(true) } }
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
              <OverviewTab
                totalStats={totalStats}
                monthlyData={monthlyData}
                recentOrders={recentOrders}
                onViewOrders={() => setActiveTab('orders')}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                filterOrderStatus={filterOrderStatus}
                sortOrdersBy={sortOrdersBy}
                onFilterChange={setFilterOrderStatus}
                onSortChange={setSortOrdersBy}
                onViewDetails={handleViewOrderDetails}
                onStatusChange={handleUpdateOrderStatus}
                savingOrderId={savingOrderId}
              />
            )}

            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                categories={categories}
                sortProductsBy={sortProductsBy}
                onSortChange={setSortProductsBy}
                onDelete={handleDeleteProduct}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesTab
                categories={categories}
                isModalOpen={isCategoryModalOpen}
                onModalOpen={(category = null) => { setEditingCategory(category); setIsCategoryModalOpen(true) }}
                onModalClose={() => { setEditingCategory(null); setIsCategoryModalOpen(false) }}
                onSave={handleCategorySave}
                onDelete={handleDeleteCategory}
                savingCategory={savingCategory}
                editingCategory={editingCategory}
              />
            )}

            {activeTab === 'customers' && <CustomersTab />}

            {activeTab === 'analytics' && <AnalyticsTab />}
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

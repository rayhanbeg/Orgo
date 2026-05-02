import React, { useEffect, useState } from 'react'
import adminService from '../services/adminService'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (err) {
        setError('Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-light py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-light py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-black">NATURE ADMIN</h2>
        </div>
        <nav className="space-y-2 p-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            DASHBOARD
          </button>
          <div className="text-xs font-bold text-gray-600 tracking-wide px-4 mt-6 mb-2">MAIN</div>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
              activeTab === 'orders'
                ? 'text-black font-semibold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            ORDERS
            {activeTab === 'orders' && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">12</span>}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-2 text-sm transition ${
              activeTab === 'products'
                ? 'text-black font-semibold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            PRODUCTS
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-black transition">
            CUSTOMERS
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-black transition">
            ANALYTICS
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-black transition">
            SETTINGS
          </button>
        </nav>
        
        {/* Admin Info */}
        <div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-black">Admin User</p>
              <p className="text-xs text-gray-600">Superadmin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        {/* Top Bar */}
        <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">OVERVIEW</h1>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-sm text-gray-600">OCT 24, 2024</span>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="p-8">
            {/* Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xs font-bold text-gray-600 mb-3 tracking-wide">TOTAL REVENUE</h3>
                <p className="text-3xl font-bold text-black mb-2">$45,231.89</p>
                <p className="text-sm text-green-600">+20.1% from last month</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xs font-bold text-gray-600 mb-3 tracking-wide">ORDERS</h3>
                <p className="text-3xl font-bold text-black mb-2">+573</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xs font-bold text-gray-600 mb-3 tracking-wide">ACTIVE CUSTOMERS</h3>
                <p className="text-3xl font-bold text-black mb-2">2,350</p>
                <p className="text-sm text-red-600">-2.1% from last month</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xs font-bold text-gray-600 mb-3 tracking-wide">CONVERSION RATE</h3>
                <p className="text-3xl font-bold text-black mb-2">3.2%</p>
                <p className="text-sm text-green-600">+0.5% from last month</p>
              </div>
            </div>

            {/* Chart & Recent Orders */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Chart Placeholder */}
              <div className="lg:col-span-2 border border-gray-200 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-black">REVENUE OVERVIEW</h2>
                  <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                    <option>THIS YEAR</option>
                  </select>
                </div>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart Placeholder</p>
                </div>
                <div className="flex justify-around mt-6 text-xs text-gray-600 border-t border-gray-200 pt-6">
                  {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="border border-gray-200 p-6 rounded-lg h-fit">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-black">RECENT ORDERS</h2>
                  <a href="#" className="text-xs font-semibold text-gray-600 hover:text-black">VIEW ALL</a>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 1092, name: 'Alice Walker', amount: 145, status: 'PROCESSING' },
                    { id: 1091, name: 'John Doe', amount: 85, status: 'SHIPPED' },
                    { id: 1090, name: 'Emma Smith', amount: 210, status: 'DELIVERED' },
                    { id: 1089, name: 'Michael Brown', amount: 45, status: 'PROCESSING' },
                    { id: 1088, name: 'Sarah Jones', amount: 115, status: 'PENDING' },
                  ].map((order) => (
                    <div key={order.id} className="flex justify-between items-start border-b border-gray-200 pb-4">
                      <div>
                        <p className="font-semibold text-black text-sm">#{order.id}</p>
                        <p className="text-xs text-gray-600">{order.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black text-sm">${order.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-8">
            <p className="text-gray-600">Product management features coming soon...</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-8">
            <p className="text-gray-600">Order management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

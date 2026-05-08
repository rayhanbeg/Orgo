import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  ChartIcon,
  CloseIcon,
  DashboardIcon,
  LogoutIcon,
  MenuIcon,
  OrdersIcon,
  ProductsIcon,
  UserIcon,
  UsersIcon,
} from '../common/Icons'

function AdminSidebar({ activeTab, setActiveTab, ordersCount, productsCount }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setIsMobileOpen(false)
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: DashboardIcon },
    { id: 'orders', label: 'Orders', icon: OrdersIcon, count: ordersCount },
    { id: 'products', label: 'Products', icon: ProductsIcon, count: productsCount },
    { id: 'categories', label: 'Categories', icon: DashboardIcon },
    { id: 'customers', label: 'Customers', icon: UsersIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartIcon },
  ]

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#2d7c5f] text-white shadow-lg shadow-black/10 lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-[#e5ddd2] bg-white text-gray-900 shadow-xl shadow-black/5 transition-transform duration-300 lg:w-64 lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="border-b border-[#e5ddd2] px-6 py-5">
          <h2 className="text-lg font-bold text-[#2d7c5f]">ORGO</h2>
          <p className="mt-1 text-xs tracking-[0.25em] text-gray-600">ADMIN PORTAL</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activeTab === item.id
                  ? 'bg-[#e8f3f0] text-[#2d7c5f]'
                  : 'text-gray-600 hover:bg-[#f5f2ed] hover:text-[#2d7c5f]'
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </span>
              {item.count !== undefined && (
                <span className={`text-xs font-bold ${activeTab === item.id ? 'text-[#2d7c5f]' : 'text-gray-500'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-[#e5ddd2] p-4 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d7c5f] text-xs font-bold text-white">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">Admin</p>
              <p className="truncate text-xs text-gray-600">User profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogoutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

export default AdminSidebar

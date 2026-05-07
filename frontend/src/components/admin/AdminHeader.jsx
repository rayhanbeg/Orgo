import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BellIcon,
  HomeIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from '../common/Icons'

function AdminHeader({ title, actionButton, onRefresh, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleAddProduct = () => {
    navigate('/admin/products/new')
  }

  return (
    <div className="sticky top-0 z-30 border-b border-[#e5ddd2] bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900 sm:text-xl">
            {title}
          </h1>
          {title === 'OVERVIEW' && (
            <p className="mt-1 text-xs text-gray-600">
              Here is what&apos;s happening with your store today.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 xl:justify-end">
          <div className="relative hidden sm:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-56 rounded-xl border border-[#e5ddd2] bg-white py-2 pl-10 pr-4 text-sm text-gray-900 transition focus:border-[#2d7c5f] focus:outline-none lg:w-72"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e5ddd2] px-3 text-xs font-semibold text-gray-700 transition hover:bg-[#f5f2ed]"
            aria-label="Refresh dashboard"
          >
            <RefreshIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <span className="hidden text-xs text-gray-600 lg:inline">
            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-[#f5f2ed] hover:text-[#2d7c5f]"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e5ddd2] px-3 text-xs font-semibold text-gray-900 transition hover:bg-[#f5f2ed]"
          >
            <HomeIcon className="h-4 w-4" />
            <span>Go Home</span>
          </button>

          {actionButton && (
            <button
              onClick={actionButton.onClick || handleAddProduct}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2d7c5f] px-4 text-xs font-semibold text-white transition hover:bg-[#235844] disabled:opacity-50"
              disabled={isLoading}
            >
              <PlusIcon className="h-4 w-4" />
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminHeader

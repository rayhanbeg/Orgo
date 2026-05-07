import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  CreditCardIcon,
  LogoutIcon,
  MapPinIcon,
  OrdersIcon,
  UserIcon,
  UsersIcon,
} from '../common/Icons'

function ProfileSidebar({ activeTab, setActiveTab, user }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: UserIcon },
    { id: 'orders', label: 'Order History', icon: OrdersIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'payment', label: 'Payment Methods', icon: CreditCardIcon },
    { id: 'notifications', label: 'Notifications', icon: UsersIcon },
  ]

  return (
    <div className="profile-sidebar">
      <div className="border-b border-[var(--color-border)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] text-2xl font-bold text-white">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)]">
              {user?.name || 'User'}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {user?.email || 'user@example.com'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="flex items-center gap-3">
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-[var(--color-border)] p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-[var(--color-danger-light)] px-4 py-3 text-sm font-semibold text-[var(--color-danger)] transition hover:bg-[var(--color-danger)] hover:text-white"
        >
          <span className="inline-flex items-center gap-2">
            <LogoutIcon className="h-4 w-4" />
            LOGOUT
          </span>
        </button>
      </div>
    </div>
  )
}

export default ProfileSidebar

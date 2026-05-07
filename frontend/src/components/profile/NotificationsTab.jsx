import { useState, useEffect } from 'react'

function NotificationsTab() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newProducts: true,
    reviews: true,
    weeklyNewsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleToggle = async (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    }
    setPreferences(newPreferences)

    try {
      setLoading(true)
      // Update notification preferences
      console.log('Updating preferences:', newPreferences)
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to update preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  const notificationSettings = [
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive important updates and announcements via email',
      icon: '📧',
    },
    {
      id: 'orderUpdates',
      title: 'Order Updates',
      description: 'Get notified about your order status changes',
      icon: '📦',
    },
    {
      id: 'promotions',
      title: 'Promotional Offers',
      description: 'Receive special deals and discount codes',
      icon: '🎁',
    },
    {
      id: 'newProducts',
      title: 'New Products',
      description: 'Be the first to know about new arrivals',
      icon: '✨',
    },
    {
      id: 'reviews',
      title: 'Review Requests',
      description: 'Receive requests to review your purchases',
      icon: '⭐',
    },
    {
      id: 'weeklyNewsletter',
      title: 'Weekly Newsletter',
      description: 'Get a curated weekly newsletter with best sellers and tips',
      icon: '📰',
    },
  ]

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-4 bg-[var(--color-success-light)] border border-[var(--color-success)] rounded-lg text-[var(--color-success)] text-sm">
          ✓ Notification preferences updated successfully
        </div>
      )}

      {/* Notification Preferences */}
      <div className="metric-card">
        <h2 className="metric-card-label text-base mb-6">NOTIFICATION PREFERENCES</h2>

        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-start justify-between border-b border-[var(--color-border-light)] pb-4 last:border-0 hover:bg-[var(--color-primary-light)] px-3 py-3 rounded transition"
            >
              <div className="flex items-start gap-4 flex-1">
                <span className="text-2xl">{setting.icon}</span>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    {setting.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {setting.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleToggle(setting.id)}
                  disabled={loading}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences[setting.id]
                      ? 'bg-[var(--color-primary)]'
                      : 'bg-[var(--color-border)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      preferences[setting.id] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Frequency */}
      <div className="metric-card">
        <h2 className="metric-card-label text-base mb-6">EMAIL FREQUENCY</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="daily"
              name="frequency"
              value="daily"
              defaultChecked
              className="w-4 h-4"
            />
            <label htmlFor="daily" className="text-sm text-[var(--color-text)] cursor-pointer flex-1">
              <span className="font-semibold">Daily Digest</span>
              <span className="text-[var(--color-text-muted)]"> - All updates in one daily email</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="weekly"
              name="frequency"
              value="weekly"
              className="w-4 h-4"
            />
            <label htmlFor="weekly" className="text-sm text-[var(--color-text)] cursor-pointer flex-1">
              <span className="font-semibold">Weekly Summary</span>
              <span className="text-[var(--color-text-muted)]"> - All updates in one weekly email</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="immediate"
              name="frequency"
              value="immediate"
              className="w-4 h-4"
            />
            <label htmlFor="immediate" className="text-sm text-[var(--color-text)] cursor-pointer flex-1">
              <span className="font-semibold">Immediate</span>
              <span className="text-[var(--color-text-muted)]"> - Get emails as things happen</span>
            </label>
          </div>
        </div>
      </div>

      {/* Unsubscribe Section */}
      <div className="metric-card">
        <h2 className="metric-card-label text-base mb-6">MANAGE COMMUNICATIONS</h2>

        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text)]">
            Want to unsubscribe from all marketing emails?
          </p>
          <button className="btn-secondary">
            Unsubscribe from All Marketing
          </button>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            You'll still receive transactional emails about your orders and account
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotificationsTab

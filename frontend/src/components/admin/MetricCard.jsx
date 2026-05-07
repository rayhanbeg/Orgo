function MetricCard({ title, value, trend, trendDirection = 'up', icon = null, trendPercent = null }) {
  const isPositive = trendDirection === 'up'

  return (
    <div className="rounded-lg border border-[#e5ddd2] bg-white p-6 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">{title}</p>
          <p className="mb-2 text-2xl font-bold text-gray-900">{value}</p>
          {(trend || trendPercent !== null) && (
            <p className={`text-xs font-semibold ${isPositive ? 'text-[#2d7c5f]' : 'text-red-600'}`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              {trendPercent !== null && <span className="ml-1">{trendPercent}%</span>}
              {trend && <span className="ml-1">{trend}</span>}
            </p>
          )}
        </div>
        {icon && <div className="shrink-0 text-gray-300">{icon}</div>}
      </div>
    </div>
  )
}

export default MetricCard

import React from 'react'

function SimpleChart({ data = [], title = 'Chart', labels = [] }) {
  const maxValue = Math.max(...(data || [0]))

  if (!data || data.length === 0) {
    return (
      <div className="metric-card">
        <h3 className="metric-card-label text-base">{title}</h3>
        <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="metric-card">
      <h3 className="metric-card-label text-base mb-6">{title}</h3>
      <div className="flex items-end justify-around h-64 gap-2 mb-4 px-2">
        {data.map((value, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center"
            style={{ height: '100%' }}
          >
            <div
              className="w-full bg-[var(--color-primary)] rounded-t transition hover:opacity-80 cursor-pointer"
              style={{
                height: `${(value / maxValue) * 100}%`,
                minHeight: '4px',
              }}
              title={`${value}`}
            />
          </div>
        ))}
      </div>
      {labels.length > 0 && (
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] px-2">
          {labels.map((label, idx) => (
            <span key={idx} className="text-center flex-1">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default SimpleChart

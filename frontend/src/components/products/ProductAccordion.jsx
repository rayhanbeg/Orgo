import { useState } from 'react'

function ProductAccordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      className="group cursor-pointer border-t border-gray-200 pt-4 last:border-b"
    >
      <summary className="flex justify-between items-center font-bold text-black text-sm hover:opacity-70 transition">
        <span className="tracking-wide">{title}</span>
        <span className="text-lg">{isOpen ? '−' : '+'}</span>
      </summary>
      <div className="text-gray-700 mt-4 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </details>
  )
}

export default ProductAccordion

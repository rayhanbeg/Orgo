import { useState } from 'react'

function PaymentMethodsTab({ user }) {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    isDefault: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add payment method logic
    console.log('Adding payment method:', formData)
    setIsAdding(false)
  }

  const handleDelete = (methodId) => {
    if (!window.confirm('Delete this payment method?')) return
    setPaymentMethods(paymentMethods.filter(m => m.id !== methodId))
  }

  const maskCardNumber = (number) => {
    return `****-****-****-${number?.slice(-4) || '****'}`
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="metric-card-label text-base">SAVED PAYMENT METHODS</h2>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-[var(--color-primary)] font-semibold text-sm hover:underline"
            >
              ➕ Add Card
            </button>
          )}
        </div>

        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="border border-[var(--color-border)] rounded-lg p-4 hover:bg-[var(--color-primary-light)] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">💳</span>
                      <div>
                        <h3 className="font-semibold text-[var(--color-text)]">
                          {method.cardName}
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {maskCardNumber(method.cardNumber)}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Expires: {method.expiryDate}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="status-badge delivered">Default</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-sm px-3 py-1 border border-[var(--color-danger-light)] text-[var(--color-danger)] rounded hover:bg-[var(--color-danger-light)] transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-muted)] mb-4">No payment methods saved</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Add a credit or debit card for faster checkout
            </p>
          </div>
        )}
      </div>

      {/* Add Card Form */}
      {isAdding && (
        <div className="metric-card">
          <h2 className="metric-card-label text-base mb-6">ADD NEW CARD</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Card Holder Name</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="isDefault" className="text-sm text-[var(--color-text)]">
                Set as default payment method
              </label>
            </div>

            <div className="bg-[var(--color-warning-light)] border border-[var(--color-warning)] rounded-lg p-4 text-sm text-[var(--color-text)]">
              ℹ️ Your card information is secure and encrypted. We never store your full card details.
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Card'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default PaymentMethodsTab

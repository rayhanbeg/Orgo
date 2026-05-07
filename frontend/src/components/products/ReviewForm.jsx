import { useState } from 'react'
import reviewService from '../../services/reviewService'

function ReviewForm({ productId, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.title.trim() || !formData.comment.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (formData.comment.length < 10) {
      setError('Comment must be at least 10 characters long')
      return
    }

    setLoading(true)

    try {
      await reviewService.createReview(productId, {
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      })

      setSuccess('Review submitted successfully!')
      setFormData({
        rating: 5,
        title: '',
        comment: '',
      })

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }

      setTimeout(() => setSuccess(null), 2500)
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-shell">
      <div className="form-shell-inner">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-neutral-500">Review</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">Write a review</h3>
        </div>

        {error && <div className="form-error mb-5">{error}</div>}
        {success && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <div className="space-y-5">
          <div>
            <label className="form-label">Rating</label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const active = i < formData.rating
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
                    className={`h-11 w-11 rounded-full border transition ${
                      active
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-neutral-200 bg-white text-neutral-400 hover:border-neutral-400'
                    }`}
                    aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                  >
                    ★
                  </button>
                )
              })}
            </div>
            <p className="form-help">Your rating: {formData.rating} out of 5</p>
          </div>

          <div>
            <label className="form-label">Review title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summarize your experience"
              maxLength="100"
              className="form-input"
              required
            />
            <p className="form-help">{formData.title.length}/100 characters</p>
          </div>

          <div>
            <label className="form-label">Your review</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Share your detailed thoughts about this product..."
              maxLength="1000"
              rows="5"
              className="form-textarea"
              required
            />
            <p className="form-help">{formData.comment.length}/1000 characters</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit review'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ReviewForm

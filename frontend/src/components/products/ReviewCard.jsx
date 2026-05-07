import { useState } from 'react'
import reviewService from '../../services/reviewService'

function ReviewCard({ review, onMarkHelpful, canDelete = false, onDelete }) {
  const [isHelpful, setIsHelpful] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleMarkHelpful = async (helpful) => {
    if (isHelpful === helpful) return

    setLoading(true)
    try {
      await reviewService.markHelpful(review._id, helpful)
      setIsHelpful(helpful)
      if (onMarkHelpful) {
        onMarkHelpful(review._id, helpful)
      }
    } catch (error) {
      console.error('Error marking helpful:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-neutral-950' : 'text-neutral-300'}>
        ★
      </span>
    ))

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-950">{review.title}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-neutral-500">
            <div className="flex gap-1">{renderStars(review.rating)}</div>
            <span>{review.rating.toFixed(1)} / 5</span>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => onDelete(review._id)}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500 hover:text-red-700 transition"
          >
            Delete
          </button>
        )}
      </div>

      <p className="mt-4 text-sm leading-7 text-neutral-600">{review.comment}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
        <span className="font-semibold text-neutral-950">{review.userId?.name || 'Anonymous'}</span>
        {review.verified && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
            Verified buyer
          </span>
        )}
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => handleMarkHelpful(true)}
          disabled={loading || isHelpful !== null}
          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            isHelpful === true
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950'
          }`}
        >
          Helpful ({review.helpful})
        </button>
        <button
          onClick={() => handleMarkHelpful(false)}
          disabled={loading || isHelpful !== null}
          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            isHelpful === false
              ? 'border-rose-600 bg-rose-50 text-rose-700'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950'
          }`}
        >
          Not helpful ({review.notHelpful})
        </button>
      </div>
    </article>
  )
}

export default ReviewCard

import React, { useState } from 'react'
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#FCD34D' : '#D1D5DB' }}>
        ★
      </span>
    ))
  }

  return (
    <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <div>
          <p style={{ fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0' }}>{review.title}</p>
          <div style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>
            {renderStars(review.rating)}
            <span style={{ marginLeft: '8px' }}>
              {review.rating.toFixed(1)} out of 5
            </span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(review._id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Delete
          </button>
        )}
      </div>

      <p style={{ color: '#4B5563', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
        {review.comment}
      </p>

      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', display: 'flex', gap: '16px' }}>
        <span>
          <strong>{review.userId?.name || 'Anonymous'}</strong>
        </span>
        {review.verified && (
          <span style={{ color: '#059669', fontWeight: 'bold' }}>
            ✓ Verified Buyer
          </span>
        )}
        <span>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
        <button
          onClick={() => handleMarkHelpful(true)}
          disabled={loading || isHelpful !== null}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isHelpful === true ? '#059669' : '#6B7280',
            fontWeight: isHelpful === true ? 'bold' : 'normal',
            opacity: loading ? 0.6 : 1,
          }}
        >
          👍 Helpful ({review.helpful})
        </button>
        <button
          onClick={() => handleMarkHelpful(false)}
          disabled={loading || isHelpful !== null}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isHelpful === false ? '#EF4444' : '#6B7280',
            fontWeight: isHelpful === false ? 'bold' : 'normal',
            opacity: loading ? 0.6 : 1,
          }}
        >
          👎 Not helpful ({review.notHelpful})
        </button>
      </div>
    </div>
  )
}

export default ReviewCard

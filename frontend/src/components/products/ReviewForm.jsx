import React, { useState } from 'react'
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
      [name]: name === 'rating' ? parseInt(value) : value,
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

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  const renderStarInput = () => {
    return (
      <div style={{ display: 'flex', gap: '8px', fontSize: '24px', marginBottom: '16px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: i < formData.rating ? '#FCD34D' : '#D1D5DB',
              fontSize: '28px',
              padding: 0,
            }}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px' }}>
      <h3 style={{ color: '#1F2937', marginBottom: '16px' }}>Write a Review</h3>

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {success}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
          Rating
        </label>
        {renderStarInput()}
        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0' }}>
          Your rating: {formData.rating} out of 5
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
          Review Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Summarize your experience"
          maxLength="100"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #D1D5DB',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
          required
        />
        <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
          {formData.title.length}/100 characters
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
          Your Review
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Share your detailed thoughts about this product..."
          maxLength="1000"
          rows="5"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #D1D5DB',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
          required
        />
        <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
          {formData.comment.length}/1000 characters (minimum 10)
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: '#059669',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          opacity: loading ? 0.6 : 1,
          width: '100%',
        }}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default ReviewForm

import api from './api'

const createReview = async (productId, reviewData) => {
  try {
    const response = await api.post('/reviews', {
      productId,
      ...reviewData,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create review' }
  }
}

const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' }
  }
}

const getReview = async (reviewId) => {
  try {
    const response = await api.get(`/reviews/${reviewId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch review' }
  }
}

const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update review' }
  }
}

const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete review' }
  }
}

const markHelpful = async (reviewId, helpful) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/helpful`, { helpful })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark review' }
  }
}

const getAllReviews = async (adminApproved, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/reviews?adminApproved=${adminApproved}&page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' }
  }
}

const approveReview = async (reviewId, adminApproved) => {
  try {
    const response = await api.put(`/reviews/${reviewId}/approve`, { adminApproved })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve review' }
  }
}

export default {
  createReview,
  getProductReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
  approveReview,
}

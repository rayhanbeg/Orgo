import Review from '../models/Review.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

// Create a review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body
    const userId = req.user.id

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ productId, userId })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      })
    }

    // Check if user has purchased this product
    const purchasedOrder = await Order.findOne({
      userId,
      'items.productId': productId,
      orderStatus: { $in: ['shipped', 'delivered'] },
    })

    if (!purchasedOrder) {
      return res.status(403).json({
        success: false,
        message: 'Only verified purchasers can review this product',
      })
    }

    // Create review
    const review = new Review({
      productId,
      userId,
      rating,
      title,
      comment,
      verified: true,
    })

    await review.save()

    // Update product rating
    const allReviews = await Review.find({ productId, adminApproved: true })
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length,
    })

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ productId, adminApproved: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments({ productId, adminApproved: true })

    res.json({
      success: true,
      reviews,
      totalReviews: total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get single review
export const getReview = async (req, res) => {
  try {
    const { id } = req.params

    const review = await Review.findById(id).populate('userId', 'name email').populate('productId', 'name')

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    res.json({
      success: true,
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params
    const { rating, title, comment } = req.body
    const userId = req.user.id

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    // Update review
    review.rating = rating || review.rating
    review.title = title || review.title
    review.comment = comment || review.comment

    await review.save()

    // Update product rating
    const allReviews = await Review.find({ productId: review.productId, adminApproved: true })
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length

    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
    })

    res.json({
      success: true,
      message: 'Review updated successfully',
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const productId = review.productId

    await Review.findByIdAndDelete(id)

    // Update product rating
    const allReviews = await Review.find({ productId, adminApproved: true })
    const avgRating = allReviews.length > 0 ? allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length : 0

    await Product.findByIdAndUpdate(productId, {
      rating: allReviews.length > 0 ? Math.round(avgRating * 10) / 10 : 0,
      numReviews: allReviews.length,
    })

    res.json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Mark review helpful
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params
    const { helpful } = req.body

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    if (helpful) {
      review.helpful += 1
    } else {
      review.notHelpful += 1
    }

    await review.save()

    res.json({
      success: true,
      message: 'Review marked',
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get all reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const { adminApproved, page = 1, limit = 10 } = req.query

    let filter = {}
    if (adminApproved !== undefined) {
      filter.adminApproved = adminApproved === 'true'
    }

    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments(filter)

    res.json({
      success: true,
      reviews,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Approve/reject review (admin)
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params
    const { adminApproved } = req.body

    const review = await Review.findByIdAndUpdate(id, { adminApproved }, { new: true })

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    // Update product rating
    const allReviews = await Review.find({ productId: review.productId, adminApproved: true })
    const avgRating = allReviews.length > 0 ? allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length : 0

    await Product.findByIdAndUpdate(review.productId, {
      rating: allReviews.length > 0 ? Math.round(avgRating * 10) / 10 : 0,
      numReviews: allReviews.length,
    })

    res.json({
      success: true,
      message: adminApproved ? 'Review approved' : 'Review rejected',
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

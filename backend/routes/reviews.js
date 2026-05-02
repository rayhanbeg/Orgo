import express from 'express'
import {
  createReview,
  getProductReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
  approveReview,
} from '../controllers/reviewController.js'
import { verifyToken, checkAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/product/:productId', getProductReviews)
router.get('/:id', getReview)

// User routes
router.post('/', verifyToken, createReview)
router.put('/:id', verifyToken, updateReview)
router.delete('/:id', verifyToken, deleteReview)
router.post('/:id/helpful', verifyToken, markHelpful)

// Admin routes
router.get('/', verifyToken, checkAdmin, getAllReviews)
router.put('/:id/approve', verifyToken, checkAdmin, approveReview)

export default router

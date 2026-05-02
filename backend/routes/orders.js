import express from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js'
import { verifyToken, checkAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', createOrder) // Public - can create order without auth (for guests)
router.get('/', verifyToken, getOrders) // Get user's orders
router.get('/:id', verifyToken, getOrderById) // Get specific order
router.put('/:id', verifyToken, checkAdmin, updateOrderStatus) // Admin only - update status
router.get('/admin/all', verifyToken, checkAdmin, getAllOrders) // Admin only - get all orders

export default router

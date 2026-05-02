import express from 'express'
import { getDashboardStats, getOrderStats } from '../controllers/adminController.js'
import { verifyToken, checkAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/dashboard', verifyToken, checkAdmin, getDashboardStats)
router.get('/stats/orders', verifyToken, checkAdmin, getOrderStats)

export default router

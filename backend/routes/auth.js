import express from 'express'
import { register, login, googleAuth, logout, getProfile } from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/logout', logout)
router.get('/profile', verifyToken, getProfile)

export default router

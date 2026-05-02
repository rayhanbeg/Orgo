import express from 'express'
import {
  updateProfile,
  changePassword,
  getUserProfile,
  getAllUsers,
  deleteUser,
} from '../controllers/userController.js'
import { verifyToken, checkAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', verifyToken, getUserProfile)
router.put('/profile', verifyToken, updateProfile)
router.put('/change-password', verifyToken, changePassword)
router.get('/admin/all', verifyToken, checkAdmin, getAllUsers)
router.delete('/:id', verifyToken, checkAdmin, deleteUser)

export default router

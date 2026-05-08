import express from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/categoryController.js'
import { verifyToken, checkAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getCategories)
router.post('/', verifyToken, checkAdmin, createCategory)
router.put('/:id', verifyToken, checkAdmin, updateCategory)
router.delete('/:id', verifyToken, checkAdmin, deleteCategory)

export default router

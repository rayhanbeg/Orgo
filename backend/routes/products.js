import express from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { uploadProductImage, deleteProductImage } from '../controllers/uploadController.js'
import { verifyToken, checkAdmin } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Admin routes
router.post('/', verifyToken, checkAdmin, createProduct)
router.put('/:id', verifyToken, checkAdmin, updateProduct)
router.delete('/:id', verifyToken, checkAdmin, deleteProduct)

// Upload routes
router.post('/upload', verifyToken, checkAdmin, upload.single('image'), uploadProductImage)
router.post('/delete-image', verifyToken, checkAdmin, deleteProductImage)

export default router

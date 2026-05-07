import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string' && tags.trim()) {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  return []
}

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return Boolean(value)
}

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query

    let filter = {}

    if (category && category !== 'all') {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    let sortObj = {}
    if (sort === 'price-asc') {
      sortObj = { price: 1 }
    } else if (sort === 'price-desc') {
      sortObj = { price: -1 }
    } else if (sort === 'newest') {
      sortObj = { createdAt: -1 }
    } else if (sort === 'rating') {
      sortObj = { rating: -1 }
    }

    const products = await Product.find(filter).sort(sortObj)

    res.json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      imagePublicId,
      stock,
      certified,
      tags,
      benefits,
      ingredients,
      usage,
      shipping,
    } = req.body

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      imagePublicId: imagePublicId || null,
      stock: stock || 0,
      certified: toBoolean(certified),
      tags: parseTags(tags),
      benefits: benefits || '',
      ingredients: ingredients || '',
      usage: usage || '',
      shipping: shipping || '',
    })

    await product.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      price,
      category,
      image,
      imagePublicId,
      stock,
      certified,
      tags,
      benefits,
      ingredients,
      usage,
      shipping,
    } = req.body

    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    if (
      existingProduct.imagePublicId &&
      imagePublicId &&
      existingProduct.imagePublicId !== imagePublicId
    ) {
      await cloudinary.uploader.destroy(existingProduct.imagePublicId)
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: name ?? existingProduct.name,
        description: description ?? existingProduct.description,
        price: price ?? existingProduct.price,
        category: category ?? existingProduct.category,
        image: image ?? existingProduct.image,
        imagePublicId: imagePublicId ?? existingProduct.imagePublicId,
        stock: stock ?? existingProduct.stock,
        certified: certified !== undefined ? toBoolean(certified) : existingProduct.certified,
        tags: tags !== undefined ? parseTags(tags) : existingProduct.tags,
        benefits: benefits ?? existingProduct.benefits,
        ingredients: ingredients ?? existingProduct.ingredients,
        usage: usage ?? existingProduct.usage,
        shipping: shipping ?? existingProduct.shipping,
      },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId)
    }

    await Product.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

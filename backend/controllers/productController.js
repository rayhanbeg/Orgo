import Product from '../models/Product.js'

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
    const { name, description, price, category, image, stock, certified, tags } = req.body

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock: stock || 0,
      certified: certified || false,
      tags: tags || [],
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
    const { name, description, price, category, image, stock, certified, tags } = req.body

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, image, stock, certified, tags },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

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

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

import Category from '../models/Category.js'
import Product from '../models/Product.js'

const defaultCategories = [
  { key: 'fruits', name: 'Fruits', description: 'Fresh seasonal fruit', sortOrder: 1, subcategories: ['Citrus', 'Berries', 'Tropical'] },
  { key: 'vegetables', name: 'Vegetables', description: 'Garden-fresh vegetables', sortOrder: 2, subcategories: ['Leafy Greens', 'Root Vegetables', 'Cruciferous'] },
  { key: 'grains', name: 'Grains', description: 'Whole grains and staples', sortOrder: 3, subcategories: ['Rice', 'Flour', 'Seeds'] },
  { key: 'dairy', name: 'Dairy', description: 'Milk and dairy products', sortOrder: 4, subcategories: ['Milk', 'Cheese', 'Yogurt'] },
  { key: 'oils', name: 'Oils', description: 'Cooking and specialty oils', sortOrder: 5, subcategories: ['Cooking Oils', 'Olive Oil', 'Seed Oils'] },
  { key: 'snacks', name: 'Snacks', description: 'Healthy snacks and treats', sortOrder: 6, subcategories: ['Bars', 'Nuts', 'Sweeteners'] },
  { key: 'beverages', name: 'Beverages', description: 'Drinks and refreshers', sortOrder: 7, subcategories: ['Juices', 'Teas', 'Coffee'] },
  { key: 'spices', name: 'Spices', description: 'Herbs, spices, and seasonings', sortOrder: 8, subcategories: ['Whole Spices', 'Ground Spices', 'Blends'] },
]

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const parseSubcategories = (subcategories) => {
  if (Array.isArray(subcategories)) {
    return subcategories.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof subcategories === 'string' && subcategories.trim()) {
    return subcategories
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const ensureDefaultCategories = async () => {
  const existingCount = await Category.countDocuments()
  if (existingCount > 0) {
    return
  }

  await Category.insertMany(defaultCategories)
}

const buildCategoryPayload = async (categories) => {
  const productCounts = await Product.aggregate([
    {
      $match: {
        category: { $type: 'string', $ne: '' },
      },
    },
    {
      $group: {
        _id: '$category',
        productCount: { $sum: 1 },
      },
    },
  ])

  const productCountMap = productCounts.reduce((acc, item) => {
    acc[item._id] = item.productCount
    return acc
  }, {})

  return categories.map((category) => ({
    ...category,
    productCount: productCountMap[category.key] || 0,
    subcategoryCount: category.subcategories?.length || 0,
  }))
}

export const getCategories = async (req, res) => {
  try {
    await ensureDefaultCategories()

    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean()
    const payload = await buildCategoryPayload(categories)

    res.json({
      success: true,
      categories: payload,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { key, name, description, sortOrder, subcategories } = req.body
    const normalizedKey = normalizeKey(key || name)

    if (!normalizedKey || !name) {
      return res.status(400).json({ success: false, message: 'Key and name are required' })
    }

    const existingCategory = await Category.findOne({ key: normalizedKey })
    if (existingCategory) {
      return res.status(409).json({ success: false, message: 'Category key already exists' })
    }

    const category = new Category({
      key: normalizedKey,
      name: String(name).trim(),
      description: description || '',
      sortOrder: Number(sortOrder) || 0,
      subcategories: parseSubcategories(subcategories),
    })

    await category.save()

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, sortOrder, subcategories } = req.body

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    category.name = name ?? category.name
    category.description = description ?? category.description
    category.sortOrder = sortOrder !== undefined ? Number(sortOrder) || 0 : category.sortOrder
    category.subcategories = subcategories !== undefined ? parseSubcategories(subcategories) : category.subcategories

    await category.save()

    res.json({
      success: true,
      message: 'Category updated successfully',
      category,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    await Category.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

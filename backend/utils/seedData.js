import mongoose from 'mongoose'
import Product from '../models/Product.js'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const seedProducts = [
  {
    name: 'Organic Apples',
    description: 'Fresh, crisp organic apples grown without pesticides',
    price: 4.99,
    category: 'fruits',
    image: 'https://via.placeholder.com/300x200?text=Organic+Apples',
    stock: 50,
    certified: true,
    tags: ['fresh', 'organic', 'fruits'],
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet and nutritious organic carrots',
    price: 3.49,
    category: 'vegetables',
    image: 'https://via.placeholder.com/300x200?text=Organic+Carrots',
    stock: 75,
    certified: true,
    tags: ['fresh', 'organic', 'vegetables'],
  },
  {
    name: 'Organic Broccoli',
    description: 'Fresh organic broccoli, rich in nutrients',
    price: 5.99,
    category: 'vegetables',
    image: 'https://via.placeholder.com/300x200?text=Organic+Broccoli',
    stock: 40,
    certified: true,
    tags: ['fresh', 'organic', 'vegetables', 'green'],
  },
  {
    name: 'Organic Whole Wheat',
    description: 'Premium organic whole wheat flour',
    price: 6.99,
    category: 'grains',
    image: 'https://via.placeholder.com/300x200?text=Organic+Wheat',
    stock: 100,
    certified: true,
    tags: ['organic', 'grains'],
  },
  {
    name: 'Organic Banana',
    description: 'Yellow ripe organic bananas',
    price: 2.99,
    category: 'fruits',
    image: 'https://via.placeholder.com/300x200?text=Organic+Banana',
    stock: 80,
    certified: true,
    tags: ['fresh', 'organic', 'fruits', 'tropical'],
  },
  {
    name: 'Organic Milk',
    description: 'Pure organic cow milk',
    price: 5.49,
    category: 'dairy',
    image: 'https://via.placeholder.com/300x200?text=Organic+Milk',
    stock: 30,
    certified: true,
    tags: ['organic', 'dairy'],
  },
  {
    name: 'Organic Spinach',
    description: 'Fresh leafy organic spinach',
    price: 4.99,
    category: 'vegetables',
    image: 'https://via.placeholder.com/300x200?text=Organic+Spinach',
    stock: 25,
    certified: true,
    tags: ['fresh', 'organic', 'vegetables', 'green'],
  },
  {
    name: 'Organic Honey',
    description: 'Raw organic honey from local bees',
    price: 9.99,
    category: 'snacks',
    image: 'https://via.placeholder.com/300x200?text=Organic+Honey',
    stock: 40,
    certified: true,
    tags: ['organic', 'natural', 'snacks'],
  },
  {
    name: 'Organic Olive Oil',
    description: 'Extra virgin organic olive oil',
    price: 14.99,
    category: 'oils',
    image: 'https://via.placeholder.com/300x200?text=Organic+Olive+Oil',
    stock: 35,
    certified: true,
    tags: ['organic', 'oils'],
  },
  {
    name: 'Organic Orange Juice',
    description: 'Fresh squeezed organic orange juice',
    price: 6.99,
    category: 'beverages',
    image: 'https://via.placeholder.com/300x200?text=Organic+Juice',
    stock: 50,
    certified: true,
    tags: ['organic', 'beverages', 'fresh'],
  },
]

export const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert products
    const insertedProducts = await Product.insertMany(seedProducts)
    console.log(`Inserted ${insertedProducts.length} products`)

    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()

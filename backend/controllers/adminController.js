import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()

    const orders = await Order.find()
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5)
    const topProducts = await Product.find().sort({ rating: -1 }).limit(5)

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      recentOrders,
      topProducts,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getOrderStats = async (req, res) => {
  try {
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ])

    const ordersByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    res.json({
      success: true,
      ordersByStatus,
      ordersByMonth,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

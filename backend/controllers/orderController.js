import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from '../utils/emailService.js'

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body
    const userId = req.user?.id || null

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' })
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address required' })
    }

    let totalAmount = 0
    const normalizedItems = []

    // Validate products and calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} only has ${product.stock} in stock`,
        })
      }

      const quantity = Number(item.quantity) || 1
      totalAmount += product.price * quantity
      normalizedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })

      // Reduce stock
      product.stock -= quantity
      await product.save()
    }

    const order = new Order({
      userId,
      items: normalizedItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      notes: notes || '',
    })

    await order.save()

    // Send confirmation email asynchronously (don't block order creation)
    sendOrderConfirmationEmail(order).catch((err) => {
      console.error('Failed to send confirmation email:', err)
    })

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: order._id,
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await Order.find({ userId }).sort({ createdAt: -1 })

    res.json({
      success: true,
      orders,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id).populate('items.productId')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.userId) {
      const isOwner = req.user && order.userId.toString() === req.user.id
      const isAdmin = req.user?.role === 'admin'

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Unauthorized' })
      }
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { orderStatus, paymentStatus } = req.body

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus, paymentStatus },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Send status update email asynchronously
    if (orderStatus) {
      sendOrderStatusUpdateEmail(order, orderStatus).catch((err) => {
        console.error('Failed to send status update email:', err)
      })
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query
    let filter = {}

    if (status) {
      filter.orderStatus = status
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: orders.length,
      orders,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

import api from './api'

export const orderService = {
  createOrder: async (items, shippingAddress, paymentMethod = 'credit_card', notes = '') => {
    const response = await api.post('/orders', {
      items,
      shippingAddress,
      paymentMethod,
      notes,
    })
    return response.data
  },

  getUserOrders: async () => {
    const response = await api.get('/orders')
    return response.data
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  updateOrderStatus: async (id, orderStatus, paymentStatus) => {
    const response = await api.put(`/orders/${id}`, {
      orderStatus,
      paymentStatus,
    })
    return response.data
  },

  getAllOrders: async (status = null) => {
    const response = await api.get('/orders/admin/all', {
      params: { status },
    })
    return response.data
  },
}

export default orderService

import api from './api'

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  getOrderStats: async () => {
    const response = await api.get('/admin/stats/orders')
    return response.data
  },
}

export default adminService

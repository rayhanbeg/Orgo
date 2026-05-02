import api from './api'

export const userService = {
  getUserProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  updateProfile: async (name, phone, address) => {
    const response = await api.put('/users/profile', {
      name,
      phone,
      address,
    })
    return response.data
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    })
    return response.data
  },

  getAllUsers: async (role = null) => {
    const response = await api.get('/users/admin/all', {
      params: { role },
    })
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

export default userService

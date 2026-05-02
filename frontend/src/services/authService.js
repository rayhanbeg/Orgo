import api from './api'

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  googleAuth: async (email, name, googleId) => {
    const response = await api.post('/auth/google', { email, name, googleId })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

export default authService

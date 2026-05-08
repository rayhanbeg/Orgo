import api from './api'

export const productService = {
  getAllProducts: async (category = 'all', search = '', sort = 'recommended', subcategory = '') => {
    const response = await api.get('/products', {
      params: {
        category: category !== 'all' ? category : undefined,
        search: search || undefined,
        sort: sort || undefined,
        subcategory: subcategory && subcategory !== 'all' ? subcategory : undefined,
      },
    })
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

export default productService

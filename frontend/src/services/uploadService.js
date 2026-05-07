import api from './api'

const uploadProductImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Image upload failed' }
  }
}

const deleteProductImage = async (publicId) => {
  try {
    const response = await api.post('/products/delete-image', { publicId })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Image deletion failed' }
  }
}

export default {
  uploadProductImage,
  deleteProductImage,
}

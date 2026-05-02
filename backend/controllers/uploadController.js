import { Readable } from 'stream'
import cloudinary from '../config/cloudinary.js'

const uploadFromBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })

    Readable.from(buffer).pipe(stream)
  })

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      })
    }

    const result = await uploadFromBuffer(req.file.buffer, {
      folder: 'organic-store/products',
      resource_type: 'image',
    })

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    })
  }
}

export const deleteProductImage = async (req, res) => {
  try {
    const { publicId } = req.body

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID required',
      })
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId)

    res.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Image deletion failed',
    })
  }
}

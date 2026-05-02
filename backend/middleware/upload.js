import multer from 'multer'

// Keep Multer only for multipart parsing. Cloudinary upload happens in the controller.
const storage = multer.memoryStorage()

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false)
  }
}

// Create multer instance with in-memory storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

export default upload

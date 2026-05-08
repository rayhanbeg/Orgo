import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Please provide a category key'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    subcategories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Category', categorySchema)

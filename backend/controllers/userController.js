import User from '../models/User.js'
import bcryptjs from 'bcryptjs'

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, phone, address } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        address,
      },
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const user = await User.findById(userId).select('+password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isPasswordMatch = await user.matchPassword(currentPassword)
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query
    let filter = {}

    if (role) {
      filter.role = role
    }

    const users = await User.find(filter).select('-password')

    res.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const user = new User({
      name,
      email,
      password,
    })

    await user.save()

    const token = generateToken(user)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordMatch = await user.matchPassword(password)
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId } = req.body

    if (!email || !name || !googleId) {
      return res.status(400).json({ message: 'Invalid Google auth data' })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
      })
      await user.save()
    } else if (!user.googleId) {
      user.googleId = googleId
      await user.save()
    }

    const token = generateToken(user)

    res.json({
      message: 'Google auth successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Google auth error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
  res.json({ message: 'Logout successful' })
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
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
    res.status(500).json({ message: error.message })
  }
}

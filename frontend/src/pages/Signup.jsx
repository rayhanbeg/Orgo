import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { GoogleLogin } from '@react-oauth/google'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { register, googleAuth, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    const result = await register(name, email, password)
    if (result.success) {
      navigate('/')
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      await googleAuth(decoded.email, decoded.name, decoded.sub)
      navigate('/')
    } catch (err) {
      console.error('Google auth error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md border border-gray-200 p-12">
          <h1 className="text-4xl font-bold text-center mb-2">CREATE ACCOUNT</h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            Join us to start shopping.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-black mb-3 tracking-wide">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-3 tracking-wide">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="hello@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-3 tracking-wide">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-3 tracking-wide">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline hover:opacity-70">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

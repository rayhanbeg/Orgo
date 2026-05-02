import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { GoogleLogin } from '@react-oauth/google'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, googleAuth, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
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
          <h1 className="text-4xl font-bold text-center mb-2">WELCOME BACK</h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            Enter your details to access your account.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-black tracking-wide">PASSWORD</label>
                <Link to="#" className="text-xs font-bold underline hover:opacity-70">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-bold underline hover:opacity-70">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

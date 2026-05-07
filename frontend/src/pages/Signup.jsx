import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { register, loading, error } = useAuth()
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-950 mb-3">Create Account</h1>
          <p className="text-neutral-600">
            Join ORGO for faster checkout and exclusive offers.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                value={name.split(' ')[0] || ''}
                onChange={(e) => setName(`${e.target.value} ${name.split(' ')[1] || ''}`)}
                className="form-input"
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                value={name.split(' ')[1] || ''}
                onChange={(e) => setName(`${name.split(' ')[0] || ''} ${e.target.value}`)}
                className="form-input"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Create a password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50 mt-8">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-neutral-600 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2d7c5f] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup

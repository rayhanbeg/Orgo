import { useState } from 'react'
import { Mail } from 'lucide-react'

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage('Thank you for subscribing!')
      setEmail('')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#EEF2EB]">
      <div className="container-fluid">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Mail 
              size={40} 
              style={{ color: '#5a8c6f' }}
              strokeWidth={1.5}
            />
          </div>
          
          <h2 
            className="mb-4 text-3xl sm:text-4xl font-bold"
            style={{ color: '#2d7c5f' }}
          >
            Join the Community
          </h2>

          <p 
            className="mb-8 text-base sm:text-lg"
            style={{ color: '#7a7a7a' }}
          >
            Subscribe to receive 15% off your first order, plus weekly insights into mindful and natural living.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg border text-sm placeholder-gray-400"
              style={{
                borderColor: '#d0d0d0',
                backgroundColor: '#fafafa',
                color: '#1a1a1a'
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 whitespace-nowrap"
              style={{ backgroundColor: '#2d7c5f' }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {message && (
            <p 
              className="mt-4 text-sm font-medium"
              style={{ color: '#2d7c5f' }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection

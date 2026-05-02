import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound

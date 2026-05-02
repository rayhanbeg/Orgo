import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const categories = [
    { name: 'Fruits', icon: '🍎', count: '25+ items' },
    { name: 'Vegetables', icon: '🥬', count: '30+ items' },
    { name: 'Dairy', icon: '🥛', count: '15+ items' },
    { name: 'Grains', icon: '🌾', count: '20+ items' },
  ]

  const features = [
    {
      title: '100% Organic',
      description: 'All products are certified organic and pesticide-free',
    },
    {
      title: 'Farm Fresh',
      description: 'Delivered fresh directly from local farms',
    },
    {
      title: 'Free Shipping',
      description: 'Free shipping on all orders',
    },
    {
      title: 'Easy Returns',
      description: '30-day money-back guarantee',
    },
  ]

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to Organic Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-50">
            Fresh, healthy, and organic products delivered to your door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{cat.name}</h3>
                <p className="text-gray-600">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary">✓</span>
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to eat healthy?</h2>
          <p className="text-xl mb-8 text-green-50">
            Browse our collection of fresh, organic products
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

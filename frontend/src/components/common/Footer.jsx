import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-dark text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              We provide fresh, organic products directly to your door.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:support@organic.com" className="hover:text-primary transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-primary transition">
                Facebook
              </a>
              <a href="#" className="hover:text-primary transition">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Organic Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

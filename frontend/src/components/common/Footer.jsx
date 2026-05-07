import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-16" style={{ backgroundColor: 'var(--color-card-bg)', borderTopColor: 'var(--color-border)' }}>
      <div className="container-fluid py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>About</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Premium organic superfoods for the modern lifestyle.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Shop</h3>
            <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <li>
                <Link to="/products" className="hover:underline transition" style={{ color: 'inherit' }}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline transition" style={{ color: 'inherit' }}>
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Support</h3>
            <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <li>
                <a href="mailto:support@orgo.com" className="hover:underline transition" style={{ color: 'inherit' }}>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline transition" style={{ color: 'inherit' }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Connect</h3>
            <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <a href="#" className="hover:underline transition" style={{ color: 'inherit' }}>
                Facebook
              </a>
              <a href="#" className="hover:underline transition" style={{ color: 'inherit' }}>
                Twitter
              </a>
              <a href="#" className="hover:underline transition" style={{ color: 'inherit' }}>
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 text-center text-xs" style={{ borderTopColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          <p>&copy; 2024 Orgo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

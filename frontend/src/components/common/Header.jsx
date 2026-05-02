import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalQuantity } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-wide">
          Nature Product
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm hover:opacity-70 transition uppercase">
            Shop
          </Link>
          <a href="#about" className="text-sm hover:opacity-70 transition uppercase">
            About
          </a>
          <a href="#contact" className="text-sm hover:opacity-70 transition uppercase">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hover:opacity-70 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link to="/cart" className="relative hover:opacity-70 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header

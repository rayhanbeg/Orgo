import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

function Header() {
  const location = useLocation()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalQuantity } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (location.pathname.startsWith('/admin')) {
    return null
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-neutral-950' : 'text-neutral-600 hover:text-neutral-950'
    }`

  const actionLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-neutral-950' : 'text-neutral-600 hover:text-neutral-950'
    }`

  const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
      isActive ? 'text-[#2d7c5f]' : 'text-neutral-500'
    }`

  const mobileProfileTarget = isAuthenticated ? '/profile' : '/login'
  const displayName = user?.name?.trim() || 'Guest'

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="container-fluid hidden lg:block">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-lg font-bold tracking-[0.18em] text-[#2d7c5f]">
              ORGO
            </Link>

            <nav className="flex items-center gap-8">
              <NavLink to="/products" className={linkClass}>
                Shop
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/profile" className={actionLinkClass}>
                    Profile
                  </NavLink>
                  {user?.role === 'admin' && (
                    <NavLink to="/admin" className={actionLinkClass}>
                      Admin Dashboard
                    </NavLink>
                  )}
                </>
              )}
            </nav>

            <div className="flex items-center gap-5">
              <button
                type="button"
                className="text-neutral-600 transition hover:text-neutral-950"
                aria-label="Search products"
                onClick={() => navigate('/products')}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <Link
                to="/cart"
                className="relative text-neutral-600 transition hover:text-neutral-950"
                aria-label="Cart"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2d7c5f] text-[10px] font-bold text-white">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="container-fluid lg:hidden">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-lg font-bold tracking-[0.18em] text-[#2d7c5f]">
              ORGO
            </Link>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div className="max-w-[8.5rem] rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <p className="truncate text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      {displayName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex rounded-full bg-neutral-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="relative mx-auto grid max-w-7xl grid-cols-5 px-3 pt-2">
          <NavLink to="/" className={mobileNavClass} end>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </NavLink>

          <NavLink to="/products" className={mobileNavClass}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7h-2.18a2 2 0 00-1.86-1.31H8.04A2 2 0 006.18 7H4m16 0l-1.5 10.5A2 2 0 0116.52 19H7.48a2 2 0 01-1.98-1.5L4 7m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v1m4 0h8"
              />
            </svg>
            <span>Shop</span>
          </NavLink>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="-mt-8 flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-neutral-500 transition"
            aria-label="Search products"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white bg-[#2d7c5f] text-white shadow-[0_10px_25px_rgba(45,124,95,0.35)] ring-4 ring-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <span>Search</span>
          </button>

          <Link
            to="/cart"
            className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-neutral-500 transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute right-[1.25rem] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#2d7c5f] text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
            <span>Cart</span>
          </Link>

          <NavLink to={mobileProfileTarget} className={mobileNavClass}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A9 9 0 1118.88 17.803M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>
    </>
  )
}

export default Header

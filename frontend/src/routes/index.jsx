import React from 'react'
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from '../components/common/Layout'
import Home from '../pages/Home'
import Products from '../pages/Products'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import OrderHistory from '../pages/OrderHistory'
import AdminDashboard from '../pages/AdminDashboard'
import NotFound from '../pages/NotFound'

// Placeholder pages - will be created in next phase
const PlaceholderPage = ({ name }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{name} Page</h1>
    <p>Coming soon...</p>
  </div>
)

function Routes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="*"
        element={
          <Layout>
            <RouterRoutes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/orders"
                element={isAuthenticated ? <OrderHistory /> : <Navigate to="/login" />}
              />
              <Route
                path="/admin"
                element={
                  isAuthenticated && user?.role === 'admin' ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </Layout>
        }
      />
    </RouterRoutes>
  )
}

export default Routes

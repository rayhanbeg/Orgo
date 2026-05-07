import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './redux/store'
import ScrollToTop from './utils/ScrollToTop'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/AdminDashboard'
import AdminProductEditor from './pages/AdminProductEditor'
import NotFound from './pages/NotFound'

function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <RouterRoutes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/products/new"
        element={
          isAuthenticated && user?.role === 'admin' ? (
            <AdminProductEditor />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/products/:id/edit"
        element={
          isAuthenticated && user?.role === 'admin' ? (
            <AdminProductEditor />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={<Layout />}
      >
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success/:orderId" element={<OrderSuccess />} />
        <Route path="orders/:id" element={<OrderSuccess />} />
        <Route
          path="profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="orders"
          element={isAuthenticated ? <OrderHistory /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </RouterRoutes>
  )
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <Provider store={store}>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App

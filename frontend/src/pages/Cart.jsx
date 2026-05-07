import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice'
import CartItemSkeleton from '../components/skeletons/CartItemSkeleton'

function Cart() {
  const dispatch = useDispatch()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }))
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container-fluid py-20">
        <h1 className="text-4xl font-bold text-neutral-950 mb-12">Your Cart</h1>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <CartItemSkeleton count={3} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 rounded-lg p-8">
                <div className="h-6 bg-gray-300 animate-pulse rounded mb-6 w-1/2"></div>
                <div className="space-y-4 mb-6">
                  <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
                </div>
                <div className="h-8 bg-gray-300 animate-pulse rounded mb-8"></div>
                <div className="h-12 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-neutral-600 mb-6 text-sm">Your cart is empty</p>
            <Link to="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Products List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-6 pb-6 border-b border-neutral-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover bg-neutral-100 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-neutral-950 mb-1">{item.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4">Size: Standard</p>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="border border-neutral-200 w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition text-sm font-medium rounded"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold px-3 min-w-[40px] text-center border border-neutral-200 rounded py-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="border border-neutral-200 w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition text-sm font-medium rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-950 text-base mb-4">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-sm text-neutral-600 hover:text-neutral-950 transition font-medium underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 rounded-lg p-8 sticky top-24">
                <h2 className="text-lg font-semibold text-neutral-950 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-700">Subtotal</span>
                    <span className="font-semibold text-neutral-950">৳{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-700">Shipping</span>
                    <span className="text-sm text-neutral-600">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="font-semibold text-neutral-950">Total</span>
                  <span className="text-2xl font-bold text-neutral-950">৳{totalPrice.toFixed(2)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="btn-primary w-full text-center block py-3"
                >
                  Checkout
                </Link>
                
                <p className="text-xs text-neutral-600 text-center mt-4">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

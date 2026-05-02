import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice'

function Cart() {
  const dispatch = useDispatch()
  const { items, totalPrice, totalQuantity } = useSelector((state) => state.cart)

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }))
    }
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-black mb-12">YOUR CART</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6 text-lg">Your cart is empty</p>
            <Link
              to="/products"
              className="btn-primary inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Products List */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-xs font-bold text-black tracking-wide">PRODUCT</h2>
                <h2 className="text-xs font-bold text-black tracking-wide">TOTAL</h2>
              </div>
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-6 pb-8 border-b border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{item.weight || ''}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="border border-gray-300 w-8 h-8 flex items-center justify-center hover:border-black transition text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="border border-gray-300 w-8 h-8 flex items-center justify-center hover:border-black transition text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black mb-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-xs font-semibold text-gray-600 hover:text-black transition underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-8">
                <h2 className="text-lg font-bold text-black mb-6">ORDER SUMMARY</h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-black">TOTAL</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">USD </span>
                    <span className="text-2xl font-bold text-black">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="btn-primary w-full text-center block mb-4"
                >
                  Checkout
                </Link>
                <p className="text-xs text-gray-600 text-center">
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

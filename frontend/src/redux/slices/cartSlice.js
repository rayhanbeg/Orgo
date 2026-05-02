import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  totalPrice: 0,
  totalQuantity: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((i) => i.productId === item.productId)

      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 })
      }

      localStorage.setItem('cart', JSON.stringify(state.items))
      calculateTotals(state)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
      calculateTotals(state)
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.productId === productId)

      if (item) {
        item.quantity = Math.max(1, quantity)
      }

      localStorage.setItem('cart', JSON.stringify(state.items))
      calculateTotals(state)
    },
    clearCart: (state) => {
      state.items = []
      state.totalPrice = 0
      state.totalQuantity = 0
      localStorage.removeItem('cart')
    },
  },
})

function calculateTotals(state) {
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0)
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

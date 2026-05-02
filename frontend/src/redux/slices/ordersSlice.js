import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
      state.loading = false
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload)
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex((o) => o._id === action.payload._id)
      if (index !== -1) {
        state.orders[index] = action.payload
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setError, setOrders, setSelectedOrder, addOrder, updateOrder, clearError } =
  ordersSlice.actions
export default ordersSlice.reducer

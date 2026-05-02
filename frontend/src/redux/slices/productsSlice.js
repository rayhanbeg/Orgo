import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    searchTerm: '',
    sortBy: 'newest',
  },
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setProducts: (state, action) => {
      state.products = action.payload
      state.filteredProducts = action.payload
      state.loading = false
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      applyFilters(state)
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

function applyFilters(state) {
  let filtered = [...state.products]

  if (state.filters.category) {
    filtered = filtered.filter((p) => p.category === state.filters.category)
  }

  if (state.filters.searchTerm) {
    const term = state.filters.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    )
  }

  if (state.filters.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (state.filters.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (state.filters.sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  state.filteredProducts = filtered
}

export const { setLoading, setError, setProducts, setSelectedProduct, setFilters, clearError } =
  productsSlice.actions
export default productsSlice.reducer

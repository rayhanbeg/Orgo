import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  sidebarOpen: false,
  loading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const id = Date.now()
      state.notifications.push({ id, ...action.payload })
      // Auto remove after 3 seconds
      setTimeout(() => {
        state.notifications = state.notifications.filter((n) => n.id !== id)
      }, 3000)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { addNotification, removeNotification, toggleSidebar, setSidebarOpen, setLoading } =
  uiSlice.actions
export default uiSlice.reducer

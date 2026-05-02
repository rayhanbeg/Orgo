import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setError, loginSuccess, logout as logoutAction } from '../redux/slices/authSlice'
import authService from '../services/authService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { token, user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const register = async (name, email, password) => {
    dispatch(setLoading(true))
    try {
      const data = await authService.register(name, email, password)
      dispatch(loginSuccess(data))
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed'
      dispatch(setError(errorMsg))
      return { success: false, error: errorMsg }
    }
  }

  const login = async (email, password) => {
    dispatch(setLoading(true))
    try {
      const data = await authService.login(email, password)
      dispatch(loginSuccess(data))
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      dispatch(setError(errorMsg))
      return { success: false, error: errorMsg }
    }
  }

  const googleAuth = async (email, name, googleId) => {
    dispatch(setLoading(true))
    try {
      const data = await authService.googleAuth(email, name, googleId)
      dispatch(loginSuccess(data))
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Google auth failed'
      dispatch(setError(errorMsg))
      return { success: false, error: errorMsg }
    }
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  return {
    register,
    login,
    googleAuth,
    logout,
    token,
    user,
    isAuthenticated,
    loading,
    error,
  }
}

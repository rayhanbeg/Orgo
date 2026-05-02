import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './redux/store'
import Routes from './routes'

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App

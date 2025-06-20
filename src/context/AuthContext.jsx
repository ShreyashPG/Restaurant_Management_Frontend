import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export const AuthContext = createContext()

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password })
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post('/users/signup', userData)
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/')
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
// src/components/ProtectedRoute.jsx
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
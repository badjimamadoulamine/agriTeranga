import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

/*
  ProtectedRoute guards dashboard routes by checking a specific token in localStorage.
  Props:
    - dashboard: 'admin' | 'producer' | 'delivery' | 'super-admin' | 'any'
    - children: ReactNode
*/
const tokenKeyByDashboard = {
  admin: 'adminDashboardToken',
  'super-admin': 'adminDashboardToken', // super admin uses same token storage
  producer: 'producerDashboardToken',
  delivery: 'deliveryDashboardToken',
  any: 'token'
}

export default function ProtectedRoute({ dashboard = 'any', children }) {
  const location = useLocation()
  const tokenKey = tokenKeyByDashboard[dashboard] || 'token'
  const hasToken = !!localStorage.getItem(tokenKey)

  if (!hasToken) {
    // Not authenticated for this dashboard → redirect to login, preserve where we came from
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

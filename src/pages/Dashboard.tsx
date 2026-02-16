import { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material'
import { useAuth } from '../utils/auth/authContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authApi, UserData } from '../utils/api/authApi'
import DashboardNav from '../components/DashboardNav'
import DashboardHome from './DashboardHome'
import PrinterJobs from './PrinterJobs'
import AdminUsers from './AdminUsers'
import AdminJobs from './AdminJobs'
import AdminCredits from './AdminCredits'

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const fetchedRef = useRef(false)

  useEffect(() => {
    document.title = 'Dashboard - Brick Dashboard'
  }, [])

  useEffect(() => {
    if (!token || fetchedRef.current) return
    fetchedRef.current = true

    const fetchUserData = async () => {
      try {
        const data = await authApi.getMe(token)
        setUserData(data)
      } catch (err: any) {
        console.error('Failed to fetch user data:', err)
        // API interceptor handles 401/403/500 errors
        // If we get here, it's a different error
        if (!err.response) {
          // Connection failure
          localStorage.setItem('serverError', 'true')
          window.location.href = '/error'
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [token])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <DashboardNav userData={userData} />
      
      <Routes>
        <Route path="/" element={<DashboardHome userData={userData} loading={loading} />} />
        <Route path="/printer/jobs" element={<PrinterJobs userData={userData} />} />
        <Route path="/printer/jobs/:jobId" element={<PrinterJobs userData={userData} />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/credits" element={<AdminCredits />} />
        <Route path="/admin/printers" element={<Box sx={{ padding: '32px' }} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  )
}

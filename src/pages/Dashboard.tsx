import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from '../utils/auth/authContext'
import { authApi } from '../utils/api/authApi'
import DashboardNav from '../components/DashboardNav'
import DashboardHome from './DashboardHome'
import PrinterJobs from './PrinterJobs'
import AdminJobs from './AdminJobs'
import AdminUsers from './AdminUsers'
import AdminCredits from './AdminCredits'
import UserSettings from './UserSettings'

export default function Dashboard() {
  const { token, user, setUser } = useAuth()
  const fetchedRef = useRef(false)

  useEffect(() => {
    document.title = 'Dashboard - Brick Dashboard'
  }, [])

  useEffect(() => {
    if (!token || fetchedRef.current) return
    fetchedRef.current = true

    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe(token)
        setUser(userData)
      } catch (err: any) {
        console.error('Failed to fetch user:', err.response?.data || err.message)
      }
    }

    fetchUser()
  }, [token, setUser])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      <DashboardNav userData={user} />
      <Box sx={{ paddingTop: '8px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<DashboardHome userData={user} />} />
           <Route path="/printer/jobs/:jobId" element={<PrinterJobs userData={user} />} />
           <Route path="/printer/jobs" element={<PrinterJobs userData={user} />} />
           <Route path="/admin/jobs" element={<AdminJobs />} />
           <Route path="/admin/users" element={<AdminUsers />} />
           <Route path="/admin/credits" element={<AdminCredits />} />
           <Route path="/settings" element={<UserSettings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Box>
  )
}

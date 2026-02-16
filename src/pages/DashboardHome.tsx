import { useEffect } from 'react'
import { Box, Container, Typography, CircularProgress } from '@mui/material'
import { UserData } from '../utils/api/authApi'

interface DashboardHomeProps {
  userData: UserData | null
  loading: boolean
}

export default function DashboardHome({ userData, loading }: DashboardHomeProps) {
  useEffect(() => {
    document.title = 'Dashboard - Brick Dashboard'
  }, [])
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!userData) {
    return (
      <Typography sx={{ color: '#94a3b8' }}>
        Failed to load user data
      </Typography>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: { xs: '32px', sm: '64px' }, paddingX: { xs: '12px', sm: '16px' } }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '16px',
            fontSize: { xs: '32px', sm: '48px' },
          }}
        >
          Hi, {userData.name || userData.email}
        </Typography>

        <Box sx={{ minHeight: '40px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          {loading ? (
            <CircularProgress size={32} sx={{ color: '#6366f1' }} />
          ) : (
            <Typography
              variant="h5"
              sx={{
                color: '#6366f1',
                fontSize: { xs: '24px', sm: '32px' },
                fontWeight: 600,
              }}
            >
              {userData.printer?.credits || 0} Credits
            </Typography>
          )}
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#94a3b8',
            fontSize: '16px',
          }}
        >
          {userData.email}
        </Typography>
      </Box>
    </Container>
  )
}

import { useEffect } from 'react'
import { Box, Container, Typography, Paper, Button, CircularProgress } from '@mui/material'
import { ArrowRight, Mail, Zap, Settings, Shield, Users, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../utils/api/authApi'

interface DashboardHomeProps {
  userData: UserData | null
}

export default function DashboardHome({ userData }: DashboardHomeProps) {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Dashboard - Brick Dashboard'
  }, [])

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingY: '64px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isAdmin = userData?.admin || userData?.superadmin
  const displayName = userData?.name || userData?.email.split('@')[0]

  return (
    <Box sx={{ backgroundColor: '#0f172a', paddingTop: { xs: '24px', sm: '48px' }, paddingBottom: { xs: '32px', sm: '48px' }, paddingX: { xs: '12px', sm: '24px' }, flex: 1 }}>
      <Container maxWidth="md" sx={{ paddingX: { xs: '0px', sm: '16px' } }}>
        {/* Header */}
          <Box sx={{ marginBottom: { xs: '32px', sm: '40px' } }}>
            <Box sx={{ marginBottom: '24px' }}>
              <Typography
                sx={{
                  fontSize: { xs: '36px', sm: '48px' },
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginBottom: '8px',
                }}
              >
                Welcome back, {displayName}!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: '#94a3b8' }} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    wordBreak: 'break-all',
                  }}
                >
                  {userData?.email}
                </Typography>
              </Box>
            </Box>

            {/* Credits Info Container */}
            <Paper
              sx={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                padding: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                borderRadius: '8px',
              }}
            >
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={16} style={{ color: '#6366f1' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Printing Credits
                </Typography>
                <Typography sx={{ fontSize: '18px', color: '#6366f1', fontWeight: 700 }}>
                  {userData.printer?.credits || 0} credits
                </Typography>
              </Box>
            </Paper>
          </Box>

        {/* Quick Links */}
        <Box sx={{ marginBottom: { xs: '40px', sm: '48px' } }}>
          <Typography
            sx={{
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '16px',
            }}
          >
            Quick Links
          </Typography>

          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
             <Button
              variant="outlined"
              startIcon={<Zap size={16} />}
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/dashboard/printer/jobs')}
              sx={{
                borderColor: '#334155',
                color: '#f1f5f9',
                textTransform: 'none',
                fontSize: '14px',
                padding: '10px 16px',
                '&:hover': {
                  borderColor: '#475569',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
             >
               My Print Jobs
             </Button>

             <Button
              variant="outlined"
              startIcon={<Settings size={16} />}
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/dashboard/settings')}
              sx={{
                borderColor: '#334155',
                color: '#f1f5f9',
                textTransform: 'none',
                fontSize: '14px',
                padding: '10px 16px',
                '&:hover': {
                  borderColor: '#475569',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
             >
               Settings
             </Button>
          </Box>
        </Box>

        {/* Admin Tools Section */}
        {isAdmin && (
          <Box sx={{ marginBottom: { xs: '56px', sm: '72px' } }}>
            <Box
              sx={{
                border: '2px dashed #f59e0b',
                borderRadius: '12px',
                padding: { xs: '16px', sm: '20px' },
                backgroundColor: 'rgba(245, 158, 11, 0.03)',
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '16px', sm: '18px' },
                  fontWeight: 600,
                  color: '#f59e0b',
                  marginBottom: '16px',
                }}
              >
                Admin Tools
              </Typography>

              <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                 <Button
                   variant="outlined"
                   startIcon={<Shield size={16} />}
                   endIcon={<ArrowRight size={16} />}
                   onClick={() => navigate('/dashboard/admin/jobs')}
                   sx={{
                     borderColor: '#f59e0b',
                     color: '#f59e0b',
                     textTransform: 'none',
                     fontSize: '14px',
                     padding: '10px 16px',
                     '&:hover': {
                       borderColor: '#fbbf24',
                       backgroundColor: 'rgba(245, 158, 11, 0.05)',
                     },
                   }}
                 >
                   Job Management
                 </Button>

                 <Button
                   variant="outlined"
                   startIcon={<Users size={16} />}
                   endIcon={<ArrowRight size={16} />}
                   onClick={() => navigate('/dashboard/admin/users')}
                   sx={{
                     borderColor: '#f59e0b',
                     color: '#f59e0b',
                     textTransform: 'none',
                     fontSize: '14px',
                     padding: '10px 16px',
                     '&:hover': {
                       borderColor: '#fbbf24',
                       backgroundColor: 'rgba(245, 158, 11, 0.05)',
                     },
                   }}
                 >
                   Users
                 </Button>
              </Box>
            </Box>
          </Box>
        )}


      </Container>
    </Box>
  )
}

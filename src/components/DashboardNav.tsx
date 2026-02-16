import { useState } from 'react'
import { Box, Button, Menu, MenuItem, Typography, Divider, IconButton } from '@mui/material'
import { Printer, LogOut, ChevronDown, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth/authContext'
import { authApi } from '../utils/api/authApi'

interface DashboardNavProps {
  userData: any
}

export default function DashboardNav({ userData }: DashboardNavProps) {
  const navigate = useNavigate()
  const { logout, token } = useAuth()
  const [adminAnchor, setAdminAnchor] = useState<null | HTMLElement>(null)

  const handleLogout = async () => {
    try {
      if (token) {
        await authApi.logout(token)
      }
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      logout()
      navigate('/login')
    }
  }

  const isAdmin = userData?.admin || userData?.superadmin

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
      gap: '24px',
      minHeight: '64px',
    }}>
      {/* Left: Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          minWidth: 'fit-content',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <Box
          component="img"
          src="/brick.png"
          alt="Logo"
          sx={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
          }}
          onError={(e: any) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            fontSize: { xs: '14px', sm: '16px' },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Brick Dashboard
        </Typography>
      </Box>

      {/* Center: Navigation Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        {/* Printer Button */}
        <Button
          onClick={() => navigate('/dashboard/printer/jobs')}
          sx={{
            color: '#94a3b8',
            textTransform: 'none',
            fontSize: { xs: '11px', sm: '13px' },
            padding: { xs: '4px 8px', sm: '6px 12px' },
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#f1f5f9',
            },
          }}
        >
          <Printer size={16} style={{ marginRight: '6px' }} />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Printer</Box>
        </Button>

        {/* Admin Menu (Admin Only) */}
        {isAdmin && (
          <>
            <Divider orientation="vertical" sx={{ height: '24px', backgroundColor: '#334155', display: { xs: 'none', sm: 'block' } }} />
            <Box
              sx={{
                border: '2px dashed #f59e0b',
                borderRadius: '8px',
                padding: { xs: '2px 4px', sm: '4px 8px' },
              }}
            >
              <Button
                onClick={(e) => setAdminAnchor(e.currentTarget)}
                endIcon={<ChevronDown size={16} />}
                sx={{
                  color: '#94a3b8',
                  textTransform: 'none',
                  fontSize: { xs: '11px', sm: '13px' },
                  padding: { xs: '4px 8px', sm: '6px 12px' },
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#f1f5f9',
                  },
                }}
              >
                <Shield size={16} style={{ marginRight: '6px' }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Admin</Box>
              </Button>
            </Box>
            <Menu
              anchorEl={adminAnchor}
              open={Boolean(adminAnchor)}
              onClose={() => setAdminAnchor(null)}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate('/dashboard/admin/jobs')
                  setAdminAnchor(null)
                }}
                sx={{ color: '#f1f5f9', '&:hover': { backgroundColor: '#334155' } }}
              >
                Approve Jobs
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Right: Logout (Distanced) */}
      <IconButton
        onClick={handleLogout}
        sx={{
          width: { xs: '36px', sm: '44px' },
          height: { xs: '36px', sm: '44px' },
          color: '#94a3b8',
          borderRadius: '8px',
          padding: '0',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
          },
        }}
      >
        <LogOut size={18} />
      </IconButton>
    </Box>
  )
}

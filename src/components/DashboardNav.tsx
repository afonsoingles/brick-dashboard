import { useState } from 'react'
import { Box, Button, Menu, MenuItem, Typography, IconButton } from '@mui/material'
import { LogOut, ChevronDown, Users } from 'lucide-react'
import Icon from '@hackclub/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/auth/authContext'
import { authApi } from '../utils/api/authApi'

interface DashboardNavProps {
  userData: any
}

export default function DashboardNav({ userData }: DashboardNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, token } = useAuth()
  const [adminAnchor, setAdminAnchor] = useState<null | HTMLElement>(null)

  const isOnPrintJobs = location.pathname.startsWith('/dashboard/printer')
  const isOnAdmin = location.pathname.startsWith('/dashboard/admin')

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
       <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
         {/* Print Jobs Button */}
         <Button
          onClick={() => !isOnPrintJobs && navigate('/dashboard/printer/jobs')}
          disableRipple
          startIcon={<Icon glyph="print" size={24} color="currentColor" />}
          sx={{
            color: isOnPrintJobs ? '#f1f5f9' : '#94a3b8',
            textTransform: 'none',
            fontSize: { xs: '11px', sm: '13px' },
            padding: { xs: '6px 10px', sm: '8px 14px' },
            borderRadius: '6px',
            cursor: isOnPrintJobs ? 'default' : 'pointer',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: isOnPrintJobs ? '#f1f5f9' : '#cbd5e1',
              backgroundColor: isOnPrintJobs ? 'transparent' : 'rgba(148, 163, 184, 0.08)',
            },
          }}
         >
           <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Print Jobs</Box>
         </Button>

         {/* Admin Menu (Admin Only) */}
         {isAdmin && (
           <>
             <Box
               sx={{
                 border: '2px dashed #f59e0b',
                 borderRadius: '8px',
                 padding: '2px',
               }}
             >
               <Button
                 onClick={(e) => setAdminAnchor(e.currentTarget)}
                 disableRipple
                 startIcon={<Icon glyph="admin" size={24} color="currentColor" />}
                 endIcon={<ChevronDown size={14} />}
                 sx={{
                   color: isOnAdmin ? '#fbbf24' : '#f59e0b',
                   textTransform: 'none',
                   fontSize: { xs: '11px', sm: '13px' },
                   padding: { xs: '6px 10px', sm: '8px 14px' },
                   borderRadius: '6px',
                   transition: 'color 0.2s ease',
                   '&:hover': {
                     color: '#fbbf24',
                     backgroundColor: isOnAdmin ? 'transparent' : 'rgba(245, 158, 11, 0.08)',
                   },
                 }}
               >
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
                   borderRadius: '8px',
                 },
                 '& .MuiMenuItem-root': {
                   color: '#f1f5f9',
                   fontSize: '13px',
                   '&:hover': {
                     backgroundColor: '#263449',
                   },
                 },
               }}
             >
               <MenuItem
                 onClick={() => {
                   navigate('/dashboard/admin/jobs')
                   setAdminAnchor(null)
                 }}
                 sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                 <Icon glyph="print" size={16} color="#6366f1" />
                 Job Management
               </MenuItem>
               <MenuItem
                 onClick={() => {
                   navigate('/dashboard/admin/users')
                   setAdminAnchor(null)
                 }}
                 sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                 <Users size={14} style={{ color: '#6366f1' }} />
                 Users
               </MenuItem>
             </Menu>
           </>
         )}
       </Box>

      {/* Right: Logout (Distanced) */}
      <IconButton
        onClick={handleLogout}
        disableRipple
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

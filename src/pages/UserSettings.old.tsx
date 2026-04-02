import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { UserData } from '../utils/api/authApi'
import { Save, X } from 'lucide-react'

interface UserSettingsProps {
  userData: UserData | null
}

export default function UserSettings({ userData }: UserSettingsProps) {
  useEffect(() => {
    document.title = 'Settings - Brick Dashboard'
  }, [])
  
  const [editingProfile, setEditingProfile] = useState(false)
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [successMessage, setSuccessMessage] = useState('')

  const isAdmin = userData?.admin || userData?.superadmin
  const isSuperadmin = userData?.superadmin

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSaveProfile = () => {
    console.log('Saving profile...', { name: formData.name })
    setEditingProfile(false)
    setSuccessMessage('Profile updated successfully')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      console.error('Passwords do not match')
      return
    }
    if (formData.currentPassword && formData.newPassword) {
      console.log('Changing password...')
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })
      setSuccessMessage('Password changed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }



  return (
    <Container maxWidth="sm" sx={{ paddingY: { xs: '16px', sm: '32px' }, paddingX: { xs: '12px', sm: '16px' } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '32px' }}>
        Settings
      </Typography>

      {/* Success Message */}
      {successMessage && (
        <Box sx={{
          backgroundColor: '#10b981',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: 500,
        }}>
          {successMessage}
        </Box>
      )}

      {/* Profile Section */}
      <Card sx={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        marginBottom: '24px',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#f1f5f9',
              }}
            >
              Profile Information
            </Typography>
            {!editingProfile && (
              <Button
                size="small"
                onClick={() => setEditingProfile(true)}
                sx={{
                  color: '#6366f1',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '4px 8px',
                }}
              >
                Edit
              </Button>
            )}
          </Box>

          {editingProfile ? (
            <>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f1f5f9',
                    borderColor: '#334155',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                disabled
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#94a3b8',
                    borderColor: '#334155',
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <Button
                  size="small"
                  onClick={() => {
                    setEditingProfile(false)
                    setFormData({ ...formData, name: userData?.name || '' })
                  }}
                  startIcon={<X size={14} />}
                  sx={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 12px',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSaveProfile}
                  startIcon={<Save size={14} />}
                  sx={{
                    backgroundColor: '#6366f1',
                    '&:hover': { backgroundColor: '#818cf8' },
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 12px',
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                disabled
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f1f5f9',
                    borderColor: '#334155',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                disabled
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#94a3b8',
                    borderColor: '#334155',
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card sx={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        marginBottom: '24px',
      }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '16px',
            }}
          >
            Change Password
          </Typography>

          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderColor: '#334155',
              },
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderColor: '#334155',
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderColor: '#334155',
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button
              size="small"
              onClick={() => setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })}
              sx={{
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
              }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleChangePassword}
              disabled={!formData.currentPassword || !formData.newPassword}
              sx={{
                backgroundColor: '#6366f1',
                '&:hover': { backgroundColor: '#818cf8' },
                '&:disabled': { backgroundColor: '#475569' },
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
              }}
            >
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Admin Section */}
      {isAdmin && (
        <Card sx={{
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          border: '2px dashed #f59e0b',
          marginBottom: '24px',
        }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#f59e0b',
                marginBottom: '16px',
              }}
            >
              Admin Settings
            </Typography>

            <Box sx={{ marginBottom: '16px' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
                Admin Privileges
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked disabled sx={{ color: '#6366f1' }} />}
                label={
                  <Typography sx={{ color: '#f1f5f9', fontSize: '14px' }}>
                    Admin
                  </Typography>
                }
              />
              {isSuperadmin && (
                <FormControlLabel
                  control={<Switch defaultChecked disabled sx={{ color: '#f59e0b' }} />}
                  label={
                    <Typography sx={{ color: '#f1f5f9', fontSize: '14px' }}>
                      Superadmin
                    </Typography>
                  }
                />
              )}
            </Box>


          </CardContent>
        </Card>
      )}
    </Container>
  )
}

// Dialog component for admin notes
export function AdminNotesDialog({ open, onClose, onSave }: any) {
  const [notes, setNotes] = useState('')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
        Admin Notes
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#1e293b', paddingTop: '16px' }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Notes"
          placeholder="Add admin notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#f1f5f9',
              borderColor: '#334155',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#1e293b', padding: '16px', gap: '8px' }}>
        <Button
          onClick={onClose}
          sx={{ color: '#94a3b8' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(notes)
            setNotes('')
          }}
          sx={{
            backgroundColor: '#6366f1',
            '&:hover': { backgroundColor: '#818cf8' },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

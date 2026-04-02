import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react'

interface PasswordStepProps {
  email: string
  onSubmit: (password: string) => Promise<void>
  onBack: () => void
  error?: string
}

export default function PasswordStep({ email, onSubmit, onBack, error: parentError }: PasswordStepProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setLoading(true)
    try {
      await onSubmit(password)
    } catch (err) {
      // Error already handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '2px' }}>
        Enter your password
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '10px' }}>
        {email}
      </Typography>

      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && password && !loading) {
            handleSubmit(e as any)
          }
        }}
        disabled={loading}
        autoFocus
        InputProps={{
          startAdornment: (
            <Lock
              size={20}
              style={{
                marginRight: '12px',
                color: '#64748b',
              }}
            />
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: '#f1f5f9',
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            '& fieldset': {
              borderColor: '#334155',
            },
            '&:hover fieldset': {
              borderColor: '#475569',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
          '& .MuiOutlinedInput-input::placeholder': {
            color: '#64748b',
            opacity: 1,
          },
        }}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={!password || loading}
        sx={{
          marginTop: '10px',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#6366f1',
          '&:hover': {
            backgroundColor: '#818cf8',
          },
          '&:disabled': {
            backgroundColor: '#475569',
          },
        }}
      >
        {loading ? <CircularProgress size={20} /> : 'Sign in'}
      </Button>

      <Button
        fullWidth
        variant="text"
        startIcon={<ArrowLeft size={20} />}
        onClick={onBack}
        sx={{
          marginTop: '6px',
          color: '#94a3b8',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        Back
      </Button>

      <Box sx={{ minHeight: '18px', marginTop: '6px', marginBottom: '0px', textAlign: 'center' }}>
        {parentError && (
          <Typography
            variant="caption"
            sx={{
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {parentError}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

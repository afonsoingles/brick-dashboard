import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Mail } from 'lucide-react'

interface EmailStepProps {
  onSubmit: (email: string) => void
  error?: string
}

export default function EmailStep({ onSubmit, error: parentError }: EmailStepProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const displayError = parentError || localError

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email')
      return
    }

    setLoading(true)
    setLocalError('')

    try {
      await onSubmit(email)
    } catch (err: any) {
      if (err.message === 'User not found') {
        setLocalError('Account not found. Please email the printer and wait ~2min and an account will be provisioned for you')
      } else {
        setLocalError('Not found')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ marginBottom: '2px', fontWeight: 600 }}>
        Sign in
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: '#94a3b8', marginBottom: '10px' }}
      >
        Enter your email to get started
      </Typography>

      <TextField
        fullWidth
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && email && !loading) {
            handleSubmit(e as any)
          }
        }}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <Mail
              size={20}
              style={{
                marginRight: '12px',
                color: '#64748b',
              }}
            />
          ),
          endAdornment: loading ? (
            <CircularProgress size={20} sx={{ marginRight: '8px' }} />
          ) : null,
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
        disabled={!email || loading}
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
        {loading ? 'Checking...' : 'Continue'}
      </Button>

      <Box sx={{ minHeight: '18px', marginTop: '6px', marginBottom: '0px', textAlign: 'center' }}>
        {displayError && (
          <Typography
            variant="caption"
            sx={{
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {displayError}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

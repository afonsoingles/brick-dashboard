import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material'
import { MessageSquare } from 'lucide-react'

interface OTPStepProps {
  email: string
  onSubmit: (code: string) => Promise<void>
  onRequestOTP: () => Promise<void>
  onBack: () => void
  error?: string
}

export default function OTPStep({ email, onSubmit, error: parentError }: OTPStepProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || code.length !== 6) return

    setLoading(true)
    try {
      await onSubmit(code)
    } catch (err) {
      // Error already handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '2px' }}>
        Enter the code
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '10px' }}>
        A code has been sent to {email}
      </Typography>

      <TextField
        fullWidth
        placeholder="000000"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && code.length === 6 && !loading) {
            handleSubmit(e as any)
          }
        }}
        disabled={loading}
        autoFocus
        inputProps={{
          maxLength: 6,
          style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' },
        }}
        InputProps={{
          startAdornment: (
            <MessageSquare
              size={20}
              style={{
                marginRight: '12px',
                color: '#64748b',
              }}
            />
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
        disabled={code.length !== 6 || loading}
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
        {loading ? <CircularProgress size={20} /> : 'Verify'}
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

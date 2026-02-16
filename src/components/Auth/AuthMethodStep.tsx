import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Radio,
  CircularProgress,
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'

interface AuthMethodStepProps {
  email: string
  methods: string[]
  onMethodSelect: (method: 'password' | 'otp') => void
  onBack: () => void
  error?: string
}

export default function AuthMethodStep({
  email,
  methods,
  onMethodSelect,
  onBack,
  error,
}: AuthMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<'password' | 'otp'>(() => 
    methods.length > 0 ? (methods[0] as 'password' | 'otp') : 'password'
  )
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    setLoading(true)
    try {
      await onMethodSelect(selectedMethod)
    } finally {
      setLoading(false)
    }
  }

  const methodOptions = methods || []

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '8px' }}>
        How do you want to sign in?
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '24px' }}>
        {email}
      </Typography>

      {methodOptions.length > 1 ? (
        <>
          <Box sx={{ marginBottom: '16px' }}>
            {methodOptions.map((method: string) => (
              <Box
                key={method}
                onClick={() => setSelectedMethod(method as 'password' | 'otp')}
                sx={{
                  padding: '12px 14px',
                  marginBottom: '8px',
                  border: `2px solid ${selectedMethod === method ? '#6366f1' : '#334155'}`,
                  borderRadius: '8px',
                  backgroundColor:
                    selectedMethod === method ? 'rgba(99, 102, 241, 0.15)' : '#0f172a',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: selectedMethod === method ? '#6366f1' : '#475569',
                    backgroundColor: selectedMethod === method ? 'rgba(99, 102, 241, 0.15)' : '#0f172a',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Radio 
                    checked={selectedMethod === method}
                    sx={{ color: '#6366f1', pointerEvents: 'none' }}
                  />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {method === 'password'
                        ? 'Password'
                        : 'One-Time Passcode'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', display: 'block' }}
                    >
                      {method === 'password'
                        ? 'Use your password to sign in'
                        : 'Receive a code via email'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleContinue}
            disabled={loading}
            sx={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#6366f1',
              '&:hover': {
                backgroundColor: '#818cf8',
              },
              '&:disabled': {
                backgroundColor: '#475569',
              },
              marginBottom: '8px',
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Continue'}
          </Button>
        </>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ marginBottom: '24px', color: '#94a3b8' }}>
            {methodOptions[0] === 'password'
              ? 'Sign in with your password'
              : 'Sign in with a one-time passcode sent to your email'}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleContinue}
            disabled={loading}
            sx={{
              padding: '12px',
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
            {loading ? <CircularProgress size={20} /> : 'Continue'}
          </Button>
        </Box>
      )}

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
        {error && (
          <Typography
            variant="caption"
            sx={{
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

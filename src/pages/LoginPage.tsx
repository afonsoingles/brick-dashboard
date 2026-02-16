import { useState, useEffect, useCallback } from 'react'
import { Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth/authContext'
import { authApi } from '../utils/api/authApi'
import EmailStep from '../components/Auth/EmailStep'
import AuthMethodStep from '../components/Auth/AuthMethodStep'
import PasswordStep from '../components/Auth/PasswordStep'
import OTPStep from '../components/Auth/OTPStep'

type LoginStep = 'email' | 'methods' | 'password' | 'otp'

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Sign In - Brick Dashboard'
  }, [])
  const navigate = useNavigate()
  const { login } = useAuth()

  const [currentStep, setCurrentStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [attemptId, setAttemptId] = useState('')
  const [error, setError] = useState('')
  const [authMethods, setAuthMethods] = useState<string[]>([])

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail)
    setError('')
    const methods = await authApi.checkAuthMethods(submittedEmail)
    setAuthMethods(methods.methods)
    if (methods.methods.length === 1) {
      const method = methods.methods[0]
      if (method === 'otp') {
        const otpResponse = await authApi.requestOTP(submittedEmail)
        setAttemptId(otpResponse.attempt_id)
      }
      setCurrentStep(method === 'password' ? 'password' : 'otp')
    } else {
      setCurrentStep('methods')
    }
  }

  const handleBack = () => {
    setError('')
    if (currentStep === 'methods') {
      setCurrentStep('email')
    } else if (currentStep === 'password' || currentStep === 'otp') {
      setCurrentStep('methods')
    }
  }

  const handleMethodSelect = async (method: 'password' | 'otp') => {
    setError('')
    if (method === 'otp') {
      try {
        const otpResponse = await authApi.requestOTP(email)
        setAttemptId(otpResponse.attempt_id)
      } catch (err: any) {
        console.error('Failed to request OTP:', err)
      }
    }
    setCurrentStep(method === 'password' ? 'password' : 'otp')
  }

  const handlePasswordSubmit = async (password: string) => {
    try {
      setError('')
      const { token } = await authApi.verifyPassword({ email, password })
      login(token, email)
      navigate('/dashboard')
    } catch (err: any) {
      const errorMsg = err.message === 'invalid_credentials'
        ? 'Invalid password'
        : 'An error occurred'
      setError(errorMsg)
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleOTPSubmit = async (code: string) => {
    try {
      setError('')
      const { token } = await authApi.verifyOTP({ id: attemptId, code })
      login(token, email)
      navigate('/dashboard')
    } catch (err: any) {
      const errorMsg = err.message === 'invalid_otp'
        ? 'Invalid OTP code'
        : 'An error occurred'
      setError(errorMsg)
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleOTPRequest = useCallback(async () => {
    try {
      await authApi.requestOTP(email)
    } catch (err: any) {
      console.error('Failed to request OTP:', err)
    }
  }, [email])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '16px',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '12px',
          }}
        >
          {/* Logo Space */}
          <Box
            sx={{
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src="/brick.png"
              alt="Brick Logo"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '8px',
              }}
              onError={(e: any) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '28px', fontWeight: 700, color: '#f1f5f9' }}>
              Brick Dashboard
            </Box>
          </Box>
        </Box>

        {/* Login Card */}
        <Box
          sx={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #334155',
            padding: { xs: '24px 20px', sm: '28px 24px' },
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >

          {currentStep === 'email' && (
            <EmailStep onSubmit={handleEmailSubmit} error={error} />
          )}
          {currentStep === 'methods' && (
            <AuthMethodStep
              email={email}
              methods={authMethods}
              onMethodSelect={handleMethodSelect}
              onBack={handleBack}
              error={error}
            />
          )}
          {currentStep === 'password' && (
            <PasswordStep
              email={email}
              onSubmit={handlePasswordSubmit}
              onBack={handleBack}
              error={error}
            />
          )}
          {currentStep === 'otp' && (
            <OTPStep
              email={email}
              onSubmit={handleOTPSubmit}
              onRequestOTP={handleOTPRequest}
              onBack={handleBack}
              error={error}
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

import { Box, Container, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function ErrorPage() {
  useEffect(() => {
    // Clear error state after 5 seconds
    const timer = setTimeout(() => {
      localStorage.removeItem('serverError')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

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
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        {/* Logo */}
        <Box
          sx={{
            width: '80px',
            height: '80px',
            margin: '0 auto 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            }}
            onError={(e: any) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </Box>

        {/* Logo Text */}
        <Typography
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            fontSize: '20px',
            marginBottom: '48px',
          }}
        >
          Brick Dashboard
        </Typography>

        {/* Error Code */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: '#ef4444',
            marginBottom: '16px',
            fontSize: '64px',
          }}
        >
          500
        </Typography>

        {/* Error Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '16px',
            fontSize: '28px',
          }}
        >
          Something went wrong
        </Typography>

        {/* Error Description */}
        <Typography
          variant="body1"
          sx={{
            color: '#94a3b8',
            fontSize: '16px',
            lineHeight: '1.6',
          }}
        >
          We are sorry, it looks like something went wrong. Please try again later.
        </Typography>
      </Container>
    </Box>
  )
}

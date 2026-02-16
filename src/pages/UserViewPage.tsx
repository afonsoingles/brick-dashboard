import { useEffect } from 'react'
import { Box, Container, Typography, Button, Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function UserViewPage() {
  useEffect(() => {
    document.title = 'User View - Brick Dashboard'
  }, [])
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingY: '20px' }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/dashboard')}
          sx={{ marginBottom: '20px' }}
        >
          Back to Dashboard
        </Button>

        <Paper sx={{ padding: '24px' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: '16px' }}>
            User #{id}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            User details coming soon...
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

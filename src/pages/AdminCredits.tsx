import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { Search, Edit } from 'lucide-react'

export default function AdminCredits() {
  useEffect(() => {
    document.title = 'Admin - Credit Management - Brick Dashboard'
  }, [])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Mock data
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', credits: 100, infinite: false },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', credits: 500, infinite: false },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', credits: 999, infinite: true },
  ])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditUser = (user: any) => {
    setSelectedUser({ ...user })
    setOpenDialog(true)
  }

  const handleSaveUser = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
    setOpenDialog(false)
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: '32px' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '24px' }}>
        Manage User Credits
      </Typography>

      <Box sx={{ marginBottom: '24px' }}>
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: '12px', color: '#64748b' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              color: '#f1f5f9',
            },
          }}
        />
      </Box>

      <Box sx={{
        border: '2px dashed #f59e0b',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
      }}>
        <Typography sx={{ color: '#f59e0b', fontSize: '14px', fontWeight: 600 }}>
          Global Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: '24px', marginTop: '12px', flexWrap: 'wrap' }}>
          <FormControlLabel
            control={<Switch defaultChecked sx={{ color: '#6366f1' }} />}
            label={
              <Typography sx={{ color: '#f1f5f9', fontSize: '14px' }}>
                Auto-reject if no credits
              </Typography>
            }
          />
          <FormControlLabel
            control={<Switch sx={{ color: '#6366f1' }} />}
            label={
              <Typography sx={{ color: '#f1f5f9', fontSize: '14px' }}>
                Mark pending if no credits
              </Typography>
            }
          />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#0f172a' }}>
              <TableCell sx={{ color: '#94a3b8' }}>Name</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Email</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Credits</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Infinite</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#263449' } }}>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.name}</TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.email}</TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.infinite ? '∞' : user.credits}</TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.infinite ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<Edit size={16} />}
                    onClick={() => handleEditUser(user)}
                    sx={{ color: '#6366f1' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
          Edit Credits - {selectedUser?.name}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b' }}>
          <Box sx={{ paddingTop: '12px' }}>
            <TextField
              fullWidth
              label="Credits"
              type="number"
              value={selectedUser?.credits || 0}
              onChange={(e) => setSelectedUser({ ...selectedUser, credits: parseInt(e.target.value) })}
              disabled={selectedUser?.infinite}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#f1f5f9',
                  borderColor: '#334155',
                },
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selectedUser?.infinite || false}
                  onChange={(e) => setSelectedUser({ ...selectedUser, infinite: e.target.checked })}
                  sx={{ color: '#6366f1' }}
                />
              }
              label={
                <Typography sx={{ color: '#f1f5f9' }}>
                  Allow infinite credits
                </Typography>
              }
              sx={{ marginTop: '16px' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b', padding: '16px' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            sx={{ backgroundColor: '#6366f1' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

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
} from '@mui/material'
import { Search, Trash2, Edit, Plus } from 'lucide-react'

export default function AdminUsers() {
  useEffect(() => {
    document.title = 'Admin - User Management - Brick Dashboard'
  }, [])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  // Mock data
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', admin: false, superadmin: false, credits: 100 },
    { id: '2', name: 'Jane Admin', email: 'jane@example.com', admin: true, superadmin: false, credits: 500 },
    { id: '3', name: 'Super Admin', email: 'super@example.com', admin: true, superadmin: true, credits: 999 },
  ])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: '32px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
          Manage Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: '#6366f1',
            '&:hover': { backgroundColor: '#818cf8' },
          }}
        >
          Add User
        </Button>
      </Box>

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

      <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#0f172a' }}>
              <TableCell sx={{ color: '#94a3b8' }}>Name</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Email</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Admin</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Credits</TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#263449' } }}>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.name}</TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.email}</TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>
                  {user.superadmin ? 'Superadmin' : user.admin ? 'Admin' : 'User'}
                </TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>{user.credits}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Button
                      size="small"
                      startIcon={<Edit size={16} />}
                      sx={{ color: '#6366f1' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => handleDelete(user.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Add New User</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b' }}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderColor: '#334155',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#64748b',
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderColor: '#334155',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b', padding: '16px' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ backgroundColor: '#6366f1' }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

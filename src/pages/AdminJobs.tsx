import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
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
  TextField,
  CircularProgress,
} from '@mui/material'
import { Check, X } from 'lucide-react'
import { printerApi } from '../utils/api/authApi'
import { useAuth } from '../utils/auth/authContext'

export default function AdminJobs() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    document.title = 'Admin - Job Management - Brick Dashboard'
  }, [])

  useEffect(() => {
    loadPendingJobs()
  }, [token])

  const loadPendingJobs = async () => {
    try {
      setLoading(true)
      if (!token) return
      const data = await printerApi.getPendingJobs(token, 1)
      setJobs(data || [])
    } catch (err: any) {
      console.error('Failed to load pending jobs:', err)
    } finally {
      setLoading(false)
    }
  }



  const handleApproveClick = async (jobId: string) => {
    if (!token) return
    try {
      setOperationLoading(true)
      await printerApi.approveJob(token, jobId)
      setJobs(jobs.filter(j => j.id !== jobId))
    } catch (err: any) {
      console.error('Failed to approve job:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleRejectClick = (jobId: string) => {
    setSelectedJobId(jobId)
    setOpenRejectDialog(true)
    setRejectionReason('')
  }

  const handleConfirmReject = async () => {
    if (!token || !selectedJobId || !rejectionReason.trim()) return
    try {
      setOperationLoading(true)
      await printerApi.rejectJob(token, selectedJobId, rejectionReason)
      setJobs(jobs.filter(j => j.id !== selectedJobId))
      setOpenRejectDialog(false)
      setRejectionReason('')
      setSelectedJobId(null)
    } catch (err: any) {
      console.error('Failed to reject job:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: { xs: '16px', sm: '32px' }, paddingX: { xs: '12px', sm: '16px' } }}>
      <Typography
        sx={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '24px', fontSize: { xs: '24px', sm: '32px' } }}
      >
        Pending Print Jobs
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Paper
          sx={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#94a3b8', fontSize: '16px' }}>
            No pending jobs
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0f172a' }}>
                <TableCell sx={{ color: '#94a3b8', width: '20%' }}>File Name</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '10%' }}>Pages</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '10%' }}>Cost</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '20%' }}>Submitted</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '40%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} sx={{ '&:hover': { backgroundColor: '#263449' } }}>
                  <TableCell sx={{ color: '#f1f5f9' }}>{job.file_name}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textAlign: 'center' }}>{job.pages}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textAlign: 'center' }}>{job.cost}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textAlign: 'center', fontSize: '12px' }}>
                    {new Date(job.created_at * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Check size={16} />}
                        disabled={operationLoading}
                        onClick={() => handleApproveClick(job.id)}
                        sx={{
                          backgroundColor: '#10b981',
                          '&:hover': { backgroundColor: '#059669' },
                          '&:disabled': { backgroundColor: '#475569' },
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<X size={16} />}
                        disabled={operationLoading}
                        onClick={() => handleRejectClick(job.id)}
                        sx={{
                          backgroundColor: '#ef4444',
                          '&:hover': { backgroundColor: '#dc2626' },
                          '&:disabled': { backgroundColor: '#475569' },
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#f1f5f9', paddingBottom: '8px' }}>
          Reject Job
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b', paddingTop: '24px' }}>
          <TextField
            fullWidth
            label="Rejection Reason"
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline
            rows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderColor: '#334155',
              },
              '& .MuiOutlinedInput-root:hover fieldset': {
                borderColor: '#475569',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b', padding: '16px', gap: '8px' }}>
          <Button
            onClick={() => setOpenRejectDialog(false)}
            sx={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReject}
            disabled={!rejectionReason.trim() || operationLoading}
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' },
              '&:disabled': { backgroundColor: '#475569' },
            }}
          >
            {operationLoading ? <CircularProgress size={16} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

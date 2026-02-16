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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  CircularProgress,
} from '@mui/material'
import { Info, Check, X, FileText, ArrowLeft, Search } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserData, printerApi } from '../utils/api/authApi'
import { useAuth } from '../utils/auth/authContext'

interface PrinterJobsProps {
  userData: UserData | null
}

export default function PrinterJobs({ userData }: PrinterJobsProps) {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = jobId ? `Job Details - Brick Dashboard` : `My Jobs - Brick Dashboard`
  }, [jobId])
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [operationLoading, setOperationLoading] = useState(false)

  const isAdmin = userData?.admin || userData?.superadmin
  const credits = userData?.printer?.credits || 0

  useEffect(() => {
    if (!jobId && token) {
      loadJobs()
    }
  }, [token, jobId])

  const loadJobs = async () => {
    try {
      setLoading(true)
      if (!token) return
      const data = await printerApi.getUserJobs(token, 1)
      setJobs(data || [])
    } catch (err: any) {
      console.error('Failed to load jobs:', err)
      // API interceptor handles 500 errors and redirects
      // This catch is for other error handling if needed
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10b981'
      case 'pending':
        return '#f59e0b'
      case 'rejected':
        return '#ef4444'
      default:
        return '#94a3b8'
    }
  }





  const handleApproveJob = async () => {
    if (!jobId || !token) return
    try {
      setOperationLoading(true)
      await printerApi.approveJob(token, jobId)
      setSelectedJob({ ...selectedJob, status: 'approved' })
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'approved' } : j))
      console.log('Job approved:', jobId)
    } catch (err) {
      console.error('Failed to approve job:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleRejectJob = async () => {
    if (!jobId || !token || !rejectionReason.trim()) return
    try {
      setOperationLoading(true)
      await printerApi.rejectJob(token, jobId, rejectionReason)
      setSelectedJob({ ...selectedJob, status: 'rejected', rejectionReason })
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'rejected', rejectionReason } : j))
      setOpenRejectDialog(false)
      setRejectionReason('')
      console.log('Job rejected:', jobId, 'Reason:', rejectionReason)
    } catch (err) {
      console.error('Failed to reject job:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  // Job Detail View
  if (jobId) {
    const job = jobs.find(j => j.id === jobId)

    if (!job) {
      return (
        <Container maxWidth="lg" sx={{ paddingY: { xs: '16px', sm: '32px' }, paddingX: { xs: '12px', sm: '16px' } }}>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/dashboard/printer/jobs')}
            sx={{
              color: '#6366f1',
              marginBottom: '16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#6366f1',
              },
            }}
          >
            Back to Jobs
          </Button>
          <Typography sx={{ color: '#ef4444' }}>Job not found</Typography>
        </Container>
      )
    }

    return (
      <Container maxWidth="lg" sx={{ paddingY: { xs: '16px', sm: '32px' }, paddingX: { xs: '12px', sm: '16px' } }}>
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/dashboard/printer/jobs')}
          sx={{
            color: '#6366f1',
            marginBottom: '24px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#6366f1',
            },
          }}
        >
          Back to Jobs
        </Button>

        <Box sx={{ marginBottom: { xs: '24px', sm: '32px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Typography
              sx={{ fontWeight: 700, color: '#f1f5f9', fontSize: { xs: '24px', sm: '32px' } }}
            >
              {job.file_name}
            </Typography>
            <Chip
              label={job.status}
              sx={{
                backgroundColor: getStatusColor(job.status),
                color: '#fff',
                textTransform: 'capitalize',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Job Details Card */}
        <Paper sx={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '24px', marginBottom: '32px' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: '24px' }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '4px' }}>
                File Name
              </Typography>
              <Typography variant="body1" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                {job.file_name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '4px' }}>
                Pages
              </Typography>
              <Typography variant="body1" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                {job.pages}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '4px' }}>
                Status
              </Typography>
              <Typography variant="body1" sx={{ color: '#f1f5f9', fontWeight: 500, textTransform: 'capitalize' }}>
                {job.status}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '4px' }}>
                Cost
              </Typography>
              <Typography variant="body1" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                {job.cost} Credits
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '4px' }}>
                Sent
              </Typography>
              <Typography variant="body1" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                {new Date(job.created_at * 1000).toLocaleString()}
              </Typography>
            </Box>

            {job.rejectionReason && (
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '4px' }}>
                  Rejection Reason
                </Typography>
                <Typography variant="body1" sx={{ color: '#ef4444', fontWeight: 600 }}>
                  {job.rejectionReason}
                </Typography>
              </Box>
            )}
          </Box>


        </Paper>

        {/* Admin Controls */}
        {isAdmin && job.status === 'pending' && (
          <Box
            sx={{
              border: '2px dashed #f59e0b',
              borderRadius: '8px',
              padding: { xs: '16px', sm: '24px' },
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              marginBottom: '32px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: '#f59e0b',
                marginBottom: '16px',
                fontSize: { xs: '14px', sm: '16px' },
              }}
            >
              Admin Controls
            </Typography>

            <Box sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              <Button
                variant="contained"
                startIcon={<Check size={14} />}
                onClick={handleApproveJob}
                disabled={operationLoading}
                sx={{
                  backgroundColor: '#10b981',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#059669',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    backgroundColor: '#475569',
                    color: '#94a3b8',
                  },
                }}
              >
                {operationLoading ? <CircularProgress size={14} /> : 'Approve'}
              </Button>
              <Button
                variant="contained"
                startIcon={<X size={14} />}
                onClick={() => setOpenRejectDialog(true)}
                disabled={operationLoading}
                sx={{
                  backgroundColor: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    backgroundColor: '#475569',
                    color: '#94a3b8',
                  },
                }}
              >
                Reject
              </Button>
            </Box>
          </Box>
        )}

        {/* File Retention Section (Admin only) */}
        {isAdmin && (
          <Box
            sx={{
              border: '2px dashed #f59e0b',
              borderRadius: '8px',
              padding: { xs: '16px', sm: '24px' },
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              marginBottom: '32px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: '#f59e0b',
                marginBottom: '16px',
                fontSize: { xs: '14px', sm: '16px' },
              }}
            >
              File Management
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                marginBottom: '12px',
                fontSize: '12px',
              }}
            >
              This file will be automatically deleted in 24 hours.
            </Typography>

            <Button
              variant="outlined"
              sx={{
                borderColor: '#f59e0b',
                color: '#f59e0b',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderColor: '#f59e0b',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Retain Beyond 24h
            </Button>
          </Box>
        )}

        {/* Raw Data Section (Admin only) */}
        {isAdmin && (
          <Box
            sx={{
              border: '2px dashed #f59e0b',
              borderRadius: '8px',
              padding: { xs: '16px', sm: '24px' },
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: '#f59e0b',
                marginBottom: '16px',
                fontSize: { xs: '14px', sm: '16px' },
              }}
            >
              Raw Job Data
            </Typography>

            <Paper sx={{ backgroundColor: '#1e293b', border: '1px solid #334155', overflow: 'auto' }}>
              <Box
                component="pre"
                sx={{
                  color: '#cbd5e1',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  overflow: 'auto',
                  margin: 0,
                  maxHeight: '300px',
                  padding: '16px',
                }}
              >
                {JSON.stringify(job, null, 2)}
              </Box>
            </Paper>
          </Box>
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
              onClick={handleRejectJob}
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

  // Jobs List View
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesFilter
  })

  return (
    <Container maxWidth="lg" sx={{ paddingY: { xs: '16px', sm: '32px' }, paddingX: { xs: '12px', sm: '16px' } }}>
      <Box sx={{ marginBottom: { xs: '24px', sm: '32px' } }}>
        <Typography
          sx={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '8px', fontSize: { xs: '24px', sm: '32px' } }}
        >
          Print Jobs
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', minHeight: '20px' }}>
          Credits remaining:{' '}
          {loading ? (
            <CircularProgress size={14} sx={{ color: '#6366f1', marginLeft: '4px' }} />
          ) : (
            <span style={{ color: '#6366f1', fontWeight: 600 }}>{credits}</span>
          )}
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: '12px',
        marginBottom: '24px',
      }}>
        <TextField
          fullWidth
          placeholder="Search by file name..."
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
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          SelectProps={{
            native: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              color: '#f1f5f9',
            },
            '& select': {
              color: '#f1f5f9',
              backgroundColor: '#1e293b',
            },
          }}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <CircularProgress />
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Paper sx={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          padding: '32px',
          textAlign: 'center',
        }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '16px' }}>
            No results found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0f172a' }}>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'left', width: '28%' }}>File Name</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '10%' }}>Pages</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '18%' }}>Status</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '22%' }}>Sent</TableCell>
                <TableCell sx={{ color: '#94a3b8', textAlign: 'left', width: '22%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} sx={{ '&:hover': { backgroundColor: '#263449' } }}>
                  <TableCell sx={{ color: '#f1f5f9', textAlign: 'left', width: '28%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ wordBreak: 'break-word' }}>{job.file_name}</span>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textAlign: 'center', width: '10%' }}>{job.pages}</TableCell>
                  <TableCell sx={{ textAlign: 'center', width: '18%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Chip
                        label={job.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(job.status),
                          color: '#fff',
                          textTransform: 'capitalize',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#f1f5f9', fontSize: '12px', textAlign: 'center', width: '22%' }}>
                    {new Date(job.created_at * 1000).toLocaleDateString()} {new Date(job.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', width: '22%' }}>
                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/dashboard/printer/jobs/${job.id}`)}
                        sx={{
                          width: '28px',
                          height: '28px',
                          color: '#94a3b8',
                          '&:hover': { color: '#6366f1' },
                        }}
                      >
                        <Info size={16} />
                      </IconButton>

                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

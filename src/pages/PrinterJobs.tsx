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
import { Info, Check, X, FileText, ArrowLeft, Search, Paperclip, Copy, Palette, Clock, AlertCircle, Printer, Eye, Download } from 'lucide-react'
import { PendingActions as PendingIcon } from '@mui/icons-material'
import Icon from '@hackclub/icons'
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
  const [showUpdateDecision, setShowUpdateDecision] = useState(false)
  const [decisionAction, setDecisionAction] = useState<'approve' | 'reject' | 'pending' | null>(null)
  const [openReasonModal, setOpenReasonModal] = useState(false)
  const [reasonModalTitle, setReasonModalTitle] = useState('')
  const [reasonModalDescription, setReasonModalDescription] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null)

  const isAdmin = userData?.admin || userData?.superadmin
  const credits = userData?.printer?.credits || 0

  useEffect(() => {
    if (!token) return
    if (jobId) {
      loadJobDetail(jobId, token)
    } else {
      loadJobs()
    }
  }, [token, jobId])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await printerApi.getUserJobs(token!, 1)
      setJobs(data || [])
    } catch (err: any) {
      console.error('Failed to load jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadJobDetail = async (id: string, authToken: string) => {
    try {
      setLoading(true)
      const data = await printerApi.getJob(authToken, id)
      setSelectedJob(data)
      setJobs([data])
    } catch (err: any) {
      console.error('Failed to load job:', err)
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
      case 'printed':
        return '#06b6d4'
      default:
        return '#94a3b8'
    }
  }





  const handleAdminDecision = async (decision: 'approve' | 'reject' | 'set_pending') => {
    if (!jobId || !token) return
    const reason = rejectionReason.trim()
    try {
      setOperationLoading(true)
      await printerApi.adminDecision(token, jobId, decision, reason)
      const statusMap = { approve: 'approved', reject: 'rejected', set_pending: 'pending' } as const
      const newStatus = statusMap[decision]
      
      // Create new log entry
      const logTypeMap = { approve: 'admin_approved_job', reject: 'admin_rejected_job', set_pending: 'admin_set_pending' } as const
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        actor: userData?.id || '',
        type: logTypeMap[decision],
        description: reason,
      }
      
      // Update job with new status and log
      const updatedJob = {
        ...selectedJob,
        status: newStatus,
        logs: [...(selectedJob.logs || []), newLog],
      }
      
      setSelectedJob(updatedJob)
      setJobs(jobs.map(j => j.id === jobId ? updatedJob : j))
      setOpenRejectDialog(false)
      setShowUpdateDecision(false)
      setDecisionAction(null)
      setRejectionReason('')
    } catch (err) {
      console.error(`Failed to ${decision} job:`, err)
    } finally {
      setOperationLoading(false)
    }
  }

  const handlePreviewClick = async () => {
    if (!jobId || !token) return
    try {
      setPreviewLoading(true)
      const { url } = await printerApi.getJobPreview(token, jobId)
      window.open(url, '_blank')
    } catch (err: any) {
      console.error('Failed to open preview:', err)
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleDownloadClick = async (id: string, filename: string) => {
    if (!token) return
    try {
      setDownloadingJobId(id)
      const { url } = await printerApi.getJobPreview(token, id, true)
      window.location.href = url
    } catch (err: any) {
      console.error('Failed to download file:', err)
    } finally {
      setDownloadingJobId(null)
    }
  }

  // Job Detail View
  if (jobId) {
    if (loading) {
      return (
        <Container maxWidth="lg" sx={{ paddingY: { xs: '16px', sm: '32px' }, paddingX: { xs: '12px', sm: '16px' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <CircularProgress />
          </Box>
        </Container>
      )
    }

    const job = jobs.length > 0 ? jobs[0] : null

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
              {job.filename}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', backgroundColor: getStatusColor(job.status) }}>
              {job.status === 'approved' ? (
                <Check size={14} style={{ color: '#fff' }} />
              ) : job.status === 'rejected' ? (
                <X size={14} style={{ color: '#fff' }} />
              ) : (
                <PendingIcon sx={{ fontSize: '14px', color: '#fff' }} />
              )}
              <Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                {job.status}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Job Details and Preview Container */}
        <Box sx={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'center' }}>
          {/* Job Details Card - Compact */}
          <Paper sx={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '12px', display: 'inline-block' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, max-content)' }, gap: '20px', alignItems: 'center' }}>
              {/* Copies */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Copy size={14} style={{ color: '#6366f1' }} />
                </Box>
                <Box>
                  <Typography sx={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1 }}>Copies</Typography>
                  <Typography sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: '12px' }}>{job.copies || 1}</Typography>
                </Box>
              </Box>

              {/* Mode */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Palette size={14} style={{ color: job.color ? '#10b981' : '#94a3b8' }} />
                </Box>
                <Box>
                  <Typography sx={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1 }}>Mode</Typography>
                  <Typography sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: '12px' }}>{job.color ? 'Color' : 'B/W'}</Typography>
                </Box>
              </Box>

              {/* Sent Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={14} style={{ color: '#6366f1' }} />
                </Box>
                <Box>
                  <Typography sx={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1 }}>Sent</Typography>
                  <Typography sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: '12px' }}>
                    {new Date(job.created_at).toLocaleDateString()} {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {job.rejectionReason && (
              <Box sx={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Box sx={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#ef4444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Rejection Reason</Typography>
                    <Typography sx={{ color: '#fca5a5', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>{job.rejectionReason}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
            </Paper>

          {/* Preview Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<Eye size={14} />}
            onClick={handlePreviewClick}
            disabled={previewLoading}
            sx={{
              backgroundColor: '#06b6d4',
              fontSize: '11px',
              fontWeight: 600,
              padding: '8px 16px',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              height: 'fit-content',
              '&:hover': {
                backgroundColor: '#0891b2',
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
            {previewLoading ? <CircularProgress size={14} /> : 'Preview'}
          </Button>
        </Box>

        {/* Job Timeline */}
        {job.logs && job.logs.length > 0 && (
          <Box sx={{ marginBottom: '32px' }}>
            <Typography sx={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase' }}>
              Job Timeline
            </Typography>
            <Box sx={{ position: 'relative', paddingLeft: '40px' }}>
              {/* Vertical line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '12px',
                  top: '30px',
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#334155',
                }}
              />

              {/* Timeline entries from logs */}
              {job.logs.map((log: any, idx: number) => {
                const getLogIcon = () => {
                   switch (log.type) {
                     case 'legacy':
                       return <Icon glyph="important" size={20} color="#f59e0b" />
                     case 'approved':
                     case 'admin_approved':
                     case 'admin_approved_job':
                       return <Check size={14} style={{ color: '#10b981' }} />
                     case 'rejected':
                     case 'admin_rejected':
                     case 'admin_rejected_job':
                       return <X size={14} style={{ color: '#ef4444' }} />
                     case 'admin_set_pending':
                       return <PendingIcon sx={{ fontSize: '14px', color: '#f59e0b' }} />
                     case 'job_created':
                       return <Paperclip size={14} style={{ color: '#6366f1' }} />
                     case 'job_printed':
                       return <Printer size={14} style={{ color: '#06b6d4' }} />
                     case 'created':
                       return <Paperclip size={14} style={{ color: '#6366f1' }} />
                     default:
                       return <PendingIcon sx={{ fontSize: '14px', color: '#94a3b8' }} />
                   }
                 }

                const getLogBorderColor = () => {
                   switch (log.type) {
                     case 'legacy':
                       return '#f59e0b'
                     case 'approved':
                     case 'admin_approved':
                     case 'admin_approved_job':
                       return '#10b981'
                     case 'rejected':
                     case 'admin_rejected':
                     case 'admin_rejected_job':
                       return '#ef4444'
                     case 'admin_set_pending':
                       return '#f59e0b'
                     case 'job_created':
                       return '#334155'
                     case 'job_printed':
                       return '#06b6d4'
                     case 'created':
                       return '#334155'
                     default:
                       return '#334155'
                   }
                 }

                const getLogDescription = () => {
                   switch (log.type) {
                     case 'admin_approved_job':
                       return 'An admin approved this print job'
                     case 'admin_rejected_job':
                       return 'An admin rejected this print job'
                     case 'admin_set_pending':
                       return 'This job was marked as pending'
                     case 'job_created':
                       return 'Print job created'
                     case 'job_printed':
                       return 'Print job has been printed'
                     default:
                       return log.description
                   }
                 }

                return (
                   <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: idx < job.logs.length - 1 ? '28px' : 0, position: 'relative' }}>
                     <Box
                       sx={{
                         position: 'absolute',
                         left: '-34px',
                         top: '0px',
                         width: '28px',
                         height: '28px',
                         borderRadius: '8px',
                         backgroundColor: '#0f172a',
                         border: `2px solid ${getLogBorderColor()}`,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                       }}
                     >
                       {getLogIcon()}
                     </Box>
                     <Box sx={{ flex: 1 }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <Typography sx={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
                           {getLogDescription()}
                         </Typography>
                         {(log.type === 'admin_approved_job' || log.type === 'admin_rejected_job' || log.type === 'admin_set_pending') && log.description?.trim() && (
                           <IconButton
                             size="small"
                             onClick={() => {
                               setReasonModalTitle(
                                 log.type === 'admin_approved_job'
                                   ? 'Admin approved your job'
                                   : log.type === 'admin_rejected_job'
                                   ? 'Admin rejected your job'
                                   : 'Admin set as pending'
                               )
                               setReasonModalDescription(log.description)
                               setOpenReasonModal(true)
                             }}
                             sx={{
                               width: '20px',
                               height: '20px',
                               color: '#6366f1',
                               '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
                               flexShrink: 0,
                               marginLeft: '-4px',
                             }}
                           >
                             <Info size={14} />
                           </IconButton>
                         )}
                       </Box>
                       <Typography sx={{ color: '#cbd5e1', fontSize: '12px', marginTop: '4px' }}>
                         {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </Typography>
                     </Box>
                   </Box>
                 )
              })}
            </Box>
          </Box>
        )}



        {/* Admin Options Section */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Box sx={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon glyph="admin" size={32} color="#000" />
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#f59e0b',
                  fontSize: { xs: '14px', sm: '16px' },
                }}
              >
                Admin Options
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              {job.status === 'printed' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
                  <Check size={14} style={{ color: '#06b6d4' }} />
                  <Typography sx={{ color: '#06b6d4', fontSize: '12px', fontWeight: 600 }}>
                    Printed — status cannot be changed
                  </Typography>
                </Box>
              ) : job.status === 'pending' || showUpdateDecision ? (
                <>
                  {/* Approve Button - hide if already approved */}
                  {job.status !== 'approved' && <Button
                    variant="contained"
                    startIcon={<Check size={14} />}
                    onClick={() => {
                      setDecisionAction('approve')
                      setOpenRejectDialog(true)
                    }}
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
                  </Button>}

                  {/* Reject Button - hide if already rejected */}
                  {job.status !== 'rejected' && (
                    <Button
                      variant="contained"
                      startIcon={<X size={14} />}
                      onClick={() => {
                        setDecisionAction('reject')
                        setOpenRejectDialog(true)
                      }}
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
                  )}

                  {/* Set to Pending Button - only shown when updating decision */}
                  {job.status !== 'pending' && showUpdateDecision && (
                    <Button
                      variant="contained"
                      startIcon={<AlertCircle size={14} />}
                      onClick={() => {
                        setDecisionAction('pending')
                        setOpenRejectDialog(true)
                      }}
                      disabled={operationLoading}
                      sx={{
                        backgroundColor: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '6px 12px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#d97706',
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
                      Set to Pending
                    </Button>
                  )}

                  {/* Cancel Button - shown when updating decision */}
                  {job.status !== 'pending' && showUpdateDecision && (
                    <Button
                      onClick={() => {
                        setShowUpdateDecision(false)
                        setDecisionAction(null)
                        setRejectionReason('')
                      }}
                      sx={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        textTransform: 'none',
                        padding: '4px 8px',
                        '&:hover': { color: '#f1f5f9' },
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px', backgroundColor: job.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : job.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                      {job.status === 'approved' ? (
                        <Check size={14} style={{ color: '#10b981' }} />
                      ) : job.status === 'rejected' ? (
                        <X size={14} style={{ color: '#ef4444' }} />
                      ) : (
                        <PendingIcon sx={{ fontSize: '14px', color: '#f59e0b' }} />
                      )}
                      <Typography sx={{ color: job.status === 'approved' ? '#10b981' : job.status === 'rejected' ? '#ef4444' : '#f59e0b', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                        {job.status}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    onClick={() => setShowUpdateDecision(true)}
                    sx={{
                      color: '#f59e0b',
                      fontSize: '11px',
                      textTransform: 'none',
                      padding: '4px 8px',
                      border: '1px solid #f59e0b',
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
                    }}
                  >
                    Update decision
                  </Button>
                </>
              )}
            </Box>

            {/* Raw Job Data */}
            <Box sx={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #475569' }}>
              <Typography sx={{ color: '#f59e0b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '12px' }}>
                Raw Job Data
              </Typography>
              <Paper sx={{ backgroundColor: '#0f172a', border: '1px solid #334155', overflow: 'auto' }}>
                <Box
                  component="pre"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    overflow: 'auto',
                    margin: 0,
                    maxHeight: '300px',
                    padding: '12px',
                  }}
                >
                  {JSON.stringify(job, null, 2)}
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Reason Modal - Show Decision Reason */}
        <Dialog open={openReasonModal} onClose={() => setOpenReasonModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' } }}>
          <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#f1f5f9', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box sx={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #334155' }}>
              <Info size={20} style={{ color: '#6366f1' }} />
            </Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
              {reasonModalTitle}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#1e293b', paddingTop: '16px' }}>
            <Typography sx={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {reasonModalDescription}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#1e293b', padding: '16px' }}>
            <Button 
              onClick={() => setOpenReasonModal(false)} 
              sx={{ 
                color: '#6366f1',
                textTransform: 'none',
                fontSize: '14px',
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Decision Reason Dialog */}
        <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#f1f5f9', paddingBottom: '8px' }}>
            {decisionAction === 'approve' ? 'Approve Job' : decisionAction === 'pending' ? 'Set to Pending' : 'Reject Job'}
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#1e293b', paddingTop: '24px' }}>
            <TextField
              fullWidth
              label="Reason"
              placeholder={decisionAction === 'approve' ? 'Enter reason for approval...' : decisionAction === 'pending' ? 'Enter reason for setting to pending...' : 'Enter reason for rejection...'}
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
              onClick={() => {
                setOpenRejectDialog(false)
                setDecisionAction(null)
                setRejectionReason('')
              }}
              sx={{ color: '#94a3b8' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (decisionAction) handleAdminDecision(decisionAction === 'pending' ? 'set_pending' : decisionAction)
              }}
              disabled={operationLoading}
              sx={{
                backgroundColor: decisionAction === 'approve' ? '#10b981' : decisionAction === 'pending' ? '#f59e0b' : '#ef4444',
                '&:hover': { backgroundColor: decisionAction === 'approve' ? '#059669' : decisionAction === 'pending' ? '#d97706' : '#dc2626' },
                '&:disabled': { backgroundColor: '#475569' },
              }}
            >
              {operationLoading ? <CircularProgress size={16} /> : (decisionAction === 'approve' ? 'Approve' : decisionAction === 'pending' ? 'Set to Pending' : 'Reject')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }

  // Jobs List View
  const filteredJobs = (jobs || []).filter(job => {
    if (!job) return false
    const matchesSearch = (job.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
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
          <option value="printed">Printed</option>
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
                <TableCell sx={{ color: '#94a3b8', textAlign: 'center', width: '10%' }}>Copies</TableCell>
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
                      <span style={{ wordBreak: 'break-word' }}>{job.filename || 'Unknown'}</span>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#f1f5f9', textAlign: 'center', width: '10%' }}>{job.copies || 1}</TableCell>
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
                    {new Date(job.created_at).toLocaleDateString()} {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadClick(job.id, job.filename)}
                        disabled={downloadingJobId === job.id}
                        sx={{
                          width: '28px',
                          height: '28px',
                          color: '#94a3b8',
                          '&:hover': { color: '#10b981' },
                          '&:disabled': { color: '#475569' },
                        }}
                      >
                        {downloadingJobId === job.id ? <CircularProgress size={16} /> : <Download size={16} />}
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

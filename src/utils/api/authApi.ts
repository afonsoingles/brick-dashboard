import axios from 'axios'

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_URL,
})

// Intercept responses to handle auth errors and server errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 Unauthorized - clear auth and redirect
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth token from context
      localStorage.removeItem('authToken')
      // Redirect to login
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    // Handle any 5xx server errors or connection failures
    if (error.response?.status >= 500 || !error.response) {
      // Store error state and redirect to error page
      localStorage.setItem('serverError', 'true')
      window.location.href = '/error'
      return Promise.reject(error)
    }
    
    return Promise.reject(error)
  }
)

export interface AuthMethod {
  method: 'password' | 'otp'
}

export interface CheckAuthMethodsResponse {
  email: string
  methods: string[]
  userId?: string
}

export interface PasswordAuthRequest {
  email: string
  password: string
}

export interface OTPAuthRequest {
  id: string
  code: string
}

export interface AuthResponse {
  token: string
  email: string
}

export interface UserData {
  id: string
  email: string
  [key: string]: any
}

export const authApi = {
  checkAuthMethods: async (email: string): Promise<CheckAuthMethodsResponse> => {
    const response = await apiClient.post('/v1/auth/methods', { email })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'User not found')
    }

    return {
      email,
      methods: response.data.methods,
      userId: response.data.userId,
    }
  },

  requestOTP: async (email: string): Promise<{ message: string; attempt_id: string }> => {
    const response = await apiClient.post('/v1/auth/otp/send', { email })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send OTP')
    }

    return { message: response.data.message, attempt_id: response.data.attempt_id }
  },

  verifyPassword: async (data: PasswordAuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/v1/auth/password', {
      email: data.email,
      password: data.password,
    })

    if (!response.data.success) {
      throw new Error(response.data.message === 'Invalid password.' ? 'invalid_credentials' : response.data.message)
    }

    return {
      token: response.data.token,
      email: data.email,
    }
  },

  verifyOTP: async (data: OTPAuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/v1/auth/otp/verify', {
      id: data.id,
      code: data.code,
    })

    if (!response.data.success) {
      throw new Error('invalid_otp')
    }

    return {
      token: response.data.token,
      email: '',
    }
  },

  getMe: async (token: string): Promise<UserData> => {
    const response = await apiClient.get('/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.data.success) {
      throw new Error('Failed to fetch user data')
    }

    return response.data.user
  },

  logout: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/v1/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  },
}

export const printerApi = {
  getUserJobs: async (token: string, page: number = 1): Promise<any> => {
    const response = await apiClient.get('/v1/printer/jobs', {
      params: { page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.data.success) {
      throw new Error('Failed to fetch jobs')
    }

    return response.data.data
  },

  getJob: async (token: string, jobId: string): Promise<any> => {
    const response = await apiClient.get(`/v1/printer/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  },

  approveJob: async (token: string, jobId: string): Promise<any> => {
    const response = await apiClient.post(`/v1/printer/jobs/${jobId}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to approve job')
    }

    return response.data
  },

  rejectJob: async (token: string, jobId: string, reason: string): Promise<any> => {
    const response = await apiClient.post(`/v1/printer/jobs/${jobId}/reject`, { reason }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to reject job')
    }

    return response.data
  },

  getPendingJobs: async (token: string, page: number = 1): Promise<any> => {
    const response = await apiClient.get('/v1/printer/jobs/pending', {
      params: { page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.data.success) {
      throw new Error('Failed to fetch pending jobs')
    }

    return response.data.data
  },
}

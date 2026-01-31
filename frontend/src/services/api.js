import axios from 'axios'

// ===== API CONFIGURATION =====
// Change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api'

// For production, change to:
// const API_BASE_URL = 'https://your-backend-domain.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server')
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// ===== AUTH API =====
export const authAPI = {
  // Send OTP
  sendOTP: async (data) => {
    try {
      // Ensure data is properly formatted as JSON object
      const payload = {
        email: data.email || null,
        rollNo: data.rollNo || null,
        userType: data.userType || 'student'
      }

      console.log('📤 Sending OTP request:', payload)

      const response = await api.post('/auth/send-otp', payload)
      console.log('✅ OTP Response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Send OTP Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to send OTP' }
    }
  },

  // Verify Email with OTP
  verifyEmail: async (email, otp, userType) => {
    try {
      // Ensure proper JSON object format with userType
      const payload = {
        email: email,
        otp: otp,
        userType: userType || 'student'
      }

      console.log('📤 Verifying OTP:', { email, otp: '******', userType })

      const response = await api.post('/auth/verify-email', payload)
      console.log('✅ Verify Response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Verify OTP Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'OTP verification failed' }
    }
  }
}

// ===== APPLICATION API =====
export const applicationAPI = {
  // Submit Application
  submit: async (formData) => {
    try {
      console.log('📤 Submitting application...')
      
      const response = await api.post('/applications/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('✅ Application submitted:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Submit Application Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Application submission failed' }
    }
  },

  // Get Application by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`)
      return response.data
    } catch (error) {
      console.error('❌ Get Application Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to fetch application' }
    }
  }
}

// ===== ADMIN API =====
export const adminAPI = {
  // Admin Login
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password })
      return response.data
    } catch (error) {
      console.error('❌ Admin Login Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Login failed' }
    }
  },

  // Get All Applications
  getApplications: async (filters = {}) => {
    try {
      const response = await api.get('/admin/applications', { params: filters })
      return response.data
    } catch (error) {
      console.error('❌ Get Applications Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to fetch applications' }
    }
  },

  // Get Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('❌ Get Stats Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to fetch stats' }
    }
  },

  // Update Application Status
  updateStatus: async (id, status, reason = null) => {
    try {
      const response = await api.patch(`/admin/applications/${id}/status`, {
        status,
        reason
      })
      return response.data
    } catch (error) {
      console.error('❌ Update Status Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to update status' }
    }
  },

  // Delete Application (Soft)
  softDelete: async (id) => {
    try {
      const response = await api.delete(`/admin/applications/${id}`, {
        data: { hardDelete: false }
      })
      return response.data
    } catch (error) {
      console.error('❌ Soft Delete Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to delete application' }
    }
  },

  // Delete Application (Hard)
  hardDelete: async (id) => {
    try {
      const response = await api.delete(`/admin/applications/${id}`, {
        data: { hardDelete: true }
      })
      return response.data
    } catch (error) {
      console.error('❌ Hard Delete Error:', error.response?.data || error.message)
      throw error.response?.data || { message: 'Failed to permanently delete application' }
    }
  }
}

export default api
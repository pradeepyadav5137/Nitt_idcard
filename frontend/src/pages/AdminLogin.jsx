import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import './Form.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotStep, setForgotStep] = useState('email') // email | otp
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await authAPI.adminLogin(username, password)
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('adminUser', JSON.stringify(response.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  const handleForgotSendOtp = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    try {
      await authAPI.adminForgotPassword(forgotEmail.trim())
      setForgotStep('otp')
    } catch (err) {
      setForgotError(err.message || 'Failed to send OTP')
    }
    setForgotLoading(false)
  }

  const handleForgotReset = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (!newPassword || newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters')
      return
    }
    setForgotLoading(true)
    try {
      await authAPI.adminResetPassword(forgotEmail.trim(), forgotOtp.trim(), newPassword)
      setShowForgot(false)
      setForgotStep('email')
      setForgotEmail('')
      setForgotOtp('')
      setNewPassword('')
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password')
    }
    setForgotLoading(false)
  }

  return (
    <div className="form-container">
      <div className="form-card" style={{ maxWidth: '400px' }}>
        <h2>Admin Login</h2>
        <p className="form-description">No registration – admins are added by existing admins.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" onClick={() => setShowForgot(true)} className="btn btn-link">
            Forgot password?
          </button>
        </form>
      </div>

      {showForgot && (
        <div className="form-card modal-overlay" style={{ maxWidth: '400px', marginTop: '20px' }}>
          <h3>Forgot password</h3>
          <p className="form-description">Enter your admin email. OTP will be sent to reset password.</p>
          {forgotError && <div className="error-message">{forgotError}</div>}
          {forgotStep === 'email' ? (
            <form onSubmit={handleForgotSendOtp}>
              <div className="form-group">
                <label>Admin email *</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={forgotLoading} className="btn btn-primary">
                  {forgotLoading ? 'Sending...' : 'Send OTP'}
                </button>
                <button type="button" onClick={() => { setShowForgot(false); setForgotError(''); }} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotReset}>
              <div className="form-group">
                <label>OTP sent to {forgotEmail}</label>
                <input
                  type="text"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.slice(0, 6))}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <div className="form-group">
                <label>New password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={forgotLoading} className="btn btn-primary">
                  {forgotLoading ? 'Resetting...' : 'Reset password'}
                </button>
                <button type="button" onClick={() => { setForgotStep('email'); setForgotError(''); }} className="btn btn-secondary">
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

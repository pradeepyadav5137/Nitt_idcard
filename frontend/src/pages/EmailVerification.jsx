'use client';

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { authAPI } from '../services/api'
import './Form.css'

export default function EmailVerification() {
  const { userType } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authAPI.sendOTP(email)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await authAPI.verifyEmail(email, otp)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('email', email)
      localStorage.setItem('userType', userType)

      // Navigate to appropriate form
      const formPath = {
        student: '/student-form',
        faculty: '/faculty-form',
        staff: '/staff-form'
      }[userType]

      navigate(formPath)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP')
    }
    setLoading(false)
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Email Verification</h2>
        <p className="form-description">Verify your email to continue with the application</p>

        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@nitt.edu"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">Enter 6-digit OTP *</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                required
              />
              <small>OTP sent to {email}</small>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1)
                setOtp('')
              }}
              className="btn btn-secondary"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

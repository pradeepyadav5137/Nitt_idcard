import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationAPI } from '../services/api'
import './Form.css'

export default function TrackApplication() {
  const [applicationId, setApplicationId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!applicationId.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await applicationAPI.getById(applicationId.trim())
      setResult(data.application)
    } catch (err) {
      setError(err.message || 'Application not found')
    }
    setLoading(false)
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Track Application</h2>
        <p className="form-description">Enter your Application ID to check its current status.</p>

        <form onSubmit={handleTrack}>
          <div className="form-group">
            <label>Application ID *</label>
            <input
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g. NITT-STU-2024-12345"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Tracking...' : 'Track Status'}
          </button>
        </form>

        {error && <div className="error-message" style={{ marginTop: '20px' }}>{error}</div>}

        {result && (
          <div className="info-box" style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3>Application Found</h3>
            <div className="detail-row" style={{ marginBottom: '10px' }}>
              <strong>Status:</strong>
              <span className={`status-badge status-${result.status}`} style={{ marginLeft: '10px' }}>
                {result.status}
              </span>
            </div>
            <div className="detail-row">
              <strong>Applicant:</strong> {result.name || result.staffName}
            </div>
            <div className="detail-row">
              <strong>Type:</strong> {result.userType}
            </div>
            <div className="detail-row">
              <strong>Submitted On:</strong> {new Date(result.createdAt).toLocaleDateString()}
            </div>

            {result.status === 'rejected' && result.rejectionReason && (
              <div className="error-message" style={{ marginTop: '15px' }}>
                <strong>Reason for Rejection:</strong> {result.rejectionReason}
              </div>
            )}

            {result.adminNotes && (
              <div className="info-box" style={{ marginTop: '15px', backgroundColor: '#edf2f7' }}>
                <strong>Message from Admin:</strong> {result.adminNotes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

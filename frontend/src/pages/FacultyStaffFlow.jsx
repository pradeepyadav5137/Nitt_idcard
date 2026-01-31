import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import StepIndicator from '../components/StepIndicator'
import { authAPI, applicationAPI } from '../services/api'
import './Form.css'

const STAFF_STEPS = ['Verification', 'Fill form', 'Preview & submit']

const formatDate = (v) => {
  if (!v) return ''
  try {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN')
  } catch {
    return v
  }
}

const generateStaffPdf = (data, userType) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
  doc.setFontSize(11)
  doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })
  doc.setFontSize(12)
  doc.text('STAFF APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
  doc.setFontSize(10)
  doc.text('(to be filled by the staff)', 105, 42, { align: 'center' })
  let y = 55
  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value || ''), 80, y)
    y += 7
  }
  addField('Name', data.staffName || data.name)
  addField('Staff No.', data.staffNo)
  addField('Designation', data.designation)
  addField('Title', data.title)
  addField('Department', data.department)
  addField('Gender', data.gender)
  addField('Blood Group', data.bloodGroup)
  addField('D.O.B', formatDate(data.dob))
  addField('Date of Joining', formatDate(data.joiningDate))
  addField('Contact No.', data.phone)
  addField('Email ID', data.email)
  addField('Request Category', data.requestCategory)
  addField('Reason / Details', data.reasonDetails)
  doc.save(`${data.staffNo || userType}_duplicate_id_application.pdf`)
}

export default function FacultyStaffFlow() {
  const { userType } = useParams() // 'faculty' or 'staff'
  const navigate = useNavigate()
  const type = userType === 'faculty' || userType === 'staff' ? userType : 'staff'

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationSubstep, setVerificationSubstep] = useState('email')
  const [verified, setVerified] = useState(false)
  const [lockedEmail, setLockedEmail] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    staffName: '',
    staffNo: '',
    designation: '',
    department: '',
    joiningDate: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    requestCategory: '',
    reasonDetails: ''
  })

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    const eMail = email.trim().toLowerCase()
    if (!eMail.endsWith('@nitt.edu')) {
      setError('Only @nitt.edu institute webmail is allowed')
      return
    }
    setLoading(true)
    try {
      await authAPI.sendOTP({ email: eMail, userType: type })
      setVerificationSubstep('otp')
      setLockedEmail(eMail)
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.verifyEmail({
        email: lockedEmail || email.trim().toLowerCase(),
        otp: otp.trim(),
        userType: type
      })
      localStorage.setItem('token', res.token)
      setVerified(true)
      setLockedEmail(res.email)
      setStep(1)
    } catch (err) {
      setError(err.message || 'Invalid OTP')
    }
    setLoading(false)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('userType', type)
      form.append('email', lockedEmail)
      Object.keys(formData).forEach((k) => {
        if (formData[k] != null && formData[k] !== '') form.append(k, formData[k])
      })
      const result = await applicationAPI.submit(form)
      const fullData = { ...formData, email: lockedEmail }
      generateStaffPdf(fullData, type)
      localStorage.removeItem('token')
      navigate(`/success/${result.applicationId}`)
    } catch (err) {
      setError(err.message || 'Submit failed')
    }
    setLoading(false)
  }

  const handleDownloadOnly = () => {
    const fullData = { ...formData, email: lockedEmail }
    generateStaffPdf(fullData, type)
  }

  if (step === 0) {
    return (
      <div className="form-container">
        <div className="form-card">
          <h2>{type === 'faculty' ? 'Faculty' : 'Staff'} – Verification</h2>
          <p className="form-description">Enter your institute webmail (@nitt.edu). OTP will be sent to this address.</p>
          {error && <div className="error-message">{error}</div>}
          {verificationSubstep === 'email' ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Institute webmail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@nitt.edu"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>OTP sent to {lockedEmail || email}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => { setVerificationSubstep('email'); setOtp(''); setError(''); }} className="btn btn-secondary">
                Change email
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="form-container">
        <StepIndicator current={2} total={3} labels={STAFF_STEPS} />
        <div className="form-card">
          <h2>{type === 'faculty' ? 'Faculty' : 'Staff'} – Fill form</h2>
          <p className="form-description">Email is locked. No documents required.</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Email (locked)</label>
              <input type="email" value={lockedEmail} readOnly disabled />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Title *</label>
                <select value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="Prof">Prof</option>
                  <option value="Dr">Dr</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                </select>
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={formData.staffName} onChange={(e) => setFormData((p) => ({ ...p, staffName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Staff No. *</label>
                <input type="text" value={formData.staffNo} onChange={(e) => setFormData((p) => ({ ...p, staffNo: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Designation *</label>
                <input type="text" value={formData.designation} onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select value={formData.department} onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Joining *</label>
                <input type="date" value={formData.joiningDate} onChange={(e) => setFormData((p) => ({ ...p, joiningDate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>D.O.B *</label>
                <input type="date" value={formData.dob} onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={formData.gender} onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select value={formData.bloodGroup} onChange={(e) => setFormData((p) => ({ ...p, bloodGroup: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Request Category *</label>
                <select value={formData.requestCategory} onChange={(e) => setFormData((p) => ({ ...p, requestCategory: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="Lost">Lost</option>
                  <option value="Damaged">Damaged</option>
                  <option value="New">New</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Reason/Details *</label>
              <textarea value={formData.reasonDetails} onChange={(e) => setFormData((p) => ({ ...p, reasonDetails: e.target.value }))} rows={4} required />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep(0)} className="btn btn-secondary">Back</button>
              <button type="submit" className="btn btn-primary">Continue to Preview</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <StepIndicator current={3} total={3} labels={STAFF_STEPS} />
      <div className="form-card">
        <h2>Preview & submit</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="preview-section">
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI</h3>
          <p style={{ textAlign: 'center', marginBottom: '8px' }}>STAFF APPLICATION FOR DUPLICATE IDENTITY CARD</p>
          <div className="preview-grid">
            <div><strong>Name:</strong> {formData.staffName}</div>
            <div><strong>Staff No.:</strong> {formData.staffNo}</div>
            <div><strong>Designation:</strong> {formData.designation}</div>
            <div><strong>Title:</strong> {formData.title}</div>
            <div><strong>Department:</strong> {formData.department}</div>
            <div><strong>Gender:</strong> {formData.gender}</div>
            <div><strong>D.O.B:</strong> {formatDate(formData.dob)}</div>
            <div><strong>Joining:</strong> {formatDate(formData.joiningDate)}</div>
            <div><strong>Contact:</strong> {formData.phone}</div>
            <div><strong>Email:</strong> {lockedEmail}</div>
            <div><strong>Request Category:</strong> {formData.requestCategory}</div>
            <div><strong>Reason:</strong> {formData.reasonDetails}</div>
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleDownloadOnly} className="btn btn-secondary">Download PDF</button>
          <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
          <button type="button" onClick={handleFinalSubmit} disabled={loading} className="btn btn-primary">
            {loading ? 'Submitting...' : 'Submit application'}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import StepIndicator from '../components/StepIndicator'
import { authAPI, applicationAPI } from '../services/api'
import './Form.css'
import './StudentFlow.css'

const STUDENT_STEPS = ['Verification', 'Fill form', 'Payment & documents', 'Preview & submit']

const formatDate = (v) => {
  if (!v) return ''
  try {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN')
  } catch {
    return v
  }
}

const generateStudentPdf = (data) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
  doc.setFontSize(11)
  doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })
  doc.setFontSize(12)
  doc.text('STUDENT APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
  doc.setFontSize(10)
  doc.text('(to be filled by the student)', 105, 42, { align: 'center' })
  let y = 55
  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value || ''), 80, y)
    y += 7
  }
  addField('Name of the Student', data.name)
  addField('Roll No.', data.rollNo)
  addField('Branch', data.branch)
  addField("Parent's Name", data.fatherName)
  addField('Blood Group', data.bloodGroup)
  addField('D.O.B', formatDate(data.dob))
  addField('Contact No.', data.phone)
  addField('Email ID', data.email)
  addField('Request Category', data.requestCategory)
  addField('Reason / Details', data.reasonDetails)
  doc.save(`${data.rollNo || 'student'}_duplicate_id_application.pdf`)
}

export default function StudentFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Verification (step 0)
  const [rollNo, setRollNo] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationSubstep, setVerificationSubstep] = useState('rollno') // rollno | otp
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState('') // locked after verify: rollno@nitt.edu

  // Form (step 1)
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    programme: '',
    branch: '',
    batch: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    parentMobile: '',
    requestCategory: '',
    reasonDetails: ''
  })
  const [photoFile, setPhotoFile] = useState(null)

  // Payment & docs (step 2)
  const [firFile, setFirFile] = useState(null)
  const [paymentFile, setPaymentFile] = useState(null)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.sendOTP({ rollNo: rollNo.trim(), userType: 'student' })
      setEmail(`${rollNo.trim().toLowerCase()}@nitt.edu`)
      setVerificationSubstep('otp')
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
        email: email || `${rollNo.trim().toLowerCase()}@nitt.edu`,
        otp: otp.trim(),
        userType: 'student'
      })
      localStorage.setItem('token', res.token)
      setVerified(true)
      setEmail(res.email)
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

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!firFile || !paymentFile) {
      setError('Please upload FIR copy and payment receipt')
      return
    }
    setError('')
    setStep(3)
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const form = new FormData()
      form.append('userType', 'student')
      form.append('email', email)
      form.append('rollNo', rollNo.trim().toLowerCase())
      Object.keys(formData).forEach((k) => {
        if (formData[k] != null && formData[k] !== '') form.append(k, formData[k])
      })
      if (photoFile) form.append('photo', photoFile)
      if (firFile) form.append('fir', firFile)
      if (paymentFile) form.append('payment', paymentFile)
      const result = await applicationAPI.submit(form)
      const fullData = { ...formData, rollNo: rollNo.trim(), email }
      generateStudentPdf(fullData)
      localStorage.removeItem('token')
      navigate(`/success/${result.applicationId}`)
    } catch (err) {
      setError(err.message || 'Submit failed')
    }
    setLoading(false)
  }

  const handleDownloadOnly = () => {
    const fullData = { ...formData, rollNo: rollNo.trim(), email }
    generateStudentPdf(fullData)
  }

  if (step === 0) {
    return (
      <div className="form-container student-flow">
        <div className="form-card">
          <h2>Student – Verification</h2>
          <p className="form-description">Enter your roll number. OTP will be sent to your institute webmail (rollno@nitt.edu).</p>
          {error && <div className="error-message">{error}</div>}
          {verificationSubstep === 'rollno' ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 106121001"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Sending OTP...' : 'Send OTP to rollno@nitt.edu'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>OTP sent to {email}</label>
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
              <button type="button" onClick={() => { setVerificationSubstep('rollno'); setOtp(''); setError(''); }} className="btn btn-secondary">
                Change roll number
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="form-container student-flow">
        <StepIndicator current={2} total={4} labels={STUDENT_STEPS} />
        <div className="form-card">
          <h2>Student – Fill form</h2>
          <p className="form-description">Roll number and email are locked. Fill other details and upload photo.</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Roll No. (locked)</label>
              <input type="text" value={rollNo} readOnly disabled />
            </div>
            <div className="form-group">
              <label>Email (locked)</label>
              <input type="email" value={email} readOnly disabled />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Father&apos;s Name *</label>
                <input type="text" value={formData.fatherName} onChange={(e) => setFormData((p) => ({ ...p, fatherName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Programme *</label>
                <select value={formData.programme} onChange={(e) => setFormData((p) => ({ ...p, programme: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="Ph.D">Ph.D</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>
              <div className="form-group">
                <label>Branch *</label>
                <select value={formData.branch} onChange={(e) => setFormData((p) => ({ ...p, branch: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Batch *</label>
                <input type="text" value={formData.batch} onChange={(e) => setFormData((p) => ({ ...p, batch: e.target.value }))} placeholder="e.g. 2024-2027" required />
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
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Parent/Guardian Mobile *</label>
                <input type="tel" value={formData.parentMobile} onChange={(e) => setFormData((p) => ({ ...p, parentMobile: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Request Category *</label>
                <select value={formData.requestCategory} onChange={(e) => setFormData((p) => ({ ...p, requestCategory: e.target.value }))} required>
                  <option value="">Select</option>
                  <option value="Lost">Lost</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Correction">Correction</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Reason/Details *</label>
              <textarea value={formData.reasonDetails} onChange={(e) => setFormData((p) => ({ ...p, reasonDetails: e.target.value }))} rows={4} required />
            </div>
            <div className="form-group">
              <label>Passport Photo * (JPG/PNG, max 5MB)</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} required />
              {photoFile && <small className="file-check">✓ {photoFile.name}</small>}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep(0)} className="btn btn-secondary">Back</button>
              <button type="submit" className="btn btn-primary">Continue to Payment & documents</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="form-container student-flow">
        <StepIndicator current={3} total={4} labels={STUDENT_STEPS} />
        <div className="form-card">
          <h2>Payment & documents</h2>
          <div className="payment-instructions">
            <h3>Payment via SBI Collect</h3>
            <ol>
              <li>Go to SBI Collect (onlinesbi.sbi) or the institute payment link.</li>
              <li>Select the correct product (ID card re-issue / duplicate ID).</li>
              <li>Enter the required amount (as per institute norms).</li>
              <li>Complete payment and download/save the receipt.</li>
              <li>Upload the FIR copy and payment receipt below.</li>
            </ol>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label>FIR copy * (PDF/JPG/PNG, max 5MB)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFirFile(e.target.files?.[0] || null)} required />
              {firFile && <small className="file-check">✓ {firFile.name}</small>}
            </div>
            <div className="form-group">
              <label>Payment receipt (SBI Collect) * (PDF/JPG/PNG, max 5MB)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} required />
              {paymentFile && <small className="file-check">✓ {paymentFile.name}</small>}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
              <button type="submit" className="btn btn-primary">Continue to Preview</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Step 3: Preview & submit
  return (
    <div className="form-container student-flow">
      <StepIndicator current={4} total={4} labels={STUDENT_STEPS} />
      <div className="form-card">
        <h2>Preview & submit</h2>
        <p className="form-description">Review your application. Submit and download the PDF.</p>
        {error && <div className="error-message">{error}</div>}
        <div className="preview-section">
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI</h3>
          <p style={{ textAlign: 'center', marginBottom: '8px' }}>STUDENT APPLICATION FOR DUPLICATE IDENTITY CARD</p>
          <div className="preview-grid">
            <div><strong>Name:</strong> {formData.name}</div>
            <div><strong>Roll No.:</strong> {rollNo}</div>
            <div><strong>Branch:</strong> {formData.branch}</div>
            <div><strong>Parent&apos;s Name:</strong> {formData.fatherName}</div>
            <div><strong>Blood Group:</strong> {formData.bloodGroup}</div>
            <div><strong>D.O.B:</strong> {formatDate(formData.dob)}</div>
            <div><strong>Contact:</strong> {formData.phone}</div>
            <div><strong>Email:</strong> {email}</div>
            <div><strong>Request Category:</strong> {formData.requestCategory}</div>
            <div><strong>Reason:</strong> {formData.reasonDetails}</div>
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleDownloadOnly} className="btn btn-secondary">Download PDF</button>
          <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
          <button type="button" onClick={handleFinalSubmit} disabled={loading} className="btn btn-primary">
            {loading ? 'Submitting...' : 'Submit application'}
          </button>
        </div>
      </div>
    </div>
  )
}



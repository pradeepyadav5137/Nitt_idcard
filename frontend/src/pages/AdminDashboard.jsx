'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { applicationAPI, adminAPI } from '../services/api'
import './Admin.css'

const FILE_BASE_URL = 'http://localhost:5000'

const formatDate = (value) => {
  if (!value) return ''
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString('en-IN')
  } catch {
    return value
  }
}

const generateStudentPdf = (app) => {
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
  const lineGap = 7
  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value || ''), 80, y)
    y += lineGap
  }

  addField('Application ID', app.applicationId)
  addField('Name of the Student', app.name)
  addField('Roll No.', app.rollNo)
  addField('Branch', app.branch)
  addField("Parent's Name", app.fatherName)
  addField('Blood Group', app.bloodGroup)
  addField('D.O.B', formatDate(app.dob))
  addField('Contact No.', app.phone)
  addField('Email ID', app.email)
  addField('Request Category', app.requestCategory)
  addField('Reason / Details', app.reasonDetails)
  addField('Status', app.status)

  const filename = `${app.applicationId || app.rollNo || 'student'}_duplicate_id_application.pdf`
  doc.save(filename)
}

const generateStaffPdf = (app) => {
  const doc = new jsPDF('p', 'mm', 'a4')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', 105, 20, { align: 'center' })
  doc.setFontSize(11)
  doc.text('TAMIL NADU, INDIA-620015', 105, 26, { align: 'center' })

  doc.setFontSize(12)
  doc.text('STAFF APPLICATION FOR DUPLICATE IDENTITY CARD', 105, 36, { align: 'center' })
  doc.setFontSize(10)
  doc.text('(DESIGNATION/OTHER OFFICIAL CHANGES)', 105, 42, { align: 'center' })
  doc.text('(to be filled by the staff)', 105, 48, { align: 'center' })

  let y = 60
  const lineGap = 7
  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value || ''), 80, y)
    y += lineGap
  }

  addField('Application ID', app.applicationId)
  addField('Name of the Staff', app.staffName || app.name)
  addField('Staff No.', app.staffNo)
  addField('Designation', app.designation)
  addField('Title', app.title)
  addField('Gender', app.gender)
  addField('Blood Group', app.bloodGroup)
  addField('Dept./ Section', app.department)
  addField('D.O.B', formatDate(app.dob))
  addField('Date of Joining', formatDate(app.joiningDate))
  addField('Date of Retirement', formatDate(app.retirementDate))
  addField('Contact No.', app.phone)
  addField('Email ID', app.email)
  addField('Request Category', app.requestCategory)
  addField('Reason / Details', app.reasonDetails)
  addField('Status', app.status)

  const filename = `${app.applicationId || app.staffNo || 'staff'}_duplicate_id_application.pdf`
  doc.save(filename)
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)
  const [action, setAction] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin-login')
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [appRes, statsRes] = await Promise.all([
        applicationAPI.getAll(),
        adminAPI.getStats()
      ])
      setApplications(appRes.data.applications || [])
      setStats(statsRes.data.stats)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  const handleApprove = async () => {
    try {
      await adminAPI.approve(selectedApp.applicationId, notes)
      setSelectedApp(null)
      setAction(null)
      setNotes('')
      fetchData()
    } catch (err) {
      alert('Error approving application')
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    try {
      await adminAPI.reject(selectedApp.applicationId, notes)
      setSelectedApp(null)
      setAction(null)
      setNotes('')
      fetchData()
    } catch (err) {
      alert('Error rejecting application')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      )}

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      <div className="applications-table">
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app._id}>
                <td>{app.applicationId}</td>
                <td>{app.userType === 'student' ? app.name : app.staffName}</td>
                <td>{app.email}</td>
                <td className="type-badge">{app.userType}</td>
                <td>
                  <span className={`status-badge ${app.status}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => {
                      setSelectedApp(app)
                      setAction(null)
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            <h3>Application Details</h3>
            <div className="app-details">
              <div><strong>ID:</strong> {selectedApp.applicationId}</div>
              <div><strong>Email:</strong> {selectedApp.email}</div>
              <div><strong>Phone:</strong> {selectedApp.phone}</div>
              <div><strong>Type:</strong> {selectedApp.userType}</div>
              <div><strong>Status:</strong> {selectedApp.status}</div>
              <div><strong>Created:</strong> {new Date(selectedApp.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="app-details">
              {selectedApp.userType === 'student' ? (
                <>
                  <div><strong>Name of the Student:</strong> {selectedApp.name}</div>
                  <div><strong>Roll No.:</strong> {selectedApp.rollNo}</div>
                  <div><strong>Branch:</strong> {selectedApp.branch}</div>
                  <div><strong>Parent&apos;s Name:</strong> {selectedApp.fatherName}</div>
                </>
              ) : (
                <>
                  <div><strong>Name of the Staff:</strong> {selectedApp.staffName || selectedApp.name}</div>
                  <div><strong>Staff No.:</strong> {selectedApp.staffNo}</div>
                  <div><strong>Designation:</strong> {selectedApp.designation}</div>
                  <div><strong>Title:</strong> {selectedApp.title}</div>
                  <div><strong>Dept./ Section:</strong> {selectedApp.department}</div>
                </>
              )}
              <div><strong>Blood Group:</strong> {selectedApp.bloodGroup}</div>
              <div><strong>D.O.B:</strong> {formatDate(selectedApp.dob)}</div>
              <div><strong>Request Category:</strong> {selectedApp.requestCategory}</div>
              <div><strong>Reason / Details:</strong> {selectedApp.reasonDetails}</div>
            </div>

            <div className="app-details">
              <h4>Uploaded Documents</h4>
              {selectedApp.photoPath && (
                <div className="doc-row">
                  <strong>Photo:</strong>
                  <img
                    src={`${FILE_BASE_URL}/uploads/${selectedApp.photoPath}`}
                    alt="Applicant"
                    style={{ maxWidth: '120px', maxHeight: '150px', display: 'block', marginTop: '8px' }}
                  />
                </div>
              )}
              {selectedApp.firPath && (
                <div className="doc-row">
                  <strong>FIR Copy:</strong>{' '}
                  <a
                    href={`${FILE_BASE_URL}/uploads/${selectedApp.firPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View FIR
                  </a>
                </div>
              )}
              {selectedApp.paymentPath && (
                <div className="doc-row">
                  <strong>Payment Receipt:</strong>{' '}
                  <a
                    href={`${FILE_BASE_URL}/uploads/${selectedApp.paymentPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginTop: '15px', marginBottom: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (!selectedApp) return
                  if (selectedApp.userType === 'student') {
                    generateStudentPdf(selectedApp)
                  } else {
                    generateStaffPdf(selectedApp)
                  }
                }}
              >
                Download Application PDF
              </button>
            </div>

            {selectedApp.status === 'pending' && (
              <>
                {!action ? (
                  <div className="action-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={() => setAction('approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setAction('reject')}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="action-form">
                    <label>
                      {action === 'approve' ? 'Approval Notes' : 'Reason for Rejection'} {action === 'reject' && '*'}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={action === 'reject' ? 'Please provide reason for rejection' : 'Add any notes...'}
                      rows="3"
                    />
                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                      <button
                        className="btn btn-primary"
                        onClick={action === 'approve' ? handleApprove : handleReject}
                      >
                        {action === 'approve' ? 'Approve' : 'Reject'}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setAction(null)
                          setNotes('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

'use client';

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Form.css'

export default function FacultyForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    staffName: '',
    staffNo: '',
    designation: '',
    department: '',
    joiningDate: '',
    email: localStorage.getItem('email') || '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    requestCategory: '',
    reasonDetails: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('formData', JSON.stringify(formData))
    navigate('/upload-documents')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Faculty Application Form</h2>
        <p className="form-description">Please fill in all required fields marked with *</p>

        <form onSubmit={handleSubmit}>
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <select name="title" value={formData.title} onChange={handleChange} required>
                <option value="">Select Title</option>
                <option value="Prof">Prof</option>
                <option value="Dr">Dr</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
              </select>
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="staffName"
                value={formData.staffName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Staff Number *</label>
              <input
                type="text"
                name="staffNo"
                value={formData.staffNo}
                onChange={handleChange}
                placeholder="Enter staff number"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>

          <h3>Employment Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., Assistant Professor"
                required
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics and Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Joining *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3>Request Details</h3>
          <div className="form-grid full">
            <div className="form-group">
              <label>Request Category *</label>
              <select name="requestCategory" value={formData.requestCategory} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Lost">Lost</option>
                <option value="Damaged">Damaged</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>
          <div className="form-grid full">
            <div className="form-group">
              <label>Reason/Details *</label>
              <textarea
                name="reasonDetails"
                value={formData.reasonDetails}
                onChange={handleChange}
                placeholder="Please specify the reason"
                rows="4"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              Continue to Upload Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

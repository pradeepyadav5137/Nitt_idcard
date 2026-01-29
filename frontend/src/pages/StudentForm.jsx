'use client';

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Form.css'

export default function StudentForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    fatherName: '',
    programme: '',
    branch: '',
    batch: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    email: localStorage.getItem('email') || '',
    phone: '',
    parentMobile: '',
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
        <h2>Student Application Form</h2>
        <p className="form-description">Please fill in all required fields marked with *</p>

        <form onSubmit={handleSubmit}>
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g., 106121001"
                required
              />
            </div>

            <div className="form-group">
              <label>Father's Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Enter father's name"
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
              <label>Parent/Guardian Mobile *</label>
              <input
                type="tel"
                name="parentMobile"
                value={formData.parentMobile}
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
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <h3>Academic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Programme *</label>
              <select name="programme" value={formData.programme} onChange={handleChange} required>
                <option value="">Select Programme</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="Ph.D">Ph.D</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <div className="form-group">
              <label>Branch *</label>
              <select name="branch" value={formData.branch} onChange={handleChange} required>
                <option value="">Select Branch</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics and Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label>Batch *</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g., 2024-2027"
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
                <option value="Correction">Correction</option>
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

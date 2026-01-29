'use client';

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Form.css'

export default function FileUpload() {
  const navigate = useNavigate()
  const userType = localStorage.getItem('userType')
  const [files, setFiles] = useState({
    photo: null,
    fir: null,
    payment: null
  })
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    if (fileList.length > 0) {
      const file = fileList[0]
      if (file.size > 5 * 1024 * 1024) {
        setError(`${name} file size exceeds 5MB limit`)
        return
      }
      setFiles(prev => ({ ...prev, [name]: file }))
      setError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!files.photo) {
      setError('Please upload a photo')
      return
    }

    if (!files.fir) {
      setError('Please upload FIR/Lost document report')
      return
    }

    if (userType !== 'faculty' && !files.payment) {
      setError('Please upload payment receipt')
      return
    }

    localStorage.setItem('uploadedFiles', JSON.stringify({
      photo: files.photo,
      fir: files.fir,
      payment: files.payment
    }))

    navigate('/preview')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Upload Documents</h2>
        <p className="form-description">Please upload all required documents</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="photo">Passport Photo * (JPG, PNG - Max 5MB)</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              required
            />
            {files.photo && <small className="file-check">✓ {files.photo.name}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="fir">FIR Copy / Lost Document Report * (PDF, JPG, PNG - Max 5MB)</label>
            <input
              type="file"
              id="fir"
              name="fir"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            {files.fir && <small className="file-check">✓ {files.fir.name}</small>}
          </div>

          {userType !== 'faculty' && (
            <div className="form-group">
              <label htmlFor="payment">Payment Receipt - Rs. 500 * (PDF, JPG, PNG - Max 5MB)</label>
              <input
                type="file"
                id="payment"
                name="payment"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              {files.payment && <small className="file-check">✓ {files.payment.name}</small>}
            </div>
          )}

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              Review Application
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

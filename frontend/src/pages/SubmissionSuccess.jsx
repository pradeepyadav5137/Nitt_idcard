'use client';

import { Link, useParams } from 'react-router-dom'
import './Success.css'

export default function SubmissionSuccess() {
  const { applicationId } = useParams()

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Application Submitted Successfully!</h2>
        <p>Your application has been received and is under review.</p>

        <div className="app-id-box">
          <div className="label">Application ID</div>
          <div className="app-id">{applicationId}</div>
          <small>Please save this ID for future reference and tracking</small>
        </div>

        <div className="next-steps">
          <h3>What&apos;s Next?</h3>
          <ol>
            <li>Your application will be reviewed by the administration</li>
            <li>You will receive an email notification once your application is processed</li>
            <li>Collect your ID card from the institute counter after approval</li>
          </ol>
        </div>

        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  )
}

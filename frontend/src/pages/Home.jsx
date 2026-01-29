import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h2>Institute ID Card Re-issue Application</h2>
        <p>Apply for a duplicate ID card through our online portal</p>
        <div className="role-cards">
          <Link to="/verify-email/student" className="role-card">
            <div className="role-icon">👨‍🎓</div>
            <h3>Student</h3>
            <p>For B.Tech, M.Tech, Ph.D students</p>
          </Link>
          <Link to="/verify-email/faculty" className="role-card">
            <div className="role-icon">👨‍🏫</div>
            <h3>Faculty</h3>
            <p>For teaching staff and faculty members</p>
          </Link>
          <Link to="/verify-email/staff" className="role-card">
            <div className="role-icon">👔</div>
            <h3>Staff</h3>
            <p>For administrative and support staff</p>
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Email Verification</h4>
            <p>Verify your email with OTP</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Fill Details</h4>
            <p>Complete your application form</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Upload Documents</h4>
            <p>Submit required documents and photos</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Submit Application</h4>
            <p>Review and submit your application</p>
          </div>
        </div>
      </section>

      <section className="info">
        <h2>Required Documents</h2>
        <div className="requirements">
          <div className="req-item">
            <h4>Passport Photo</h4>
            <p>4x6 cm, recent color photograph</p>
          </div>
          <div className="req-item">
            <h4>FIR/Lost Report</h4>
            <p>Copy of FIR or lost document report</p>
          </div>
          <div className="req-item">
            <h4>Payment Receipt</h4>
            <p>Proof of payment (Students & Staff)</p>
          </div>
        </div>
      </section>
    </div>
  )
}

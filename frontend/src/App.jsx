import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import EmailVerification from './pages/EmailVerification'
import StudentForm from './pages/StudentForm'
import FacultyForm from './pages/FacultyForm'
import StaffForm from './pages/StaffForm'
import FileUpload from './pages/FileUpload'
import ApplicationPreview from './pages/ApplicationPreview'
import SubmissionSuccess from './pages/SubmissionSuccess'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify-email/:userType" element={<EmailVerification />} />
          <Route path="/student-form" element={<StudentForm />} />
          <Route path="/faculty-form" element={<FacultyForm />} />
          <Route path="/staff-form" element={<StaffForm />} />
          <Route path="/upload-documents" element={<FileUpload />} />
          <Route path="/preview" element={<ApplicationPreview />} />
          <Route path="/success/:applicationId" element={<SubmissionSuccess />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App

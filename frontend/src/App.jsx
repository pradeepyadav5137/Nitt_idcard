// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Header from './components/Header'
// import Home from './pages/Home'
// import StudentFlow from './pages/StudentFlow'
// import FacultyStaffFlow from './pages/FacultyStaffFlow'
// import SubmissionSuccess from './pages/SubmissionSuccess'
// import AdminLogin from './pages/AdminLogin'
// import AdminDashboard from './pages/AdminDashboard'
// import './App.css'

// function App() {
//   return (
//     <Router>
//       <Header />
//       <main className="app-container">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/apply/student" element={<StudentFlow />} />
//           <Route path="/apply/staff" element={<FacultyStaffFlow />} />
//           <Route path="/apply/faculty" element={<FacultyStaffFlow />} />
//           <Route path="/success/:applicationId" element={<SubmissionSuccess />} />
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         </Routes>
//       </main>
//     </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EmailVerification from './pages/EmailVerification'
import StudentForm from './pages/StudentForm'
import FileUpload from './pages/FileUpload'
// In your App.jsx, add this route
// import Preview from './pages/Preview'

// Inside your Routes component

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes wrapped in Layout for Header + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/apply/:userType" element={<EmailVerification />} />
          <Route path="/student-form" element={<StudentForm />} />
          <Route path="/upload-documents" element={<FileUpload />} />
          {/* <Route path="/preview" element={<Preview />} /> */}
         
        </Route>
      </Routes>
    </Router>
  )
}

export default App

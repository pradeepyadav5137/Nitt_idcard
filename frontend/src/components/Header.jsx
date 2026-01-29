import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>NITT ID Card</h1>
          <p>Re-issue Portal</p>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/admin-login">Admin</Link>
        </nav>
      </div>
    </header>
  )
}

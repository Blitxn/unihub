import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../contact.css";

export default function Contactpage() {
  const navigate = useNavigate();
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  // Logged-in user, read from localStorage (set by LoginModal on login/register)
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Could not parse stored user', e);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setDropdownActive(false);
    navigate('/');
  };

  return (
    <div className="contact-page">
      <header className="header">
        <div className="logo">UNIHUB</div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Universities</Link>
          <Link to="/scholarships" className="nav-link">Scholarships</Link>
          <Link to="/career" className="nav-link">Career</Link>
          <Link to="/contact" className="nav-link active">Contact</Link>
        </nav>

        <div className="avatar-container" ref={dropdownRef}>
          <div className="avatar" onClick={() => setDropdownActive(!dropdownActive)}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.2)"/>
              <circle cx="18" cy="14" r="6" fill="rgba(255,255,255,0.85)"/>
              <ellipse cx="18" cy="30" rx="10" ry="6" fill="rgba(255,255,255,0.85)"/>
            </svg>
          </div>

          <div className={`profile-dropdown ${dropdownActive ? 'active' : ''}`}>
            <div className="dropdown-header">
              <p className="user-name">{currentUser?.name || 'Unihub User'}</p>
              <p className="user-email">{currentUser?.email || 'student@unihub.edu'}</p>
            </div>
            <div className="dropdown-divider"></div>
            <a href="#profile" className="dropdown-item">My Profile</a>
            <a href="#settings" className="dropdown-item">Account Settings</a>
            <div className="dropdown-divider"></div>
            <span onClick={handleLogout} className="dropdown-item logout-item" style={{ cursor: 'pointer' }}>
              Log Out
            </span>
          </div>
        </div>
      </header>

      <div className="contact-hero">
        <h1>Get in touch</h1>
        <p>Have a question about universities, programs, or scholarships? Reach out to us.</p>
      </div>

      <div className="contact-cards">
        <div className="contact-card">
          <div className="contact-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5566f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 6c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2" />
              <path d="M2 6l8.6 6.4a2 2 0 0 0 2.8 0L22 6" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
          </div>
          <h3>Email</h3>
          <p>support@unihub.edu.kh</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5566f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <h3>Phone</h3>
          <p>+855 23 880 880</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5566f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3>Address</h3>
          <p>Russian Federation Blvd, Phnom Penh, Cambodia</p>
        </div>
      </div>
    </div>
  );
}
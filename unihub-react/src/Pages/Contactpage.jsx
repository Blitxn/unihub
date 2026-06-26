import { Link } from "react-router-dom";
import "../contact.css";

export default function Contactpage() {
  return (
    <div className="contact-page">
      <header className="header">
        <div className="logo">UNIHUB</div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Universities</Link>
          <Link to="/scholarships" className="nav-link">Scholarships</Link>
          <Link to="/contact" className="nav-link active">Contact</Link>
        </nav>
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
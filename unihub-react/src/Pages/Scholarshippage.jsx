import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // adjust path if your axios instance lives elsewhere
import "../scholarships.css";

export default function Scholarshipspage() {
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

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await api.get('/api/scholarships/details');
        setScholarships(res.data);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Helper: format the "type" column ("Full" / "Partial") into display text
  const formatType = (type) => {
    if (!type) return 'Scholarship';
    return `${type} Scholarship`;
  };

  // Helper: format amount (stored as a plain number, e.g. 100, 50) into "100% Tuition"
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return `${amount}% Tuition`;
  };

  // Helper: format the deadline date into a readable string
  const formatDeadline = (deadline) => {
    if (!deadline) return 'TBA';
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="scholarships-page">
      {/* Header / Hero Section */}
      <div className="hero-header-bg">
        <header className="header">
          <div className="logo">UNIHUB</div>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/search" className="nav-link">Universities</Link>
            <Link to="/scholarships" className="nav-link active">Scholarships</Link>
            <Link to="/career" className="nav-link">Career</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
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

        <div className="scholarships-hero">
          <h1>Find your scholarship</h1>
          <p>Explore funding opportunities from universities and government programs across Cambodia.</p>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <main className="scholarships-list">
        {loading ? (
          <p>Loading scholarships...</p>
        ) : scholarships.length === 0 ? (
          <p>No scholarships listed yet.</p>
        ) : (
          scholarships.map((s) => (
            <div
              className="scholarship-row-card clickable"
              key={s.id}
              onClick={() => setSelectedScholarship(s)}
            >
              <span className={`scholarship-row-badge ${s.type?.toLowerCase() === "partial" ? "partial" : ""}`}>
                {formatType(s.type)}
              </span>
              <h3>{s.name}</h3>
              <p className="scholarship-row-provider">{s.provider}</p>
              <div className="scholarship-row-meta">
                <span><strong>Amount:</strong> {formatAmount(s.amount)}</span>
                <span><strong>Deadline:</strong> {formatDeadline(s.deadline)}</span>
                <span><strong>Universities:</strong> {s.universities?.length || 0}</span>
              </div>
              <div className="card-footer-action">
                <span>View Requirements & Universities &rarr;</span>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Detail Modal Overlay */}
      {selectedScholarship && (
        <div className="modal-backdrop" onClick={() => setSelectedScholarship(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScholarship(null)}>&times;</button>

            <span className={`scholarship-row-badge ${selectedScholarship.type?.toLowerCase() === "partial" ? "partial" : ""}`}>
              {formatType(selectedScholarship.type)}
            </span>

            <h2>{selectedScholarship.name}</h2>
            <p className="scholarship-row-provider">{selectedScholarship.provider}</p>

            <div className="modal-grid">
              <div><strong>Amount:</strong> {formatAmount(selectedScholarship.amount)}</div>
              <div><strong>Deadline:</strong> {formatDeadline(selectedScholarship.deadline)}</div>
              <div><strong>Eligibility:</strong> {selectedScholarship.eligibitily}</div>
            </div>

            <hr className="modal-divider" />

            <div className="modal-section">
              <h3>Eligible Universities ({selectedScholarship.universities?.length || 0})</h3>
              <ul className="uni-list">
                {(selectedScholarship.universities || []).map((uni) => (
                  <li key={uni.uni_id}>{uni.name}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3>Requirements & Eligibility</h3>
              <ul>
                {(selectedScholarship.requirements || []).map((req) => (
                  <li key={req.id}>{req.requirement_text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import '../info.css'; // Fits cleanly into your stylesheet rules

export default function UniversityInfoPage({ university, onBack }) {
  // Tab handling state
  const [activeTab, setActiveTab] = useState('programs');
  
  // Profile Dropdown Subsystem state
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  // Reviews Dashboard Stack state (pre-populating one review matching your design context)
  const [reviews, setReviews] = useState([
    {
      name: "Sophea Meas",
      rating: 5,
      body: `Excellent faculties at ${university.short || 'this campus'}. The professors are deeply knowledgeable and resources are up to date.`,
      date: "March 12, 2026"
    }
  ]);
  
  // Review Entry Form states
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Close profile dropdown menu when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Post Review Submit Handler
  const handlePostReview = () => {
    if (!reviewerName.trim() || !reviewText.trim()) {
      alert('Please fill out your name and the review message.');
      return;
    }
    if (starRating === 0) {
      alert('Please select a star rating level.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const newReview = {
      name: reviewerName.trim(),
      rating: starRating,
      body: reviewText.trim(),
      date: todayStr,
      isNew: true // Used to dynamically apply your .new-review animation class
    };

    // Prepend new review to the top of the stack
    setReviews([newReview, ...reviews]);
    
    // Clear Form Fields
    setReviewerName('');
    setReviewText('');
    setStarRating(0);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* ── NAVBAR (Matched to profile dropdown layout rules) ── */}
      <header className="header">
        <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>UNIHUB</div>
        <nav className="nav">
          <span onClick={onBack} className="nav-link" style={{ cursor: 'pointer' }}>Home</span>
          <span onClick={onBack} className="nav-link active" style={{ cursor: 'pointer' }}>Universities</span>
          <a href="#scholarships" className="nav-link">Scholarships</a>
          <a href="#contact" className="nav-link">Contact</a>
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
              <p className="user-name">Unihub User</p>
              <p className="user-email">student@unihub.edu</p>
            </div>
            <div className="dropdown-divider"></div>
            <a href="#profile" className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </a>
            <a href="#settings" className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Account Settings
            </a>
            <div className="dropdown-divider"></div>
            <span onClick={onBack} className="dropdown-item logout-item" style={{ cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div className="hero-banner">
        <button onClick={onBack} className="back-link" style={{ background: 'none', cursor: 'pointer' }}>
          ← Back to search
        </button>
        <div className="banner-img">
          {/* Solid color block backup if university photo source variations are empty */}
          <div style={{ background: '#3b4ce0', width: '100%', height: '100%' }} />
        </div>
        
        <div className="uni-identity">
          <div className="uni-logo">
            <div className="crest-placeholder">
              <div style={{ background: '#5566f5', width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>
          </div>
          <div>
            <div className="uni-name">{university.name}</div>
            <div className="uni-location">{university.location || 'Phnom Penh, Cambodia'}</div>
          </div>
        </div>
      </div>

      {/* ── TABS BAR (Controlled by activeTab state) ── */}
      <div className="tabs-bar">
        <button className={`tab ${activeTab === 'programs' ? 'active' : ''}`} onClick={() => setActiveTab('programs')}>Programs</button>
        <button className={`tab ${activeTab === 'scholarships' ? 'active' : ''}`} onClick={() => setActiveTab('scholarships')}>Scholarships</button>
        <button className={`tab ${activeTab === 'tuition' ? 'active' : ''}`} onClick={() => setActiveTab('tuition')}>Tuition fees</button>
        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="content-section">
        
        {/* PROGRAMS PANEL */}
        <div className={`tab-panel ${activeTab === 'programs' ? 'active' : ''}`}>
          <h2 className="section-title">Available Programs</h2>
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5566f5" strokeWidth="1.8"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>
                <span className="program-label">Faculty of Science</span>
              </div>
            </div>
            <div className="program-card">
              <div className="program-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5566f5" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span className="program-label">Faculty of Social Sciences</span>
              </div>
            </div>
            <div className="program-card">
              <div className="program-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5566f5" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <span className="program-label">Faculty of IT</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCHOLARSHIPS PANEL */}
        <div className={`tab-panel ${activeTab === 'scholarships' ? 'active' : ''}`}>
          <h2 className="section-title">Available Scholarships</h2>
          <div className="scholarship-list">
            <div className="scholarship-card">
              <div className="scholarship-badge">Full Scholarship</div>
              <h3 className="scholarship-name">Government Merit Scholarship</h3>
              <p className="scholarship-desc">Awarded to top-performing students based on national exam results. Covers full tuition for the entire degree program.</p>
              <div className="scholarship-meta"><span>Deadline: August 30, 2026</span><span>Undergraduate</span></div>
            </div>
            <div className="scholarship-card">
              <div className="scholarship-badge partial">Partial Scholarship</div>
              <h3 className="scholarship-name">{university.short || 'Uni'} Excellence Award</h3>
              <p className="scholarship-desc">For students with an exceptional academic record. Covers partial tuition fees per semester with annual performance reviews.</p>
              <div className="scholarship-meta"><span>Deadline: September 15, 2026</span><span>All levels</span></div>
            </div>
          </div>
        </div>

        {/* TUITION PANEL */}
        <div className={`tab-panel ${activeTab === 'tuition' ? 'active' : ''}`}>
          <h2 className="section-title">Tuition Fees</h2>
          <p className="tuition-note">All fees are listed in US Dollars (USD) per academic year. Fees may vary slightly by faculty.</p>
          <div className="tuition-table-wrap">
            <table className="tuition-table">
              <thead>
                <tr><th>Faculty / Program</th><th>Year 1</th><th>Year 2</th><th>Year 3</th><th>Year 4</th></tr>
              </thead>
              <tbody>
                <tr><td>Faculty of Science</td><td>$480</td><td>$480</td><td>$500</td><td>$500</td></tr>
                <tr><td>Faculty of IT</td><td>$520</td><td>$520</td><td>$540</td><td>$560</td></tr>
                <tr><td>Faculty of Social Sciences</td><td>$420</td><td>$420</td><td>$440</td><td>$440</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* REVIEWS PANEL */}
        <div className={`tab-panel ${activeTab === 'reviews' ? 'active' : ''}`}>
          <h2 className="section-title">Student Reviews</h2>
          
          {/* Review Input Box Form */}
          <div className="review-form">
            <h3 className="form-title">Share Your Experience</h3>
            <div className="star-selector">
              <span className="star-label">Your rating:</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span 
                    key={val}
                    className={`star ${val <= starRating ? 'selected' : ''} ${val <= hoverRating ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setStarRating(val)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <input 
              type="text" 
              className="review-input" 
              placeholder="Your name" 
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
            <textarea 
              className="review-textarea" 
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button className="review-submit" onClick={handlePostReview}>Post Review</button>
          </div>

          {/* Compiled Interactive Reviews Feed Stack */}
          <div className="reviews-list">
            {reviews.map((rev, index) => (
              <div key={index} className={`review-card ${rev.isNew ? 'new-review' : ''}`}>
                <div className="review-top">
                  <div className="reviewer-avatar">{rev.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="reviewer-name">{rev.name}</div>
                    <div className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                  </div>
                </div>
                <p className="review-body">{rev.body}</p>
                <div className="review-date">{rev.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
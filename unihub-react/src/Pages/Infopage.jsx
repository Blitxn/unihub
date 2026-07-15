import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../info.css';
import '../scholarships.css'; // reused for the scholarship detail modal styles
import api from '../api';

const bbuLogo = '/logos/bbu-logo.png';

// Maps a major/program name to a fitting emoji icon + color, so the
// Programs tab is scannable at a glance instead of one repeated icon.
function getMajorStyle(name = '') {
  const n = name.toLowerCase();
  if (n.includes('it') || n.includes('computer') || n.includes('software') || n.includes('digital')) {
    return { emoji: '💻', bg: '#e8ecfd', color: '#5566f5' };
  }
  if (n.includes('business') || n.includes('management') || n.includes('finance') || n.includes('marketing')) {
    return { emoji: '📊', bg: '#e6f7ee', color: '#1a9c5c' };
  }
  if (n.includes('engineer')) {
    return { emoji: '🛠️', bg: '#fff2e0', color: '#d97706' };
  }
  if (n.includes('medic') || n.includes('health') || n.includes('nursing')) {
    return { emoji: '🩺', bg: '#fdeaea', color: '#dc2626' };
  }
  if (n.includes('science') || n.includes('biology') || n.includes('chemistry') || n.includes('physics')) {
    return { emoji: '🔬', bg: '#e6f4fd', color: '#0284c7' };
  }
  if (n.includes('art') || n.includes('design') || n.includes('media')) {
    return { emoji: '🎨', bg: '#f4e9fd', color: '#9333ea' };
  }
  if (n.includes('language') || n.includes('literature')) {
    return { emoji: '🗣️', bg: '#fdf4e6', color: '#b45309' };
  }
  if (n.includes('law')) {
    return { emoji: '⚖️', bg: '#eceef7', color: '#4338ca' };
  }
  // Fallback for any major that doesn't match a known category
  return { emoji: '🎓', bg: '#f0f1f5', color: '#5566f5' };
}

export default function UniversityInfoPage({ university = {}, onBack }) {
  // Extract ID cleanly (handles both id and uni_id)
  const universityId = university?.id || university?.uni_id;

  // Tab handling state
  const [activeTab, setActiveTab] = useState('programs');

  // Profile Dropdown Subsystem state
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  // Logo load-error fallback state
  const [logoFailed, setLogoFailed] = useState(false);

  // Logged-in user, read once from localStorage (set by LoginModal on login/register)
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setDropdownActive(false);
    onBack();
  };

  // Reviews Dashboard Stack state — now loaded from the backend, not hardcoded
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Blend the seed rating (the number shown on the search card) with real
  // review data, same formula as the search page, so the rating shown here
  // stays consistent with the listing and doesn't swing wildly on 1 review.
  const CONFIDENCE = 10;
  const seedRating = university?.rating || 0;
  const liveReviewCount = reviews.length;
  const liveAvgRating = liveReviewCount > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / liveReviewCount
    : null;
  const displayRating = liveAvgRating !== null
    ? ((CONFIDENCE * seedRating) + (liveReviewCount * liveAvgRating)) / (CONFIDENCE + liveReviewCount)
    : seedRating;

  // Review Entry Form states (name field removed — it now comes from currentUser)
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [postingReview, setPostingReview] = useState(false);

  // Backend-driven / Prop-driven data states
  const [programs, setPrograms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [tuitionFees, setTuitionFees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scholarship detail modal state
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [scholarshipDetailLoading, setScholarshipDetailLoading] = useState(false);

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

  // Fetch or populate data safely
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // ── Helper Function: Format Default/Prop Tuition Data ──
    const getFallbackTuition = () => {
      if (university?.tuitionFees || university?.tuition) {
        const feeVal = university.tuitionFees || university.tuition;
        return Array.isArray(feeVal) ? feeVal : [
          { fee_id: 1, amount: feeVal, academicYear: '2025 - 2026' }
        ];
      }
      return [
        { fee_id: 1, amount: 600, academicYear: '2025 - 2026' }
      ];
    };

    // ── Helper Function: Format Default/Prop Programs Data ──
    const getFallbackPrograms = () => {
      if (Array.isArray(university?.majors)) {
        return university.majors.map((m, i) => (
          typeof m === 'string' ? { m_id: i, name: m } : m
        ));
      }
      return [];
    };

    // ── Helper Function: Format Default/Prop Scholarships Data ──
    const getFallbackScholarships = () => {
      if (university?.scholarship) {
        return [{
          id: 1,
          name: `${university.short || 'University'} Scholarship`,
          type: university.scholarship,
          eligibitily: 'Open to eligible applicants',
          deadline: 'TBA',
          provider: university.name || 'Build Bright University'
        }];
      }
      return [];
    };

    if (!universityId) {
      console.warn("No university ID found. Falling back to prop data.");
      setPrograms(getFallbackPrograms());
      setScholarships(getFallbackScholarships());
      setTuitionFees(getFallbackTuition());
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [majorsRes, facultiesRes, scholarshipsRes, tuitionRes] = await Promise.all([
          api.get(`/api/majors/university/${universityId}`).catch(() => ({ data: [] })),
          api.get(`/api/faculties/university/${universityId}`).catch(() => ({ data: [] })),
          api.get(`/api/scholarships/university/${universityId}`).catch(() => ({ data: [] })),
          api.get(`/api/tuition-fees/university/${universityId}`).catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setPrograms(
            Array.isArray(majorsRes.data) && majorsRes.data.length > 0
              ? majorsRes.data
              : getFallbackPrograms()
          );
          setFaculties(
            Array.isArray(facultiesRes.data) ? facultiesRes.data : []
          );
          setScholarships(
            Array.isArray(scholarshipsRes.data) && scholarshipsRes.data.length > 0
              ? scholarshipsRes.data
              : getFallbackScholarships()
          );
          setTuitionFees(
            Array.isArray(tuitionRes.data) && tuitionRes.data.length > 0
              ? tuitionRes.data
              : getFallbackTuition()
          );
        }
      } catch (error) {
        console.error('Error fetching university data:', error);
        if (isMounted) {
          setPrograms(getFallbackPrograms());
          setFaculties([]);
          setScholarships(getFallbackScholarships());
          setTuitionFees(getFallbackTuition());
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [universityId, university]);

  // Fetch reviews for this university from the backend
  useEffect(() => {
    let isMounted = true;

    if (!universityId) {
      setReviewsLoading(false);
      return;
    }

    setReviewsLoading(true);
    api.get(`/api/reviews/university/${universityId}`)
      .then((res) => {
        if (isMounted) setReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        if (isMounted) setReviews([]);
      })
      .finally(() => {
        if (isMounted) setReviewsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [universityId]);

  // Fetch full scholarship detail (universities + requirements) when a card is clicked
  const handleScholarshipClick = async (scholarshipId) => {
    setScholarshipDetailLoading(true);
    try {
      const res = await api.get(`/api/scholarships/detail/${scholarshipId}`);
      setSelectedScholarship(res.data);
    } catch (error) {
      console.error('Error fetching scholarship detail:', error);
    } finally {
      setScholarshipDetailLoading(false);
    }
  };

  // Helper: format amount (stored as a plain number, e.g. 100, 50) into "100% Tuition"
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return `${amount}% Tuition`;
  };

  // Helper: format the deadline date into a readable string
  const formatDeadline = (deadline) => {
    if (!deadline || deadline === 'TBA') return 'TBA';
    const d = new Date(deadline);
    if (isNaN(d)) return deadline;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Helper: format a review's created_at timestamp into a readable date
  const formatReviewDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Derive initials for the fallback crest (e.g. "Build Bright University" -> "BB")
  const initials = (university?.short || university?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const logoSrc = university?.logo || bbuLogo;
  const hasLogo = Boolean(logoSrc) && !logoFailed;

  // Group majors by their faculty (p_id -> Program/Faculty name), so the
  // Programs tab reads like a real catalog instead of one flat list.
  const facultyNameById = {};
  faculties.forEach((f) => {
    facultyNameById[f.p_id] = f.name;
  });

  const groupedPrograms = {};
  programs.forEach((program) => {
    const facultyName = facultyNameById[program.p_id] || 'General Programs';
    if (!groupedPrograms[facultyName]) groupedPrograms[facultyName] = [];
    groupedPrograms[facultyName].push(program);
  });
  const facultyGroups = Object.entries(groupedPrograms);

  // Post Review Submit Handler — name comes from the logged-in user, never a text field
  const handlePostReview = async () => {
    if (!currentUser) {
      alert('Please log in to post a review.');
      return;
    }
    if (!reviewText.trim()) {
      alert('Please write your review message.');
      return;
    }
    if (starRating === 0) {
      alert('Please select a star rating level.');
      return;
    }
    if (!universityId) {
      alert('Missing university information — cannot post review.');
      return;
    }

    setPostingReview(true);
    try {
      const res = await api.post('/api/reviews', {
        university_id: universityId,
        rating: starRating,
        body: reviewText.trim(),
      });

      const newReview = { ...res.data.review, isNew: true };
      setReviews((prev) => [newReview, ...prev]);
      setReviewText('');
      setStarRating(0);
    } catch (error) {
      console.error('Error posting review:', error);
      alert(error.response?.data?.message || 'Failed to post review.');
    } finally {
      setPostingReview(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* ── NAVBAR ── */}
      <header className="header">
        <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>UNIHUB</div>
        <nav className="nav">
          <span onClick={onBack} className="nav-link" style={{ cursor: 'pointer' }}>Home</span>
          <span onClick={onBack} className="nav-link active" style={{ cursor: 'pointer' }}>Universities</span>
          <Link to="/scholarships" className="nav-link">Scholarships</Link>
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
            <a href="#profile" className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </a>
            <a href="#settings" className="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Account Settings
            </a>
            <div className="dropdown-divider"></div>
            <span onClick={handleLogout} className="dropdown-item logout-item" style={{ cursor: 'pointer' }}>
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
          {university?.banner ? (
            <img src={university.banner} alt={`${university?.name} campus`} />
          ) : (
            <div className="banner-fallback" />
          )}
        </div>

        <div className="uni-identity">
          <div className="uni-logo">
            <div className="crest-placeholder">
              {hasLogo ? (
                <img
                  src={logoSrc}
                  alt={`${university?.name} logo`}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="crest-initials">{initials}</span>
              )}
            </div>
          </div>
          <div>
            <div className="uni-name">{university?.name || 'Build Bright University'}</div>
            <div className="uni-location">{university?.location || 'Phnom Penh, Cambodia'}</div>
          </div>
        </div>
      </div>

      {/* ── TABS BAR ── */}
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

          {loading ? (
            <p>Loading programs...</p>
          ) : programs.length === 0 ? (
            <p>No programs listed yet.</p>
          ) : (
            facultyGroups.map(([facultyName, facultyPrograms]) => (
              <div key={facultyName} style={{ marginBottom: 32 }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#333',
                    marginBottom: 14,
                    paddingBottom: 8,
                    borderBottom: '2px solid #eef0ff',
                  }}
                >
                  {facultyName}
                  <span style={{ fontWeight: 500, fontSize: '0.85rem', color: '#999', marginLeft: 8 }}>
                    ({facultyPrograms.length} program{facultyPrograms.length === 1 ? '' : 's'})
                  </span>
                </h3>

                <div
                  className="programs-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 18,
                  }}
                >
                  {facultyPrograms.map((program, idx) => {
                    const name = program.name || program;
                    const { emoji, bg, color } = getMajorStyle(name);
                    return (
                      <div
                        className="program-card"
                        key={program.m_id || idx}
                        style={{
                          background: '#ffffff',
                          borderRadius: 16,
                          padding: '22px 20px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          cursor: 'default',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            flexShrink: 0,
                          }}
                        >
                          {emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>
                            {name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color, fontWeight: 600, marginTop: 2 }}>
                            {program.duration ? `${program.duration} · Bachelor's Degree` : "Bachelor's Degree Program"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* SCHOLARSHIPS PANEL */}
        <div className={`tab-panel ${activeTab === 'scholarships' ? 'active' : ''}`}>
          <h2 className="section-title">Available Scholarships</h2>
          <div className="scholarship-list">
            {loading ? (
              <p>Loading scholarships...</p>
            ) : scholarships.length === 0 ? (
              <p>No scholarships listed yet.</p>
            ) : (
              scholarships.map((s, idx) => (
                <div
                  className="scholarship-card"
                  key={s.id || idx}
                  onClick={() => handleScholarshipClick(s.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`scholarship-badge ${s.type?.toLowerCase() === 'partial' ? 'partial' : ''}`}>
                    {s.type || 'Scholarship'}
                  </div>
                  <h3 className="scholarship-name">{s.name}</h3>
                  <p className="scholarship-desc">{s.eligibitily || s.eligibility}</p>
                  <div className="scholarship-meta">
                    <span>Deadline: {formatDeadline(s.deadline)}</span>
                    <span>{s.provider || ''}</span>
                  </div>
                  <div className="card-footer-action">
                    <span>View Requirements & Universities &rarr;</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TUITION PANEL */}
        <div className={`tab-panel ${activeTab === 'tuition' ? 'active' : ''}`}>
          <h2 className="section-title">Tuition Fees</h2>
          <p className="tuition-note">All fees are listed in US Dollars (USD) per academic year.</p>
          <div className="tuition-table-wrap">
            <table className="tuition-table">
              <thead>
                <tr><th>Amount</th><th>Academic Year</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="2">Loading tuition fees...</td></tr>
                ) : tuitionFees.length === 0 ? (
                  <tr><td colSpan="2">No tuition data listed yet.</td></tr>
                ) : (
                  tuitionFees.map((fee, idx) => (
                    <tr key={fee.fee_id || idx}>
                      <td>${fee.amount}</td>
                      <td>{fee.academicYear || fee.academic_year || 'Per Year'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* REVIEWS PANEL */}
        <div className={`tab-panel ${activeTab === 'reviews' ? 'active' : ''}`}>
          <h2 className="section-title">Student Reviews</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ color: '#f5a623', fontSize: '1.3rem' }}>
              {'★'.repeat(Math.round(displayRating))}{'☆'.repeat(5 - Math.round(displayRating))}
            </span>
            <strong style={{ fontSize: '1.1rem' }}>{displayRating.toFixed(1)}</strong>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>
              {liveReviewCount > 0
                ? `based on ${liveReviewCount} review${liveReviewCount === 1 ? '' : 's'}`
                : 'no reviews yet — be the first!'}
            </span>
          </div>

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

            {/* Name is no longer a text field — it's the logged-in user */}
            <div className="review-input" style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
              Posting as: <strong style={{ marginLeft: 6 }}>{currentUser?.name || 'Guest (please log in)'}</strong>
            </div>

            <textarea
              className="review-textarea"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              className="review-submit"
              onClick={handlePostReview}
              disabled={postingReview || !currentUser}
            >
              {postingReview ? 'Posting...' : 'Post Review'}
            </button>
          </div>

          <div className="reviews-list">
            {reviewsLoading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p>No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map((rev, index) => (
                <div key={rev.review_id || index} className={`review-card ${rev.isNew ? 'new-review' : ''}`}>
                  <div className="review-top">
                    <div className="reviewer-avatar">
                      {(rev.reviewer_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="reviewer-name">{rev.reviewer_name}</div>
                      <div className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                    </div>
                  </div>
                  <p className="review-body">{rev.body}</p>
                  <div className="review-date">{formatReviewDate(rev.created_at)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── SCHOLARSHIP DETAIL MODAL ── */}
      {selectedScholarship && (
        <div className="modal-backdrop" onClick={() => setSelectedScholarship(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScholarship(null)}>&times;</button>

            <span className={`scholarship-row-badge ${selectedScholarship.type?.toLowerCase() === 'partial' ? 'partial' : ''}`}>
              {selectedScholarship.type} Scholarship
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
      {scholarshipDetailLoading && (
        <div className="modal-backdrop">
          <p style={{ color: 'white' }}>Loading details...</p>
        </div>
      )}
    </div>
  );
}
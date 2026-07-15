import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UniversityInfoPage from './Infopage';
import api from '../api';
import '../search.css';

export default function SearchPage() {
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setDropdownActive(false);
    navigate('/');
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Live rating data from real reviews, keyed by university_id
  const [liveRatings, setLiveRatings] = useState({});
  useEffect(() => {
    api.get('/api/reviews/ratings')
      .then((res) => {
        const map = {};
        (res.data || []).forEach((r) => {
          map[r.university_id] = r;
        });
        setLiveRatings(map);
      })
      .catch((error) => console.error('Error fetching ratings:', error));
  }, []);

  // Blend the seed rating with real review data so a single new review
  // doesn't swing a school's score wildly — the more reviews a school has,
  // the more its real average takes over from the starting number.
  const CONFIDENCE = 10;
  const blendRating = (seedRating, live) => {
    if (!live || !live.reviewCount) return { rating: seedRating, reviewCount: 0 };
    const n = live.reviewCount;
    const blended = ((CONFIDENCE * seedRating) + (n * live.avgRating)) / (CONFIDENCE + n);
    return { rating: blended, reviewCount: n };
  };

  // Track which university is clicked
  const [selectedUni, setSelectedUni] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    return () => { document.body.style.backgroundColor = ''; };
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

  // ── UPDATED: Added 'id' field matching each university's uni_id in the database ──
  const universities = [
    { 
      id: 1,
      name: "Build Bright University", 
      short: "BBU", 
      majors: ["Business", "IT"], 
      scholarship: "Partial", 
      location: "Phnom Penh, Cambodia" ,
      image: "/build bright.png",
      rating: 4.2
    }, 
    { 
      id: 2,
      name: "Cambodia Academy Of Digital Technology", 
      short: "CADT", 
      majors: ["IT", "Engineering"], 
      scholarship: "Full", 
      location: "Phnom Penh, Cambodia",
      image: "/cadt 2.png",
      rating: 4.7
    },
    { 
      id: 3,
      name: "International University Cambodia", 
      short: "IU", 
      majors: ["Medicine", "Business"], 
      scholarship: "None", 
      location: "Phnom Penh, Cambodia",
      image: "/iu.png",
      rating: 3.9
    },
    { 
      id: 4,
      name: "Institute Of Technology Of Cambodia", 
      short: "ITC", 
      majors: ["Engineering", "IT"], 
      scholarship: "Full", 
      location: "Phnom Penh, Cambodia",
      image: "/itc.png",
      rating: 4.8
    },
    { 
      id: 5,
      name: "National Polytechnic Institute Of Cambodia", 
      short: "NPIC", 
      majors: ["Engineering"], 
      scholarship: "Partial", 
      location: "Phnom Penh, Cambodia",
     image: "/niptic.png",
     rating: 4.0
    },
    { 
      id: 6,
      name: "Royal University Of Agriculture Cambodia", 
      short: "RUA", 
      majors: ["Science"], 
      scholarship: "None", 
      location: "Phnom Penh, Cambodia",
      image: "/AGRICUL.png",
      rating: 3.7
    },
    { 
      id: 7,
      name: "Royal University Of Phnom Penh", 
      short: "RUPP", 
      majors: ["Science", "IT", "Languages"], 
      scholarship: "Full", 
      location: "Phnom Penh, Cambodia",
      image: "/rupp.png",
      rating: 4.6
    },
    { 
      id: 8,
      name: "Royal University Of Fine Arts", 
      short: "RUFA", 
      majors: ["Arts"], 
      scholarship: "None", 
      location: "Phnom Penh, Cambodia",
      image: "/2016_Phnom_Penh,_Muzeum_Narodowe_Kambodży_(10).jpg.webp",
      rating: 3.8
    },
    { 
      id: 9,
      name: "University Of Health Science", 
      short: "UHS", 
      majors: ["Medicine"], 
      scholarship: "Partial", 
      location: "Phnom Penh, Cambodia",
      image: "/University-Of-Health-Sciences.png",
      rating: 4.4
    }
  ];

  const universitiesWithLiveRatings = universities.map((uni) => {
    const { rating, reviewCount } = blendRating(uni.rating, liveRatings[uni.id]);
    return { ...uni, rating, reviewCount };
  });

  const filteredUniversities = universitiesWithLiveRatings
    .filter(uni => {
      const matchesSearch = searchQuery === '' || 
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.short.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMajor = selectedMajor === '' || uni.majors.includes(selectedMajor);
      const matchesScholarship = selectedScholarship === '' || uni.scholarship === selectedScholarship;
      const matchesRating = minRating === '' || uni.rating >= parseFloat(minRating);
      return matchesSearch && matchesMajor && matchesScholarship && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'rating-high') return b.rating - a.rating;
      if (sortBy === 'rating-low') return a.rating - b.rating;
      return 0; // no sort = keep original order
    });

  // IF A UNIVERSITY IS SELECTED, RENDER THE INFO PAGE INSTEAD
  if (selectedUni) {
    return (
      <UniversityInfoPage 
        university={selectedUni} 
        onBack={() => setSelectedUni(null)} 
      />
    );
  }

  return (
    <div className="search-page-wrapper">
      <div className="hero-search-bg">
        <header className="header">
          <div className="logo">UNIHUB</div>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/search" className="nav-link active">Universities</Link>
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
              <a href="#profile" className="dropdown-item">My Profile</a>
              <a href="#settings" className="dropdown-item">Account Settings</a>
              <div className="dropdown-divider"></div>
              <span onClick={handleLogout} className="dropdown-item logout-item" style={{ cursor: 'pointer' }}>
                Log Out
              </span>
            </div>
          </div>
        </header>

        <div className="search-area">
          <h1 className="search-title">How can we help you?</h1>
          <p className="search-sub">Search here to get answers</p>

          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search university..." 
              className="search-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b8ef5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

          <div className="filters-row">
            <select className="filter-select" value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)}>
              <option value="">All Majors</option>
              <option value="IT">Information Technology</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business Administration</option>
              <option value="Medicine">Medicine & Health</option>
              <option value="Science">Sciences</option>
              <option value="Arts">Fine Arts</option>
            </select>

            <select className="filter-select" value={selectedScholarship} onChange={(e) => setSelectedScholarship(e.target.value)}>
              <option value="">All Scholarships</option>
              <option value="Full">Full Scholarship (100%)</option>
              <option value="Partial">Partial Scholarship</option>
              <option value="None">No Scholarship</option>
            </select>

            <select className="filter-select" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">All Ratings</option>
              <option value="4.5">4.5★ & up</option>
              <option value="4">4★ & up</option>
              <option value="3.5">3.5★ & up</option>
            </select>

            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort: Default</option>
              <option value="rating-high">Rating: High to Low</option>
              <option value="rating-low">Rating: Low to High</option>
            </select>
          </div>

          <div className="keywords-row">
            <span className="keywords-label">Popular keywords</span>
            <span className="keyword-tag" onClick={() => setSearchQuery('RUPP')}>RUPP</span>
            <span className="keyword-tag" onClick={() => setSearchQuery('ITC')}>ITC</span>
          </div>
        </div>
      </div>

      <div className="results-section">
        {filteredUniversities.length > 0 ? (
          <div className="cards-grid">
            {filteredUniversities.map((uni, idx) => (
              <div key={idx} className="uni-card" onClick={() => setSelectedUni(uni)}>
                {/* ── UPDATED: Replaced empty div with img renderer ── */}
                <div className="uni-thumb" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={uni.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={`${uni.short} campus`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <p className="uni-card-name">{uni.name}</p>
                <div className="uni-card-rating">
                  <span className="uni-card-stars">
                    {'★'.repeat(Math.round(uni.rating))}{'☆'.repeat(5 - Math.round(uni.rating))}
                  </span>
                  <span className="uni-card-rating-num">{uni.rating.toFixed(1)}</span>
                  {uni.reviewCount > 0 && (
                    <span className="uni-card-review-count" style={{ fontSize: '0.8rem', color: '#888', marginLeft: 4 }}>
                      ({uni.reviewCount})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No universities match your specified search and filter combination.</p>
            <button className="clear-filters-btn" onClick={() => { setSearchQuery(''); setSelectedMajor(''); setSelectedScholarship(''); }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
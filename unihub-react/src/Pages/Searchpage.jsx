import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UniversityInfoPage from './Infopage';
import '../search.css';

export default function SearchPage() {
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState('');

  // ── NEW STATE: Track which university is clicked ──
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

  const universities = [
    { name: "Build Bright University", short: "BBU", majors: ["Business", "IT"], scholarship: "Partial", location: "Phnom Penh, Cambodia" },
    { name: "Cambodia Academy Of Digital Technology", short: "CADT", majors: ["IT", "Engineering"], scholarship: "Full", location: "Phnom Penh, Cambodia" },
    { name: "International University Cambodia", short: "IU", majors: ["Medicine", "Business"], scholarship: "None", location: "Phnom Penh, Cambodia" },
    { name: "Institute Of Technology Of Cambodia", short: "ITC", majors: ["Engineering", "IT"], scholarship: "Full", location: "Phnom Penh, Cambodia" },
    { name: "National Polytechnic Institute Of Cambodia", short: "NPIC", majors: ["Engineering"], scholarship: "Partial", location: "Phnom Penh, Cambodia" },
    { name: "Royal University Of Agriculture Cambodia", short: "RUA", majors: ["Science"], scholarship: "None", location: "Phnom Penh, Cambodia" },
    { name: "Royal University Of Phnom Penh", short: "RUPP", majors: ["Science", "IT", "Languages"], scholarship: "Full", location: "Phnom Penh, Cambodia" },
    { name: "Royal University Of Fine Arts", short: "RUFA", majors: ["Arts"], scholarship: "None", location: "Phnom Penh, Cambodia" },
    { name: "University Of Health Science", short: "UHS", majors: ["Medicine"], scholarship: "Partial", location: "Phnom Penh, Cambodia" }
  ];

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = searchQuery === '' || 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.short.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMajor = selectedMajor === '' || uni.majors.includes(selectedMajor);
    const matchesScholarship = selectedScholarship === '' || uni.scholarship === selectedScholarship;
    return matchesSearch && matchesMajor && matchesScholarship;
  });

  // ── IF A UNIVERSITY IS SELECTED, RENDER THE INFO PAGE INSTEAD ──
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
                <p className="user-name">Unihub User</p>
                <p className="user-email">student@unihub.edu</p>
              </div>
              <div className="dropdown-divider"></div>
              <a href="#profile" className="dropdown-item">My Profile</a>
              <a href="#settings" className="dropdown-item">Account Settings</a>
              <div className="dropdown-divider"></div>
              <Link to="/" className="dropdown-item logout-item">Log Out</Link>
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
              // Clicking here updates our state variable
              <div key={idx} className="uni-card" onClick={() => setSelectedUni(uni)}>
                <div className="uni-thumb"></div>
                <p className="uni-name">{uni.name}</p>
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
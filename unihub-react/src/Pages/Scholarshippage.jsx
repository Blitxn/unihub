import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../scholarships.css";

const SCHOLARSHIPS = [
  {
    id: "govt-merit",
    name: "Government Merit Scholarship",
    provider: "Ministry of Education",
    type: "Full Scholarship",
    amount: "100% Tuition",
    deadline: "August 30, 2026",
    level: "Undergraduate",
    universities: [
      "Royal University Of Phnom Penh",
      "Institute Of Technology Of Cambodia",
      "Cambodia Academy Of Digital Technology",
      "University Of Health Science",
      "Build Bright University",
      "International University Cambodia",
      "National Polytechnic Institute Of Cambodia",
      "Royal University Of Agriculture Cambodia",
      "Royal University Of Fine Arts"
    ],
    requirements: [
      "Grade A or B on High School National Examination (Bac II)",
      "Cambodian Citizenship",
      "Recommendation letter from High School Principal",
      "Passed official university entry assessment (where applicable)"
    ],
  },
  {
    id: "rupp-ex",
    name: "RUPP Excellence Award",
    provider: "Royal University of Phnom Penh",
    type: "Partial Scholarship",
    amount: "50% Tuition",
    deadline: "September 15, 2026",
    level: "All levels",
    universities: ["Royal University Of Phnom Penh"],
    requirements: [
      "Minimum Bac II Grade C or higher",
      "Passed RUPP Entrance Examination",
      "Maintain a 3.0+ GPA during studies"
    ],
  },
  {
    id: "cadt-grant",
    name: "CADT Tech Talent Grant",
    provider: "Cambodia Academy of Digital Technology",
    type: "Full Scholarship",
    amount: "100% Tuition",
    deadline: "July 20, 2026",
    level: "Undergraduate",
    universities: ["Cambodia Academy Of Digital Technology"],
    requirements: [
      "Pass CADT Entrance Exam (Math, Logic & English)",
      "Demonstrate high aptitude in Computer Science or Telecoms",
      "Successful interview performance with CADT faculty"
    ],
  },
  {
    id: "itc-eng",
    name: "ITC Engineering Scholarship",
    provider: "Institute of Technology of Cambodia",
    type: "Full Scholarship",
    amount: "100% Tuition + Stipend",
    deadline: "August 5, 2026",
    level: "Undergraduate",
    universities: ["Institute Of Technology Of Cambodia"],
    requirements: [
      "Bac II Math/Physics Focus (Grade A or B)",
      "Pass ITC Entrance Contest",
      "Maintain minimum 3.0 GPA every academic semester"
    ],
  },
  {
    id: "women-stem",
    name: "Women in STEM Award",
    provider: "National Polytechnic Institute",
    type: "Partial Scholarship",
    amount: "40% Tuition",
    deadline: "September 1, 2026",
    level: "All levels",
    universities: [
      "National Polytechnic Institute Of Cambodia",
      "Institute Of Technology Of Cambodia",
      "Cambodia Academy Of Digital Technology"
    ],
    requirements: [
      "Female applicants pursuing engineering or digital technology degrees",
      "High School Diploma or equivalent credential",
      "Short essay on personal goals in STEM"
    ],
  },
  {
    id: "health-sci",
    name: "Health Sciences Future Leaders Grant",
    provider: "University of Health Science",
    type: "Partial Scholarship",
    amount: "60% Tuition",
    deadline: "October 10, 2026",
    level: "Undergraduate",
    universities: ["University Of Health Science"],
    requirements: [
      "Pass the National Medical Entrance Examination",
      "Commitment to rural health clinic placement post-graduation"
    ],
  },
];

export default function Scholarshipspage() {
  const [selectedScholarship, setSelectedScholarship] = useState(null);

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

          <div className="avatar-container">
            <div className="avatar">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)"/>
                <circle cx="12" cy="10" r="4" fill="#ffffff"/>
                <path d="M6 18.5C6 15.4624 9.03757 14 12 14C14.9624 14 18 15.4624 18 18.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
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
        {SCHOLARSHIPS.map((s) => (
          <div
            className="scholarship-row-card clickable"
            key={s.id}
            onClick={() => setSelectedScholarship(s)}
          >
            <span className={`scholarship-row-badge ${s.type === "Partial Scholarship" ? "partial" : ""}`}>
              {s.type}
            </span>
            <h3>{s.name}</h3>
            <p className="scholarship-row-provider">{s.provider}</p>
            <div className="scholarship-row-meta">
              <span><strong>Amount:</strong> {s.amount}</span>
              <span><strong>Deadline:</strong> {s.deadline}</span>
              <span><strong>Level:</strong> {s.level}</span>
            </div>
            <div className="card-footer-action">
              <span>View Requirements & Universities &rarr;</span>
            </div>
          </div>
        ))}
      </main>

      {/* Detail Modal Overlay */}
      {selectedScholarship && (
        <div className="modal-backdrop" onClick={() => setSelectedScholarship(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScholarship(null)}>&times;</button>
            
            <span className={`scholarship-row-badge ${selectedScholarship.type === "Partial Scholarship" ? "partial" : ""}`}>
              {selectedScholarship.type}
            </span>
            
            <h2>{selectedScholarship.name}</h2>
            <p className="scholarship-row-provider">{selectedScholarship.provider}</p>

            <div className="modal-grid">
              <div><strong>Amount:</strong> {selectedScholarship.amount}</div>
              <div><strong>Deadline:</strong> {selectedScholarship.deadline}</div>
              <div><strong>Level:</strong> {selectedScholarship.level}</div>
            </div>

            <hr className="modal-divider" />

            <div className="modal-section">
              <h3>Eligible Universities ({selectedScholarship.universities.length})</h3>
              <ul className="uni-list">
                {selectedScholarship.universities.map((uni, idx) => (
                  <li key={idx}>{uni}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3>Requirements & Eligibility</h3>
              <ul>
                {selectedScholarship.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
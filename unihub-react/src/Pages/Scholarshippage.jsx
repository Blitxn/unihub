import { Link } from "react-router-dom";
import "../scholarships.css";

const SCHOLARSHIPS = [
  {
    name: "Government Merit Scholarship",
    provider: "Ministry of Education",
    type: "Full Scholarship",
    amount: "100% Tuition",
    deadline: "August 30, 2026",
    level: "Undergraduate",
  },
  {
    name: "RUPP Excellence Award",
    provider: "Royal University of Phnom Penh",
    type: "Partial Scholarship",
    amount: "50% Tuition",
    deadline: "September 15, 2026",
    level: "All levels",
  },
  {
    name: "CADT Tech Talent Grant",
    provider: "Cambodia Academy of Digital Technology",
    type: "Full Scholarship",
    amount: "100% Tuition",
    deadline: "July 20, 2026",
    level: "Undergraduate",
  },
  {
    name: "ITC Engineering Scholarship",
    provider: "Institute of Technology of Cambodia",
    type: "Full Scholarship",
    amount: "100% Tuition + Stipend",
    deadline: "August 5, 2026",
    level: "Undergraduate",
  },
  {
    name: "Women in STEM Award",
    provider: "National Polytechnic Institute",
    type: "Partial Scholarship",
    amount: "40% Tuition",
    deadline: "September 1, 2026",
    level: "All levels",
  },
  {
    name: "Health Sciences Future Leaders Grant",
    provider: "University of Health Science",
    type: "Partial Scholarship",
    amount: "60% Tuition",
    deadline: "October 10, 2026",
    level: "Undergraduate",
  },
];

export default function Scholarshipspage() {
  return (
    <div className="scholarships-page">
      <header className="header">
        <div className="logo">UNIHUB</div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Universities</Link>
          <Link to="/scholarships" className="nav-link active">Scholarships</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
      </header>

      <div className="scholarships-hero">
        <h1>Find your scholarship</h1>
        <p>Explore funding opportunities from universities and government programs across Cambodia.</p>
      </div>

      <div className="scholarships-list">
        {SCHOLARSHIPS.map((s) => (
          <div className="scholarship-row-card" key={s.name}>
            <div className={`scholarship-row-badge ${s.type === "Partial Scholarship" ? "partial" : ""}`}>
              {s.type}
            </div>
            <h3>{s.name}</h3>
            <p className="scholarship-row-provider">{s.provider}</p>
            <div className="scholarship-row-meta">
              <span><strong>Amount:</strong> {s.amount}</span>
              <span><strong>Deadline:</strong> {s.deadline}</span>
              <span><strong>Level:</strong> {s.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
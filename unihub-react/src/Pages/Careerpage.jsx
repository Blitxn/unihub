import { useState } from "react";
import { Link } from "react-router-dom";
import "./career.css";

const CAREER_DATA = [
  {
    major: "IT",
    icon: "💻",
    description: "Covers software development, networking, and systems support.",
    programs: [
      { university: "Royal University Of Phnom Penh", faculty: "Faculty of IT" },
      { university: "Cambodia Academy Of Digital Technology", faculty: "Faculty of IT" },
      { university: "Institute Of Technology Of Cambodia", faculty: "Faculty of Engineering" },
    ],
    careers: [
      { jobTitle: "Software Developer", salaryMin: 600, salaryMax: 1200, demand: "High" },
      { jobTitle: "Network Administrator", salaryMin: 400, salaryMax: 800, demand: "Medium" },
      { jobTitle: "Data Analyst", salaryMin: 500, salaryMax: 1000, demand: "High" },
    ],
    companies: [
      { name: "Wing Bank", industry: "Banking & Fintech" },
      { name: "SmartAxiata", industry: "Telecommunications" },
      { name: "Pi Pay", industry: "Fintech" },
    ],
  },
  {
    major: "Business",
    icon: "📊",
    description: "Covers management, finance, marketing, and entrepreneurship.",
    programs: [
      { university: "Build Bright University", faculty: "Faculty of Business" },
      { university: "International University Cambodia", faculty: "Faculty of Medicine" },
    ],
    careers: [
      { jobTitle: "Business Analyst", salaryMin: 400, salaryMax: 800, demand: "Medium" },
      { jobTitle: "Marketing Executive", salaryMin: 350, salaryMax: 700, demand: "Medium" },
      { jobTitle: "Financial Officer", salaryMin: 450, salaryMax: 900, demand: "High" },
    ],
    companies: [
      { name: "ACLEDA Bank", industry: "Banking" },
      { name: "AEON Mall", industry: "Retail" },
      { name: "Prudential Cambodia", industry: "Insurance" },
    ],
  },
  {
    major: "Engineering",
    icon: "🛠️",
    description: "Covers civil, mechanical, and electrical engineering paths.",
    programs: [
      { university: "Institute Of Technology Of Cambodia", faculty: "Faculty of Engineering" },
      { university: "National Polytechnic Institute Of Cambodia", faculty: "Faculty of Engineering" },
    ],
    careers: [
      { jobTitle: "Civil Engineer", salaryMin: 500, salaryMax: 1000, demand: "High" },
      { jobTitle: "Site Supervisor", salaryMin: 400, salaryMax: 750, demand: "Medium" },
    ],
    companies: [
      { name: "Cintri Cambodia", industry: "Construction" },
      { name: "Hattha Bank Tower Projects", industry: "Real Estate Development" },
    ],
  },
  {
    major: "Science",
    icon: "🔬",
    description: "Covers biology, chemistry, physics, and lab-based research paths.",
    programs: [
      { university: "Royal University Of Phnom Penh", faculty: "Faculty of Science" },
      { university: "Royal University Of Agriculture Cambodia", faculty: "Faculty of Agriculture Science" },
    ],
    careers: [
      { jobTitle: "Lab Researcher", salaryMin: 350, salaryMax: 700, demand: "Medium" },
      { jobTitle: "Environmental Scientist", salaryMin: 400, salaryMax: 750, demand: "Low" },
    ],
    companies: [
      { name: "GIZ Cambodia", industry: "NGO / Research" },
      { name: "Mekong River Commission", industry: "Environmental Research" },
    ],
  },
  {
    major: "Medicine",
    icon: "🩺",
    description: "Covers general medicine, nursing, and public health paths.",
    programs: [
      { university: "University Of Health Science", faculty: "Faculty of Health Science" },
      { university: "International University Cambodia", faculty: "Faculty of Medicine" },
    ],
    careers: [
      { jobTitle: "Medical Doctor", salaryMin: 700, salaryMax: 1500, demand: "High" },
      { jobTitle: "Registered Nurse", salaryMin: 350, salaryMax: 650, demand: "High" },
    ],
    companies: [
      { name: "Royal Phnom Penh Hospital", industry: "Healthcare" },
      { name: "Calmette Hospital", industry: "Healthcare" },
    ],
  },
  {
    major: "Arts",
    icon: "🎨",
    description: "Covers fine arts, design, and creative media paths.",
    programs: [
      { university: "Royal University Of Fine Arts", faculty: "Faculty of Fine Arts" },
    ],
    careers: [
      { jobTitle: "Graphic Designer", salaryMin: 300, salaryMax: 650, demand: "Medium" },
      { jobTitle: "Animator", salaryMin: 350, salaryMax: 700, demand: "Low" },
    ],
    companies: [
      { name: "MediaTech Cambodia", industry: "Advertising & Media" },
      { name: "Khmer Times Creative Studio", industry: "Media" },
    ],
  },
];

export default function Careerpage() {
  const [selectedMajor, setSelectedMajor] = useState(null);

  if (selectedMajor) {
    const m = CAREER_DATA.find((c) => c.major === selectedMajor);

    return (
      <div className="career-page">
        <header className="header">
          <div className="logo">UNIHUB</div>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/search" className="nav-link">Universities</Link>
            <Link to="/scholarships" className="nav-link">Scholarships</Link>
            <Link to="/career" className="nav-link active">Career</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
        </header>

        <div className="career-detail-hero">
          <button className="career-back-link" onClick={() => setSelectedMajor(null)}>
            ← Back to all majors
          </button>
          <div className="career-detail-title">
            <span className="career-detail-icon">{m.icon}</span>
            <div>
              <h1>{m.major}</h1>
              <p>{m.description}</p>
            </div>
          </div>
        </div>

        <div className="career-detail-content">
          <section className="career-section">
            <h2>Job Roles & Estimated Salary</h2>
            <div className="career-jobs-grid">
              {m.careers.map((c) => (
                <div className="career-job-card" key={c.jobTitle}>
                  <h3>{c.jobTitle}</h3>
                  <p className="career-salary">${c.salaryMin} – ${c.salaryMax} / month</p>
                  <span className={`career-demand-badge demand-${c.demand.toLowerCase()}`}>
                    {c.demand} demand
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="career-section">
            <h2>Companies Hiring This Major</h2>
            <div className="career-companies-grid">
              {m.companies.map((co) => (
                <div className="career-company-card" key={co.name}>
                  <h4>{co.name}</h4>
                  <p>{co.industry}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="career-section">
            <h2>Where to Study This Major</h2>
            <div className="career-programs-list">
              {m.programs.map((p) => (
                <Link to="/search" className="career-program-row" key={p.university}>
                  <span className="career-program-uni">{p.university}</span>
                  <span className="career-program-faculty">{p.faculty}</span>
                  <span className="career-program-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="career-page">
      <header className="header">
        <div className="logo">UNIHUB</div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Universities</Link>
          <Link to="/scholarships" className="nav-link">Scholarships</Link>
          <Link to="/career" className="nav-link active">Career</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
      </header>

      <div className="career-hero">
        <h1>Plan your career path</h1>
        <p>Pick a major to see job roles, estimated salaries, and which companies are hiring.</p>
      </div>

      <div className="career-majors-grid">
        {CAREER_DATA.map((m) => {
          const minSalary = Math.min(...m.careers.map((c) => c.salaryMin));
          const maxSalary = Math.max(...m.careers.map((c) => c.salaryMax));
          return (
            <div
              className="career-major-card"
              key={m.major}
              onClick={() => setSelectedMajor(m.major)}
            >
              <span className="career-major-icon">{m.icon}</span>
              <h3>{m.major}</h3>
              <p className="career-major-range">${minSalary} – ${maxSalary} / month</p>
              <p className="career-major-roles">{m.careers.length} job roles</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
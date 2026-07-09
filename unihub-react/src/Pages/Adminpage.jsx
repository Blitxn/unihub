import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css";

// Mock data, swap for real API calls later
const INITIAL_SCHOLARSHIPS = [
  { id: 1, name: "Government Merit Scholarship", provider: "Ministry of Education", type: "Full", deadline: "2026-08-30" },
  { id: 2, name: "RUPP Excellence Award", provider: "Royal University of Phnom Penh", type: "Partial", deadline: "2026-09-15" },
];

const INITIAL_MAJORS = [
  { id: 1, name: "Science", duration: "4 years", university: "Royal University of Phnom Penh" },
  { id: 2, name: "IT", duration: "4 years", university: "Royal University of Phnom Penh" },
  { id: 3, name: "Engineering", duration: "5 years", university: "Institute Of Technology Of Cambodia" },
];

const INITIAL_CAREERS = [
  { id: 1, major: "IT", jobTitle: "Software Developer", salaryMin: 600, salaryMax: 1200 },
  { id: 2, major: "Business", jobTitle: "Business Analyst", salaryMin: 400, salaryMax: 800 },
];

const INITIAL_USERS = [
  { id: 1, name: "Sophea Meas", email: "sophea.meas@unihub.edu", role: "student" },
  { id: 2, name: "Dara Pich", email: "dara.pich@unihub.edu", role: "student" },
  { id: 3, name: "Admin User", email: "admin@unihub.edu", role: "admin" },
];

const INITIAL_REVIEWS = [
  { id: 1, university: "Royal University Of Phnom Penh", reviewer: "Sophea Meas", comment: "Excellent science faculty.", date: "2025-03-12" },
  { id: 2, university: "Royal University Of Phnom Penh", reviewer: "Dara Pich", comment: "Great IT program.", date: "2025-05-02" },
];

const TABS = [
  { key: "scholarships", label: "Scholarships" },
  { key: "majors", label: "Majors" },
  { key: "career", label: "Career Info" },
  { key: "users", label: "Users" },
  { key: "reviews", label: "Reviews" },
];

export default function Adminpage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const [activeTab, setActiveTab] = useState("scholarships");

  const [scholarships, setScholarships] = useState(INITIAL_SCHOLARSHIPS);
  const [majors, setMajors] = useState(INITIAL_MAJORS);
  const [careers, setCareers] = useState(INITIAL_CAREERS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // manageSchorlaships()
  const removeScholarship = (id) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id));
  };

  // manageMajors()
  const removeMajor = (id) => {
    setMajors((prev) => prev.filter((m) => m.id !== id));
  };

  // manageCareerInfo()
  const removeCareer = (id) => {
    setCareers((prev) => prev.filter((c) => c.id !== id));
  };

  // manageUsers()
  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id || u.role === "admin"));
  };

  // manageReview()
  const removeReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="admin-page">
      <header className="header">
        <div className="logo">UNIHUB</div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Universities</Link>
          <Link to="/scholarships" className="nav-link">Scholarships</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      <div className="admin-hero">
        <h1>Admin Dashboard</h1>
        <p>Welcome Back, Admin!</p>
      </div>

      <div className="admin-tabs-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`admin-tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === "scholarships" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Scholarships</h2>
              <button className="admin-add-btn">+ Add Scholarship</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Deadline</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.provider}</td>
                      <td>
                        <span className={`admin-badge ${s.type === "Partial" ? "partial" : ""}`}>
                          {s.type}
                        </span>
                      </td>
                      <td>{s.deadline}</td>
                      <td>
                        <button className="admin-edit-btn">Edit</button>
                        <button className="admin-delete-btn" onClick={() => removeScholarship(s.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {scholarships.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty">No scholarships yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "majors" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Majors</h2>
              <button className="admin-add-btn">+ Add Major</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Major Name</th>
                    <th>University</th>
                    <th>Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {majors.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{m.university}</td>
                      <td>{m.duration}</td>
                      <td>
                        <button className="admin-edit-btn">Edit</button>
                        <button className="admin-delete-btn" onClick={() => removeMajor(m.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {majors.length === 0 && (
                    <tr><td colSpan="4" className="admin-empty">No majors yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "career" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Career Info</h2>
              <button className="admin-add-btn">+ Add Career Entry</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Major</th>
                    <th>Job Title</th>
                    <th>Salary Range</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {careers.map((c) => (
                    <tr key={c.id}>
                      <td>{c.major}</td>
                      <td>{c.jobTitle}</td>
                      <td>${c.salaryMin} - ${c.salaryMax}</td>
                      <td>
                        <button className="admin-edit-btn">Edit</button>
                        <button className="admin-delete-btn" onClick={() => removeCareer(c.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {careers.length === 0 && (
                    <tr><td colSpan="4" className="admin-empty">No career entries yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Users</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-badge ${u.role === "admin" ? "admin-role" : ""}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.role !== "admin" && (
                          <button className="admin-delete-btn" onClick={() => removeUser(u.id)}>
                            Deactivate
                          </button>
                        )}
                        {u.role === "admin" && (
                          <span className="admin-locked-note">Protected - only one admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Reviews</h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>University</th>
                    <th>Reviewer</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id}>
                      <td>{r.university}</td>
                      <td>{r.reviewer}</td>
                      <td className="admin-review-comment">{r.comment}</td>
                      <td>{r.date}</td>
                      <td>
                        <button className="admin-delete-btn" onClick={() => removeReview(r.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty">No reviews yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
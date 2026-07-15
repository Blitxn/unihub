import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./admin.css";

const TABS = [
  { key: "scholarships", label: "Scholarships" },
  { key: "majors", label: "Majors" },
  { key: "career", label: "Career Info" },
  { key: "users", label: "Users" },
  { key: "reviews", label: "Reviews" },
];

const EMPTY_SCHOLARSHIP_FORM = {
  name: '', provider: '', amount: '', eligibitily: '', deadline: '', type: 'Full', university_id: ''
};
const EMPTY_MAJOR_FORM = {
  name: '', duration: '', university_id: '', program_id: ''
};
const EMPTY_CAREER_FORM = {
  job_title: '', description: '', salaryMin: '', salaryMax: '', major_id: ''
};

export default function Adminpage() {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  const [activeTab, setActiveTab] = useState("scholarships");

  // Shared reference data
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [majorsForDropdown, setMajorsForDropdown] = useState([]);

  // ── Scholarships ──
  const [scholarships, setScholarships] = useState([]);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(true);
  const [showScholarshipForm, setShowScholarshipForm] = useState(false);
  const [editingScholarshipId, setEditingScholarshipId] = useState(null);
  const [scholarshipForm, setScholarshipForm] = useState(EMPTY_SCHOLARSHIP_FORM);
  const [scholarshipFormError, setScholarshipFormError] = useState('');
  const [scholarshipSubmitting, setScholarshipSubmitting] = useState(false);

  // ── Majors ──
  const [majors, setMajors] = useState([]);
  const [majorsLoading, setMajorsLoading] = useState(true);
  const [showMajorForm, setShowMajorForm] = useState(false);
  const [editingMajorId, setEditingMajorId] = useState(null);
  const [majorForm, setMajorForm] = useState(EMPTY_MAJOR_FORM);
  const [majorFormError, setMajorFormError] = useState('');
  const [majorSubmitting, setMajorSubmitting] = useState(false);

  // ── Careers ──
  const [careers, setCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState(null);
  const [careerForm, setCareerForm] = useState(EMPTY_CAREER_FORM);
  const [careerFormError, setCareerFormError] = useState('');
  const [careerSubmitting, setCareerSubmitting] = useState(false);

  // ── Users ──
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userRoleDraft, setUserRoleDraft] = useState('student');

  // ── Reviews ──
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // ───────────────── Initial data fetches ─────────────────

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get('/api/universities');
        setUniversities(res.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/api/programs');
        setPrograms(res.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await api.get('/api/scholarships');
        setScholarships(res.data);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      } finally {
        setScholarshipsLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const fetchMajors = async () => {
    setMajorsLoading(true);
    try {
      const res = await api.get('/api/majors');
      setMajors(res.data);
      setMajorsForDropdown(res.data);
    } catch (error) {
      console.error('Error fetching majors:', error);
    } finally {
      setMajorsLoading(false);
    }
  };
  useEffect(() => { fetchMajors(); }, []);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await api.get('/api/careers');
        setCareers(res.data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      } finally {
        setCareersLoading(false);
      }
    };
    fetchCareers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Reviews: no single "get all" endpoint exists yet, so we fetch per-university
  // and combine, once we know which universities exist.
  useEffect(() => {
    if (universities.length === 0) return;

    const fetchAllReviews = async () => {
      setReviewsLoading(true);
      try {
        const results = await Promise.all(
          universities.map(async (u) => {
            const uniId = u.uni_id || u.id;
            try {
              const res = await api.get(`/api/reviews/university/${uniId}`);
              return res.data.map((r) => ({ ...r, university_name: u.name, university_id: uniId }));
            } catch {
              return [];
            }
          })
        );
        setReviews(results.flat());
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchAllReviews();
  }, [universities]);

  // ───────────────── Helpers ─────────────────

  const getUniversityName = (uniId) => {
    const uni = universities.find((u) => (u.uni_id || u.id) === uniId);
    return uni ? uni.name : `University #${uniId}`;
  };

  const getMajorName = (majorId) => {
    const major = majorsForDropdown.find((m) => m.m_id === majorId);
    return major ? major.name : `Major #${majorId}`;
  };

  // ───────────────── Scholarships CRUD ─────────────────

  const removeScholarship = async (id) => {
    if (!window.confirm('Delete this scholarship?')) return;
    try {
      await api.delete(`/api/scholarships/${id}`);
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete scholarship.');
    }
  };

  const openAddScholarshipForm = () => {
    setEditingScholarshipId(null);
    setScholarshipForm(EMPTY_SCHOLARSHIP_FORM);
    setScholarshipFormError('');
    setShowScholarshipForm(true);
  };

  const openEditScholarshipForm = (s) => {
    setEditingScholarshipId(s.id);
    setScholarshipForm({
      name: s.name || '', provider: s.provider || '', amount: s.amount ?? '',
      eligibitily: s.eligibitily || '',
      deadline: s.deadline ? s.deadline.split('T')[0] : '',
      type: s.type || 'Full', university_id: s.uni_id || ''
    });
    setScholarshipFormError('');
    setShowScholarshipForm(true);
  };

  const closeScholarshipForm = () => {
    setShowScholarshipForm(false);
    setEditingScholarshipId(null);
    setScholarshipForm(EMPTY_SCHOLARSHIP_FORM);
    setScholarshipFormError('');
  };

  const handleScholarshipFormSubmit = async (e) => {
    e.preventDefault();
    setScholarshipFormError('');
    if (!scholarshipForm.name || !scholarshipForm.university_id) {
      setScholarshipFormError('Name and University are required.');
      return;
    }
    setScholarshipSubmitting(true);
    try {
      if (editingScholarshipId) {
        await api.put(`/api/scholarships/${editingScholarshipId}`, scholarshipForm);
        setScholarships((prev) => prev.map((s) =>
          s.id === editingScholarshipId ? { ...s, ...scholarshipForm, uni_id: scholarshipForm.university_id } : s
        ));
      } else {
        const res = await api.post('/api/scholarships', scholarshipForm);
        setScholarships((prev) => [...prev, { id: res.data.scholarshipId, ...scholarshipForm, uni_id: scholarshipForm.university_id }]);
      }
      closeScholarshipForm();
    } catch (error) {
      console.error(error);
      setScholarshipFormError(error.response?.data?.message || 'Failed to save scholarship.');
    } finally {
      setScholarshipSubmitting(false);
    }
  };

  // ───────────────── Majors CRUD ─────────────────

  const removeMajor = async (id) => {
    if (!window.confirm('Delete this major?')) return;
    try {
      await api.delete(`/api/majors/${id}`);
      setMajors((prev) => prev.filter((m) => m.m_id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete major.');
    }
  };

  const openAddMajorForm = () => {
    setEditingMajorId(null);
    setMajorForm(EMPTY_MAJOR_FORM);
    setMajorFormError('');
    setShowMajorForm(true);
  };

  const openEditMajorForm = (m) => {
    setEditingMajorId(m.m_id);
    setMajorForm({
      name: m.name || '', duration: m.duration || '',
      university_id: m.uni_id || '', program_id: m.p_id || ''
    });
    setMajorFormError('');
    setShowMajorForm(true);
  };

  const closeMajorForm = () => {
    setShowMajorForm(false);
    setEditingMajorId(null);
    setMajorForm(EMPTY_MAJOR_FORM);
    setMajorFormError('');
  };

  const handleMajorFormSubmit = async (e) => {
    e.preventDefault();
    setMajorFormError('');
    if (!majorForm.name || !majorForm.university_id || !majorForm.program_id || !majorForm.duration) {
      setMajorFormError('Name, University, Program, and Duration are required.');
      return;
    }
    setMajorSubmitting(true);
    try {
      if (editingMajorId) {
        await api.put(`/api/majors/${editingMajorId}`, majorForm);
      } else {
        await api.post('/api/majors', majorForm);
      }
      await fetchMajors();
      closeMajorForm();
    } catch (error) {
      console.error(error);
      setMajorFormError(error.response?.data?.message || 'Failed to save major.');
    } finally {
      setMajorSubmitting(false);
    }
  };

  // Programs filtered to whichever university is selected in the Major form
  const programsForSelectedUniversity = programs.filter(
    (p) => String(p.uni_id) === String(majorForm.university_id)
  );

  // ───────────────── Careers CRUD ─────────────────

  const removeCareer = async (id) => {
    if (!window.confirm('Delete this career entry?')) return;
    try {
      await api.delete(`/api/careers/${id}`);
      setCareers((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete career entry.');
    }
  };

  const openAddCareerForm = () => {
    setEditingCareerId(null);
    setCareerForm(EMPTY_CAREER_FORM);
    setCareerFormError('');
    setShowCareerForm(true);
  };

  const openEditCareerForm = (c) => {
    setEditingCareerId(c.id);
    setCareerForm({
      job_title: c.job_title || '', description: c.description || '',
      salaryMin: c.salaryMin ?? '', salaryMax: c.salaryMax ?? '', major_id: c.m_id || ''
    });
    setCareerFormError('');
    setShowCareerForm(true);
  };

  const closeCareerForm = () => {
    setShowCareerForm(false);
    setEditingCareerId(null);
    setCareerForm(EMPTY_CAREER_FORM);
    setCareerFormError('');
  };

  const handleCareerFormSubmit = async (e) => {
    e.preventDefault();
    setCareerFormError('');
    if (!careerForm.job_title || !careerForm.major_id) {
      setCareerFormError('Job title and Major are required.');
      return;
    }
    setCareerSubmitting(true);
    try {
      if (editingCareerId) {
        await api.put(`/api/careers/${editingCareerId}`, careerForm);
        setCareers((prev) => prev.map((c) =>
          c.id === editingCareerId ? { ...c, ...careerForm, m_id: careerForm.major_id } : c
        ));
      } else {
        const res = await api.post('/api/careers', careerForm);
        setCareers((prev) => [...prev, { id: res.data.careerId, ...careerForm, m_id: careerForm.major_id }]);
      }
      closeCareerForm();
    } catch (error) {
      console.error(error);
      setCareerFormError(error.response?.data?.message || 'Failed to save career entry.');
    } finally {
      setCareerSubmitting(false);
    }
  };

  // ───────────────── Users ─────────────────
  // Note: there's no "active/banned" flag in the users table today, so
  // "Deactivate" performs a real delete of the account. If you'd rather
  // suspend instead of delete, we'd need to add an `is_active` column
  // and switch this to an update instead.

  const removeUser = async (id, role) => {
    if (role === 'admin') return;
    if (!window.confirm('Deactivate (permanently delete) this user account?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to deactivate user.');
    }
  };

  const openEditUserRole = (u) => {
    setEditingUserId(u.id);
    setUserRoleDraft(u.role);
  };

  const saveUserRole = async (u) => {
    try {
      await api.put(`/api/users/${u.id}`, { name: u.name, email: u.email, role: userRoleDraft });
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, role: userRoleDraft } : x));
      setEditingUserId(null);
    } catch (error) {
      console.error(error);
      alert('Failed to update user role.');
    }
  };

  // ───────────────── Reviews ─────────────────

  const removeReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.review_id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete review. (Only the review author or an admin can delete it.)');
    }
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
        <button className="admin-logout-btn" onClick={handleLogout}>Log Out</button>
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

        {/* ═══════════════ SCHOLARSHIPS ═══════════════ */}
        {activeTab === "scholarships" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Scholarships</h2>
              <button className="admin-add-btn" onClick={openAddScholarshipForm}>+ Add Scholarship</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Provider</th><th>University</th><th>Type</th><th>Deadline</th><th></th></tr>
                </thead>
                <tbody>
                  {scholarshipsLoading ? (
                    <tr><td colSpan="6" className="admin-empty">Loading...</td></tr>
                  ) : scholarships.length === 0 ? (
                    <tr><td colSpan="6" className="admin-empty">No scholarships yet.</td></tr>
                  ) : (
                    scholarships.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.provider}</td>
                        <td>{getUniversityName(s.uni_id)}</td>
                        <td><span className={`admin-badge ${s.type?.toLowerCase() === "partial" ? "partial" : ""}`}>{s.type}</span></td>
                        <td>{s.deadline ? new Date(s.deadline).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <button className="admin-edit-btn" onClick={() => openEditScholarshipForm(s)}>Edit</button>
                          <button className="admin-delete-btn" onClick={() => removeScholarship(s.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ MAJORS ═══════════════ */}
        {activeTab === "majors" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Majors</h2>
              <button className="admin-add-btn" onClick={openAddMajorForm}>+ Add Major</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Major Name</th><th>University</th><th>Duration</th><th></th></tr>
                </thead>
                <tbody>
                  {majorsLoading ? (
                    <tr><td colSpan="4" className="admin-empty">Loading...</td></tr>
                  ) : majors.length === 0 ? (
                    <tr><td colSpan="4" className="admin-empty">No majors yet.</td></tr>
                  ) : (
                    majors.map((m) => (
                      <tr key={m.m_id}>
                        <td>{m.name}</td>
                        <td>{getUniversityName(m.uni_id)}</td>
                        <td>{m.duration}</td>
                        <td>
                          <button className="admin-edit-btn" onClick={() => openEditMajorForm(m)}>Edit</button>
                          <button className="admin-delete-btn" onClick={() => removeMajor(m.m_id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ CAREER INFO ═══════════════ */}
        {activeTab === "career" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Manage Career Info</h2>
              <button className="admin-add-btn" onClick={openAddCareerForm}>+ Add Career Entry</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Major</th><th>Job Title</th><th>Salary Range</th><th></th></tr>
                </thead>
                <tbody>
                  {careersLoading ? (
                    <tr><td colSpan="4" className="admin-empty">Loading...</td></tr>
                  ) : careers.length === 0 ? (
                    <tr><td colSpan="4" className="admin-empty">No career entries yet.</td></tr>
                  ) : (
                    careers.map((c) => (
                      <tr key={c.id}>
                        <td>{getMajorName(c.m_id)}</td>
                        <td>{c.job_title}</td>
                        <td>${c.salaryMin} - ${c.salaryMax}</td>
                        <td>
                          <button className="admin-edit-btn" onClick={() => openEditCareerForm(c)}>Edit</button>
                          <button className="admin-delete-btn" onClick={() => removeCareer(c.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ USERS ═══════════════ */}
        {activeTab === "users" && (
          <div className="admin-panel">
            <div className="admin-panel-header"><h2>Manage Users</h2></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr><td colSpan="4" className="admin-empty">Loading...</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          {editingUserId === u.id ? (
                            <select value={userRoleDraft} onChange={(e) => setUserRoleDraft(e.target.value)}>
                              <option value="student">student</option>
                              <option value="admin">admin</option>
                            </select>
                          ) : (
                            <span className={`admin-badge ${u.role === "admin" ? "admin-role" : ""}`}>{u.role}</span>
                          )}
                        </td>
                        <td>
                          {editingUserId === u.id ? (
                            <>
                              <button className="admin-edit-btn" onClick={() => saveUserRole(u)}>Save</button>
                              <button className="admin-delete-btn" onClick={() => setEditingUserId(null)}>Cancel</button>
                            </>
                          ) : u.role !== "admin" ? (
                            <>
                              <button className="admin-edit-btn" onClick={() => openEditUserRole(u)}>Edit Role</button>
                              <button className="admin-delete-btn" onClick={() => removeUser(u.id, u.role)}>Deactivate</button>
                            </>
                          ) : (
                            <span className="admin-locked-note">Protected - only one admin</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ REVIEWS ═══════════════ */}
        {activeTab === "reviews" && (
          <div className="admin-panel">
            <div className="admin-panel-header"><h2>Manage Reviews</h2></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>University</th><th>Reviewer</th><th>Comment</th><th>Date</th><th></th></tr>
                </thead>
                <tbody>
                  {reviewsLoading ? (
                    <tr><td colSpan="5" className="admin-empty">Loading...</td></tr>
                  ) : reviews.length === 0 ? (
                    <tr><td colSpan="5" className="admin-empty">No reviews yet.</td></tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r.review_id}>
                        <td>{r.university_name}</td>
                        <td>{r.reviewer_name}</td>
                        <td className="admin-review-comment">{r.body}</td>
                        <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</td>
                        <td>
                          <button className="admin-delete-btn" onClick={() => removeReview(r.review_id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD/EDIT SCHOLARSHIP MODAL ── */}
      {showScholarshipForm && (
        <div className="modal-overlay" onClick={closeScholarshipForm}>
          <div className="admin-panel" style={{ maxWidth: '480px', margin: '60px auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeScholarshipForm} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '20px' }}>{editingScholarshipId ? 'Edit Scholarship' : 'Add Scholarship'}</h2>
            <form onSubmit={handleScholarshipFormSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label>Name</label>
                <input type="text" value={scholarshipForm.name} onChange={(e) => setScholarshipForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Provider</label>
                <input type="text" value={scholarshipForm.provider} onChange={(e) => setScholarshipForm(p => ({ ...p, provider: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>University</label>
                <select value={scholarshipForm.university_id} onChange={(e) => setScholarshipForm(p => ({ ...p, university_id: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required>
                  <option value="">Select a university</option>
                  {universities.map((u) => (
                    <option key={u.uni_id || u.id} value={u.uni_id || u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Amount (%)</label>
                <input type="number" value={scholarshipForm.amount} onChange={(e) => setScholarshipForm(p => ({ ...p, amount: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Eligibility</label>
                <input type="text" value={scholarshipForm.eligibitily} onChange={(e) => setScholarshipForm(p => ({ ...p, eligibitily: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Deadline</label>
                <input type="date" value={scholarshipForm.deadline} onChange={(e) => setScholarshipForm(p => ({ ...p, deadline: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Type</label>
                <select value={scholarshipForm.type} onChange={(e) => setScholarshipForm(p => ({ ...p, type: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
              {scholarshipFormError && <p style={{ color: '#ff4d4f', marginBottom: '14px' }}>{scholarshipFormError}</p>}
              <button type="submit" className="admin-add-btn" disabled={scholarshipSubmitting} style={{ width: '100%' }}>
                {scholarshipSubmitting ? 'Saving...' : (editingScholarshipId ? 'Save Changes' : 'Add Scholarship')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT MAJOR MODAL ── */}
      {showMajorForm && (
        <div className="modal-overlay" onClick={closeMajorForm}>
          <div className="admin-panel" style={{ maxWidth: '480px', margin: '60px auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeMajorForm} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '20px' }}>{editingMajorId ? 'Edit Major' : 'Add Major'}</h2>
            <form onSubmit={handleMajorFormSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label>Major Name</label>
                <input type="text" value={majorForm.name} onChange={(e) => setMajorForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>University</label>
                <select
                  value={majorForm.university_id}
                  onChange={(e) => setMajorForm(p => ({ ...p, university_id: e.target.value, program_id: '' }))}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  required
                >
                  <option value="">Select a university</option>
                  {universities.map((u) => (
                    <option key={u.uni_id || u.id} value={u.uni_id || u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Program (Faculty)</label>
                <select
                  value={majorForm.program_id}
                  onChange={(e) => setMajorForm(p => ({ ...p, program_id: e.target.value }))}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  required
                  disabled={!majorForm.university_id}
                >
                  <option value="">
                    {majorForm.university_id ? 'Select a program' : 'Select a university first'}
                  </option>
                  {programsForSelectedUniversity.map((p) => (
                    <option key={p.p_id} value={p.p_id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Duration</label>
                <input type="text" placeholder="e.g. 4 years" value={majorForm.duration} onChange={(e) => setMajorForm(p => ({ ...p, duration: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required />
              </div>
              {majorFormError && <p style={{ color: '#ff4d4f', marginBottom: '14px' }}>{majorFormError}</p>}
              <button type="submit" className="admin-add-btn" disabled={majorSubmitting} style={{ width: '100%' }}>
                {majorSubmitting ? 'Saving...' : (editingMajorId ? 'Save Changes' : 'Add Major')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT CAREER MODAL ── */}
      {showCareerForm && (
        <div className="modal-overlay" onClick={closeCareerForm}>
          <div className="admin-panel" style={{ maxWidth: '480px', margin: '60px auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeCareerForm} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '20px' }}>{editingCareerId ? 'Edit Career Entry' : 'Add Career Entry'}</h2>
            <form onSubmit={handleCareerFormSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label>Job Title</label>
                <input type="text" value={careerForm.job_title} onChange={(e) => setCareerForm(p => ({ ...p, job_title: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Major</label>
                <select value={careerForm.major_id} onChange={(e) => setCareerForm(p => ({ ...p, major_id: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required>
                  <option value="">Select a major</option>
                  {majorsForDropdown.map((m) => (
                    <option key={m.m_id} value={m.m_id}>{m.name} ({getUniversityName(m.uni_id)})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Description</label>
                <textarea value={careerForm.description} onChange={(e) => setCareerForm(p => ({ ...p, description: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} rows={3} />
              </div>
              <div style={{ marginBottom: '14px', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Min Salary ($)</label>
                  <input type="number" value={careerForm.salaryMin} onChange={(e) => setCareerForm(p => ({ ...p, salaryMin: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Max Salary ($)</label>
                  <input type="number" value={careerForm.salaryMax} onChange={(e) => setCareerForm(p => ({ ...p, salaryMax: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
                </div>
              </div>
              {careerFormError && <p style={{ color: '#ff4d4f', marginBottom: '14px' }}>{careerFormError}</p>}
              <button type="submit" className="admin-add-btn" disabled={careerSubmitting} style={{ width: '100%' }}>
                {careerSubmitting ? 'Saving...' : (editingCareerId ? 'Save Changes' : 'Add Career Entry')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
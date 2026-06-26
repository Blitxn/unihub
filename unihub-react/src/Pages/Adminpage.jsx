export default function Adminpage() {
  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">UNIHUB ADMIN</h1>
      </nav>

      <section style={{ color: "white", padding: "20px 0" }}>
        <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3>Manage Universities</h3>
            <p>Add, edit, or remove university listings.</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3>Manage Scholarships</h3>
            <p>Post or update scholarship listings.</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3>Manage Users</h3>
            <p>View or deactivate user accounts.</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3>Manage Career Data</h3>
            <p>Update salary estimates and company demand.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
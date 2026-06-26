import Navbar from "../components/Navbar";

export default function Comparepage() {
  return (
    <div className="container">
      <Navbar onNavClick={(e) => e.preventDefault()} />

      <section style={{ color: "white", padding: "20px 0" }}>
        <h1 style={{ marginBottom: "20px" }}>Compare Universities</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h2>University A</h2>
            <p>Tuition: —</p>
            <p>Programs: —</p>
            <p>Scholarships: —</p>
            <p>Location: —</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h2>University B</h2>
            <p>Tuition: —</p>
            <p>Programs: —</p>
            <p>Scholarships: —</p>
            <p>Location: —</p>
          </div>
        </div>
      </section>
    </div>
  );
}
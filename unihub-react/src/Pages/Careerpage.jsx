import Navbar from "../components/Navbar";

const CAREER_DATA = [
  { major: "Computer Science", demand: "High", salary: "$600 - $1,200 / month" },
  { major: "Business Administration", demand: "Medium", salary: "$400 - $800 / month" },
  { major: "Social Work", demand: "Medium", salary: "$300 - $600 / month" },
];

export default function Careerpage() {
  return (
    <div className="container">
      <Navbar onNavClick={(e) => e.preventDefault()} />

      <section style={{ color: "white", padding: "20px 0" }}>
        <h1 style={{ marginBottom: "20px" }}>Career & Salary Insights</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {CAREER_DATA.map((c) => (
            <div
              key={c.major}
              style={{
                background: "rgba(255,255,255,0.12)",
                padding: "16px 20px",
                borderRadius: "14px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <strong>{c.major}</strong>
              <span>Demand: {c.demand}</span>
              <span>Est. Salary: {c.salary}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
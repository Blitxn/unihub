import Navbar from '../components/Navbar';

function Homepage({ onOpenLogin, requireLogin, isLoggedIn }) {
  return (
    <div className="page">
      <Navbar
        onOpenLogin={onOpenLogin}
        requireLogin={requireLogin}
        isLoggedIn={isLoggedIn}
      />

      <section className="hero">
        <div className="stats-row">
          <div className="stat">
            <h2>10+</h2>
            <p>Universities</p>
          </div>
          <div className="stat">
            <h2>20+</h2>
            <p>Programs</p>
          </div>
          <div className="stat">
            <h2>50+</h2>
            <p>Scholarships</p>
          </div>
        </div>

        <div className="hero-text">
          <h1>Your guide to higher education in Phnom Penh</h1>
          <p>Find the right campus and the best programs for your goals.</p>
          <button type="button" onClick={onOpenLogin}>Explore</button>
        </div>
      </section>

      <section className="about-section">
        <div className="about">
          <h2>About us</h2>
          <p>
            Our mission is to make higher education accessible and transparent for everyone.
            Unihub brings together all campus insights and scholarship data you need to make
            the right choice for your career.
          </p>
        </div>

        <div className="cards">
          <div className="card-item">
            <img src="/science.png" alt="Science majors" />
            <h4>Science majors</h4>
          </div>
          <div className="card-item">
            <img src="/social.png" alt="Social majors" />
            <h4>Social majors</h4>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
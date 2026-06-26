import React from 'react';
function Navbar({ onOpenLogin }) {
  return (
    <nav className="navbar">
      <div className="logo">UniHub</div>
      <ul className="nav-links">
        {/* Pass 'e' (the click event) into the arrow function and call preventDefault() */}
        <li>
          <a href="#home" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
            Home
          </a>
        </li>
        <li>
          <a href="#universities" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
            Universities
          </a>
        </li>
        <li>
          <a href="#scholarships" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
            Scholarships
          </a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ onOpenLogin, requireLogin, isLoggedIn }) {
  const navigate = useNavigate();

  const handleGatedClick = (e, path) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(path);
    } else {
      requireLogin(path);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">UniHub</div>
      <ul className="nav-links">
        <li>
          <a href="#home" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
            Home
          </a>
        </li>
        <li>
          <a href="/search" onClick={(e) => handleGatedClick(e, '/search')}>
            Universities
          </a>
        </li>
        <li>
          <a href="/scholarships" onClick={(e) => handleGatedClick(e, '/scholarships')}>
            Scholarships
          </a>
        </li>
        <li>
          <a href="/career" onClick={(e) => handleGatedClick(e, '/career')}>
            Career
          </a>
        </li>
        <li>
          <a href="/contact" onClick={(e) => handleGatedClick(e, '/contact')}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
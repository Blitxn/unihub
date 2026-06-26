import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../login.css'; 

// FIXED: Changed isOpen to open to match App.jsx
function LoginModal({ open, onClose }) {
  const [modalView, setModalView] = useState('login');
  const navigate = useNavigate(); 

  // FIXED: Changed !isOpen to !open
  if (!open) return null;

  const handleClose = () => {
    setModalView('login');
    onClose();
  };

  const handleSubmitSuccess = (e) => {
    e.preventDefault();
    handleClose(); 
    navigate('/search'); 
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>&times;</button>

        {/* LEFT PANEL */}
        <div className="panel-left">
          <div className="panel-left__top">
            <h1 className="brand-title">Welcome to<br/>Unihub</h1>
            <p className="brand-tagline">
              {modalView === 'login' 
                ? 'Discover university. Shape your goal.' 
                : 'Join our community. Track your educational pathway.'}
            </p>
          </div>
          <div className="bear-wrap">
            <img src="/bear nobg.png" alt="Unihub mascot bear" className="bear-img" />
          </div>
          <p className="signup-prompt">
            {modalView === 'login' ? (
              <>Don't have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); setModalView('signup'); }}>Create one</a></>
            ) : (
              <>Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); setModalView('login'); }}>Sign In</a></>
            )}
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel-right">
          {modalView === 'login' ? (
            <form className="form-wrap animate-fade" onSubmit={handleSubmitSuccess}>
              <h2 className="form-title">Welcome Back!</h2>
              <p className="form-subtitle">Continue your path to academic success.</p>

              <div className="field">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" placeholder="Enter your email address" required />
              </div>
              <div className="field">
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" placeholder="Enter your password" required />
              </div>

              <div className="form-row">
                <label className="remember">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="link-blue">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-login">Login</button>
            </form>
          ) : (
            <form className="form-wrap animate-fade" onSubmit={handleSubmitSuccess}>
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Start your higher education search journey.</p>

              <div className="field">
                <label htmlFor="signup-name">Full Name</label>
                <input id="signup-name" type="text" placeholder="Enter your full name" required />
              </div>
              <div className="field">
                <label htmlFor="signup-email">Email Address</label>
                <input id="signup-email" type="email" placeholder="Enter your email address" required />
              </div>
              <div className="field">
                <label htmlFor="signup-password">Password</label>
                <input id="signup-password" type="password" placeholder="Create a strong password" required />
              </div>
              <div className="field">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <input id="signup-confirm" type="password" placeholder="Repeat your password" required />
              </div>

              <button type="submit" className="btn-login" style={{ marginTop: '10px' }}>Sign Up</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
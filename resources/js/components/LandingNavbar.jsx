import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "../images/VoteSecure.png";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className={`vs-nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <nav className="container vs-nav">
        <Link to="/" className="vs-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="VoteSecure" className="vs-logo-img" />
          <span className="vs-brand-text" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.5px' }}>Vote Secure</span>
        </Link>

        <button
          className="vs-burger d-md-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          style={{ color: 'white', fontSize: '1.5rem', background: 'transparent', border: 'none' }}
        >
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Home page */}
        <div className={`vs-links ${open ? "is-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `vs-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
            end
          >
            <i className="fa-solid fa-house me-2"></i> Home
          </NavLink>

          {/* About page */}
          <NavLink
            to="/about"
            className={({ isActive }) => `vs-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-circle-info me-2"></i> About Us
          </NavLink>

          {/* Contact page */}
          <NavLink
            to="/contact"
            className={({ isActive }) => `vs-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-envelope me-2"></i> Contact
          </NavLink>

          {/* FAQs page */}
          <NavLink
            to="/faqs"
            className={({ isActive }) => `vs-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-circle-question me-2"></i> FAQs
          </NavLink>


          <div className="vs-nav-actions">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/voter'}
                  className="vs-btn vs-btn-primary"
                  onClick={() => setOpen(false)}
                >
                  <i className="fa-solid fa-right-to-bracket"></i> Login
                </Link>
                <button
                  className="vs-btn vs-btn-ghost"
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="vs-btn vs-btn-ghost"
                  onClick={() => setOpen(false)}
                >
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
                </Link>
                <Link
                  to="/register"
                  className="vs-btn vs-btn-primary"
                  onClick={() => setOpen(false)}
                >
                  <i className="fa-solid fa-user-plus"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="vs-nav-wrap">
      <nav className="container vs-nav">
        <Link to="/" className="vs-brand" onClick={() => setOpen(false)}>
          <span className="vs-logo">V</span>
          <span className="vs-brand-text">
            Vote<span>Secure</span>
          </span>
        </Link>

        <button
          className="vs-burger d-md-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

          {/* Home page */}
        <div className={`vs-links ${open ? "is-open" : ""}`}>
          <NavLink to="/" className="vs-link" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          {/* About page */}
          <NavLink to="/about" className="vs-link" onClick={() => setOpen(false)}>
            About
          </NavLink>

          {/* Contact page */}
          <NavLink to="/contact" className="vs-link" onClick={() => setOpen(false)}>
            Contact
           </NavLink>

          {/* FAQs page */}
           <NavLink to="/faqs" className="vs-link" onClick={() => setOpen(false)}>
             FAQs
           </NavLink>


          <div className="vs-nav-actions">
            <Link
              to="/admin"
              className="vs-btn vs-btn-ghost"
              onClick={() => setOpen(false)}
            >

              Admin Login
            </Link>
            <Link
              to="/voter"
              className="vs-btn vs-btn-primary"
              onClick={() => setOpen(false)}
            >
              Register / Vote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

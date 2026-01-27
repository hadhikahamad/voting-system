import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="landing-nav">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="landing-brand d-flex align-items-center gap-2">
          <div className="landing-brand-dot">i</div>
          <span className="landing-brand-text">VOTE</span>
        </Link>

        {/* Links */}
        <div className="d-none d-md-flex align-items-center gap-1">
          <NavLink to="/" className="landing-link">Home</NavLink>
          <NavLink to="/about" className="landing-link">About</NavLink>
          <NavLink to="/contact" className="landing-link">Contact</NavLink>
          <NavLink to="/faqs" className="landing-link">FAQs</NavLink>
        </div>

        {/* Buttons */}
        <div className="d-flex align-items-center gap-2">
          <Link to="/login" className="landing-btn landing-btn-outline">Log in</Link>
          <Link to="/register" className="landing-btn landing-btn-solid">Register</Link>
        </div>
      </div>
    </nav>
  );
}

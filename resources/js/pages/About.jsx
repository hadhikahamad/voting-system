import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Strongsec from "../images/About_Strong_security.png";
import AuditRe from "../images/About_Audit&Reports.png";
import FastSe from "../images/About_Fast_Setup.png";
import Realtime from "../images/About_RealTimeInsights.png";
import SimpleFor from "../images/About_SimpleFor_Voters.png";
import MobileFr from "../images/Mobile_Friendly.png";



export default function About() {
  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <div className="about-badge">
                <span className="dot" />
                About VoteSecure
              </div>

              <h1 className="about-title">
                Building <span>trust</span> in every election
              </h1>

              <p className="about-subtitle">
                VoteSecure is an online voting platform designed for universities and organizations.
                We focus on security, transparency, and a smooth voting experience for both voters and admins.
              </p>

              <div className="about-actions">
                <Link to="/voter" className="vs-btn vs-btn-primary">
                  Register as Voter
                </Link>
                <Link to="/admin" className="vs-btn vs-btn-ghost">
                  Admin Panel
                </Link>
              </div>

              <div className="about-mini-points">
                <div className="about-mini">
                  <div className="about-mini-icon">🔒</div>
                  <div>
                    <div className="about-mini-title">Secure</div>
                    <div className="about-mini-sub">Role-based access control</div>
                  </div>
                </div>

                <div className="about-mini">
                  <div className="about-mini-icon">✅</div>
                  <div>
                    <div className="about-mini-title">Verified</div>
                    <div className="about-mini-sub">Prevent duplicate voting</div>
                  </div>
                </div>

                <div className="about-mini">
                  <div className="about-mini-icon">📊</div>
                  <div>
                    <div className="about-mini-title">Fast Results</div>
                    <div className="about-mini-sub">Real-time reporting</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="about-card">
              <div className="about-card-top">
                <div className="about-card-title">Election Snapshot</div>
                <div className="about-pill">Live</div>
              </div>

              <div className="about-metric">
                <div className="about-metric-label">Registered Voters</div>
                <div className="about-metric-value">1,280</div>
              </div>

              <div className="about-metric">
                <div className="about-metric-label">Votes Submitted</div>
                <div className="about-metric-value">940</div>
              </div>

              <div className="about-progress">
                <div className="about-progress-top">
                  <span>Participation</span>
                  <span>73%</span>
                </div>
                <div className="about-bar">
                  <div className="about-bar-fill" />
                </div>
              </div>

              <div className="about-card-footer">
                <div className="about-note">
                  <span className="about-note-dot" />
                  Transparent counting with audit logs
                </div>
                <Link to="/admin" className="about-link">
                  Manage elections →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="vs-blob" aria-hidden="true" />
      </section>

      {/* MISSION + VISION */}
      <section className="about-section">
        <div className="container">
          <div className="about-split">
            <div className="about-box">
              <h2>Our Mission</h2>
              <p>
                To make elections modern, secure, and accessible—reducing paperwork, improving speed,
                and increasing confidence in results.
              </p>
            </div>

            <div className="about-box">
              <h2>Our Vision</h2>
              <p>
                A future where every institution can conduct fair elections online with transparency
                and a great user experience for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-section about-section-alt">
        <div className="container">
          <div className="vs-section-head">
            <h2>Why choose VoteSecure?</h2>
            <p>Designed for credibility, performance, and ease of use.</p>
          </div>

          <div className="about-grid">
            <div className="about-feature">
              <img src={Strongsec} alt="Secure Platform" className="vs-feature-img" />
              <h3>Strong Security</h3>
              <p>Protected access, safer voting flow, and controlled admin actions.</p>
            </div>

            <div className="about-feature">
             <img src={AuditRe} alt="Audit&reports" className="vs-feature-img" />
              <h3>Audit & Reports</h3>
              <p>Generate reports, track election activity, and maintain transparency.</p>
            </div>

            <div className="about-feature">
              <img src={FastSe} alt="Fast-setup" className="vs-feature-img" />
              <h3>Fast Setup</h3>
              <p>Create elections, add candidates, and manage voters in minutes.</p>
            </div>

            <div className="about-feature">
              <img src={MobileFr} alt="mobile-friendly" className="vs-feature-img" />
              <h3>Mobile Friendly</h3>
              <p>Works smoothly on phones, tablets, and desktops with responsive UI.</p>
            </div>

            <div className="about-feature">
              <img src={SimpleFor} alt="Simplefor" className="vs-feature-img" />
              <h3>Simple for Voters</h3>
              <p>Clear screens and minimal steps—users can vote without confusion.</p>
            </div>

            <div className="about-feature">
              <img src={Realtime} alt="Realtime" className="vs-feature-img" />
              <h3>Real-Time Insights</h3>
              <p>Track voting participation and results quickly after voting closes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-section">
        <div className="container">
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-value">99.9%</div>
              <div className="about-stat-label">System availability</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">Secure</div>
              <div className="about-stat-label">Role-based access</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">Fast</div>
              <div className="about-stat-label">Quick result generation</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">Responsive</div>
              <div className="about-stat-label">Mobile-first design</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-inner">
            <div>
              <h2>Ready to run a secure online election?</h2>
              <p>Start with voter registration or set up elections in the admin panel.</p>
            </div>
            <div className="about-cta-actions">
              <Link to="/voter" className="vs-btn vs-btn-primary">
                Register Now
              </Link>
              <Link to="/admin" className="vs-btn vs-btn-ghost">
                Admin Setup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="vs-footer">
        <div className="container">
          <div className="vs-footer-bottom">
            © {new Date().getFullYear()} VoteSecure — Laravel + React
          </div>
        </div>
      </footer>
    </div>
  );
}

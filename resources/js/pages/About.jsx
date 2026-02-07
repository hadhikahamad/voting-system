import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

// Images
import heroImg from "../images/About.png";
import Strongsec from "../images/About_Strong_security.png";
import AuditRe from "../images/About_Audit&Reports.png";
import FastSe from "../images/About_Fast_Setup.png";
import Realtime from "../images/About_RealTimeInsights.png";
import SimpleFor from "../images/About_SimpleFor_Voters.png";
import MobileFr from "../images/Mobile_Friendly.png";
import hadhikImg from "../images/hadhik.png";
import sumuduImg from "../images/sumudu.jpeg";

export default function About() {
  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO SECTION */}
      <section className="vs-hero">
        <div className="container">
          <div className="vs-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
            {/* HERO LEFT - TEXT */}
            <div className="vs-hero-left">
              <div className="vs-badge">
                <span className="dot" />
                About VoteSecure
              </div>

              <h1 className="vs-title">
                Building Trust in <span>Digital Democracy</span>
              </h1>

              <p className="vs-subtitle">
                VoteSecure eliminates the complexities of traditional voting. We provide a
                seamless, verifiable, and secure platform that empowers organizations to
                conduct elections with absolute confidence.
              </p>

              {/* STATS */}
              <div className="vs-stats">
                <div className="vs-stat">
                  <div className="vs-stat-value">Mission</div>
                  <div className="vs-stat-label">Secure Voting</div>
                </div>
                <div className="vs-stat">
                  <div className="vs-stat-value">Vision</div>
                  <div className="vs-stat-label">Fair Elections</div>
                </div>
                <div className="vs-stat">
                  <div className="vs-stat-value">Goal</div>
                  <div className="vs-stat-label">Transparency</div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT - IMAGE */}
            <div className="vs-hero-right">
              <div className="vs-hero-card vs-animate-float" style={{ padding: '0', overflow: 'hidden', background: 'transparent', border: 'none' }}>
                <img
                  src={heroImg}
                  alt="About VoteSecure"
                  style={{ width: '100%', maxWidth: '500px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="vs-blob" aria-hidden="true" />
      </section>

      {/* MISSION & VISION */}
      <section className="vs-section">
        <div className="container">
          <div className="vs-section-head">
            <h2>Our Core Values</h2>
            <p>Guiding principles that drive our platform's development.</p>
          </div>

          <div className="vs-steps">
            <div className="vs-step">
              <div className="vs-step-num"><i className="fa-solid fa-rocket"></i></div>
              <h3>Our Mission</h3>
              <p>To provide a voting platform that is accessible to everyone, ensuring that every single vote is counted accurately and securely without compromise.</p>
            </div>

            <div className="vs-step">
              <div className="vs-step-num"><i className="fa-solid fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>A future where organizational elections are completely transparent, verifiable, and free from the logistical nightmares of paper ballots.</p>
            </div>

            <div className="vs-step">
              <div className="vs-step-num"><i className="fa-solid fa-shield-halved"></i></div>
              <h3>Our Promise</h3>
              <p>We commit to bank-grade security standards, ensuring that election integrity is never put at risk during the voting process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="vs-section vs-section-alt">
        <div className="container">
          <div className="vs-section-head">
            <h2>Why Organizations Trust Us</h2>
            <p>Engineered for performance, security, and scale.</p>
          </div>

          <div className="vs-features">
            <div className="vs-feature">
              <img src={Strongsec} alt="Security" className="vs-feature-img" />
              <h3>Bank-Grade Security</h3>
              <p>End-to-end encryption and role-based access control.</p>
            </div>

            <div className="vs-feature">
              <img src={AuditRe} alt="Audit" className="vs-feature-img" />
              <h3>Full Audit Trails</h3>
              <p>Every action is logged for complete transparency.</p>
            </div>

            <div className="vs-feature">
              <img src={FastSe} alt="Fast Setup" className="vs-feature-img" />
              <h3>Instant Deployment</h3>
              <p>Launch an election in minutes, not days.</p>
            </div>

            <div className="vs-feature">
              <img src={Realtime} alt="Real-Time" className="vs-feature-img" />
              <h3>Real-Time Results</h3>
              <p>Watch the results unfold instantly as votes are cast.</p>
            </div>

            <div className="vs-feature">
              <img src={SimpleFor} alt="Simple" className="vs-feature-img" />
              <h3>Voter Centric</h3>
              <p>An intuitive interface designed for everyone.</p>
            </div>

            <div className="vs-feature">
              <img src={MobileFr} alt="Mobile" className="vs-feature-img" />
              <h3>Mobile Optimized</h3>
              <p>Vote from any device, anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="vs-section">
        <div className="container">
          <div className="vs-section-head vs-text-center mb-5">
            <h2>Meet Our Team</h2>
            <p>The minds behind the secure voting platform.</p>
          </div>

          <div className="vs-grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Member 1: Hadhik */}
            <div className="vs-card vs-team-card vs-text-center vs-animate-slide-up">
              <div className="mb-4 vs-team-img-wrapper" style={{ width: '200px', height: '200px', borderRadius: '20px', overflow: 'hidden', margin: '0 auto', border: '4px solid rgba(48, 213, 200, 0.3)' }}>
                <img src={hadhikImg} alt="Hadhik" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <h3 className="mb-1">Hadhik</h3>
              <div className="vs-badge vs-badge-info mb-3">BICT Undergraduate</div>
              <div className="vs-flex-center gap-3 mt-3 vs-team-social">
                <a href="#" className="vs-text-muted hover-primary"><i className="fa-brands fa-linkedin fa-lg"></i></a>
                <a href="#" className="vs-text-muted hover-primary"><i className="fa-brands fa-github fa-lg"></i></a>
                <a href="#" className="vs-text-muted hover-primary"><i className="fa-solid fa-envelope fa-lg"></i></a>
              </div>
            </div>

            {/* Member 2: Sumudu */}
            <div className="vs-card vs-team-card vs-text-center vs-animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4 vs-team-img-wrapper" style={{ width: '200px', height: '200px', borderRadius: '20px', overflow: 'hidden', margin: '0 auto', border: '4px solid rgba(109, 92, 255, 0.3)' }}>
                <img src={sumuduImg} alt="Sumudu" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <h3 className="mb-1">Sumudu</h3>
              <div className="vs-badge vs-badge-info mb-3">BICT Undergraduate</div>
              <div className="vs-flex-center gap-3 mt-3 vs-team-social">
                <a href="#" className="vs-text-muted hover-primary"><i className="fa-brands fa-linkedin fa-lg"></i></a>
                <a href="#" className="vs-text-muted hover-primary"><i className="fa-brands fa-github fa-lg"></i></a>
                <a href="#" className="vs-text-muted hover-primary"><i className="fa-solid fa-envelope fa-lg"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

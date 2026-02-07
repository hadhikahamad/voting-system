import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

import heroImg from "../images/Hero.png";
import signupImg from "../images/signup.png";
import voteImg from "../images/vote.png";
import resultsImg from "../images/results.png";
import secureImg from "../images/Secure_platform.png";
import verificationImg from "../images/Voter_verification.png";
import realtimeImg from "../images/Real-time-results.png";
import mobileImg from "../images/Mobile_Friendly.png";
import auditImg from "../images/Audit_Ready.png";
import fastImg from "../images/Fast_setup.png";


export default function Landing() {
  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO */}
      <section className="vs-hero">
        <div className="container">
          <div className="vs-hero-grid">
            <div className="vs-hero-left">
              <div className="vs-badge">
                <span className="dot" />
                Secure • Transparent • Fast
              </div>

              <h1 className="vs-title">
                Modern <span>Online Voting</span> for Universities & Organizations
              </h1>

              <p className="vs-subtitle">
                Run elections with confidence. Simple voter registration, protected ballots,
                and real-time results — built for fairness and ease.
              </p>

              <div className="vs-hero-actions">
                <Link to="/voter" className="vs-btn vs-btn-primary">
                  Register as Voter
                </Link>
                <Link to="/how-it-works" className="vs-btn vs-btn-ghost vs-animate-pulse">
                  How It Works
                </Link>
              </div>

              <div className="vs-stats">
                <div className="vs-stat vs-animate-slide-up vs-delay-100">
                  <div className="vs-stat-value">99.9%</div>
                  <div className="vs-stat-label">Uptime</div>
                </div>
                <div className="vs-stat vs-animate-slide-up vs-delay-200">
                  <div className="vs-stat-value">2x</div>
                  <div className="vs-stat-label">Faster Results</div>
                </div>
                <div className="vs-stat vs-animate-slide-up vs-delay-300">
                  <div className="vs-stat-value">Secure</div>
                  <div className="vs-stat-label">Access Control</div>
                </div>
              </div>
            </div>

            <div className="vs-hero-right">
              <div className="vs-hero-card vs-animate-float">
                <img src={heroImg} alt="Voting illustration" className="vs-hero-img" />
                <div className="vs-hero-card-bottom">
                  <div className="vs-mini">
                    <div className="vs-mini-icon vs-animate-pulse">🗳️</div>
                    <div className="vs-animate-slide-up">
                      <div className="vs-mini-title">Live Election</div>
                      <div className="vs-mini-sub">Track status in real-time</div>
                    </div>
                  </div>
                  <div className="vs-pill">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="vs-blob" aria-hidden="true" />
      </section>

      {/* HOW IT WORKS */}
      <section className="vs-section" id="how">
        <div className="container">
          <div className="vs-section-head">
            <h2>How it works</h2>
            <p>Three steps to a secure election process.</p>
          </div>

          <div className="vs-steps">
            {/* Step 1 */}
            <div className="vs-step">
              <img src={signupImg} alt="Sign Up" className="vs-step-img" />

              <div className="vs-step-num">1</div>
              <h3>Sign Up</h3>
              <p>Create your voter account and verify your identity.</p>
              <Link to="/voter" className="vs-step-link">
                Register now →
              </Link>
            </div>

            {/* Step 2 */}
            <div className="vs-step">
              <img src={voteImg} alt="Vote" className="vs-step-img" />

              <div className="vs-step-num">2</div>
              <h3>Vote</h3>
              <p>Vote for your preferred candidate with a simple interface.</p>
              <a href="#features" className="vs-step-link">
                See features →
              </a>
            </div>

            {/* Step 3 */}
            <div className="vs-step">
              <img src={resultsImg} alt="Results" className="vs-step-img" />

              <div className="vs-step-num">3</div>
              <h3>Results</h3>
              <p>View results instantly once voting closes.</p>
              <a href="#contact" className="vs-step-link">
                Contact support →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="vs-section vs-section-alt" id="features">
        <div className="container">
          <div className="vs-section-head">
            <h2>Core Features</h2>
            <p>Everything you need to run a credible election online.</p>
          </div>

          <div className="vs-features">
            <div className="vs-feature">
              <img src={secureImg} alt="Secure Platform" className="vs-feature-img" />
              <h3>Secure Platform</h3>
              <p>Role-based access, protected ballots, and safe workflows.</p>
            </div>

            <div className="vs-feature">
              <img src={verificationImg} alt="Voter Verification" className="vs-feature-img" />
              <h3>Voter Verification</h3>
              <p>Prevent duplicate votes and ensure only eligible voters participate.</p>
            </div>

            <div className="vs-feature">
              <img src={realtimeImg} alt="Real-time Results" className="vs-feature-img" />
              <h3>Real-time Results</h3>
              <p>Transparent result tracking with fast counting and summaries.</p>
            </div>

            <div className="vs-feature">
              <img src={mobileImg} alt="Mobile Friendly" className="vs-feature-img" />
              <h3>Mobile Friendly</h3>
              <p>Responsive design that works smoothly on phones and tablets.</p>
            </div>

            <div className="vs-feature">
              <img src={auditImg} alt="Audit Ready" className="vs-feature-img" />
              <h3>Audit Ready</h3>
              <p>Exportable reports and clear election logs for review.</p>
            </div>

            <div className="vs-feature">
              <img src={fastImg} alt="Fast Setup" className="vs-feature-img" />
              <h3>Fast Setup</h3>
              <p>Create elections, candidates, and voters quickly from admin panel.</p>
            </div>
          </div>

          <div className="vs-cta">
            <div>
              <h3>Ready to run your next election?</h3>
              <p>Start with voter registration or go to admin setup.</p>
            </div>
            <div className="vs-cta-actions">
              <Link to="/voter" className="vs-btn vs-btn-primary vs-btn-sm">
                Get Started
              </Link>
              <Link to="/how-it-works" className="vs-btn vs-btn-ghost vs-btn-sm">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* FOOTER */}
      <Footer />
    </div>
  );
}

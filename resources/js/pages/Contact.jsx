import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";

export default function Contact() {
  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-inner">
            <h1 className="contact-title">
              Get in <span>Touch</span>
            </h1>
            <p className="contact-subtitle">
              Have questions about VoteSecure? Need support or guidance?
              We’re here to help you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* LEFT INFO */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p>
                Reach out to us using the details below or send us a message
                through the contact form.
              </p>

              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">support@votesecure.com</div>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">+94 76 678 4978</div>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <div className="contact-label">Address</div>
                  <div className="contact-value">
                    No,219/9,Nammuwawa,Helogama,Nikaweratiya
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="contact-form-card">
              <h2>Send us a message</h2>

              <form className="contact-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                />
                <textarea
                  rows="5"
                  placeholder="Your Message"
                  required
                />

                <button type="submit" className="vs-btn vs-btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta">
        <div className="container">
          <div className="contact-cta-inner">
            <div>
              <h2>Need immediate access?</h2>
              <p>Go to voter registration or admin panel.</p>
            </div>
            <div className="contact-cta-actions">
              <Link to="/voter" className="vs-btn vs-btn-primary">
                Register as Voter
              </Link>
              <Link to="/admin" className="vs-btn vs-btn-ghost">
                Admin Panel
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

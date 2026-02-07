import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO / HEADER SECTION */}
      <section className="vs-hero" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="vs-badge" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
              <span className="dot" />
              Get in Touch
            </div>

            <h1 className="vs-title">
              We'd Love to <span>Hear From You</span>
            </h1>

            <p className="vs-subtitle" style={{ margin: '0 auto 2rem' }}>
              Have a question about setting up an election? Need support?
              Our team is ready to help you run a smooth and secure voting process.
            </p>
          </div>
        </div>
        <div className="vs-blob" aria-hidden="true" />
      </section>

      {/* CONTACT GRID SECTION */}
      <section className="vs-section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="vs-hero-grid" style={{ alignItems: 'start', gap: '3rem' }}>

            {/* LEFT: FORM */}
            <div className="vs-hero-left">
              <div className="vs-card p-5">
                <h3 className="mb-4">Send us a message</h3>

                {status.message && (
                  <div className={`vs-alert vs-alert-${status.type === 'success' ? 'success' : 'danger'} mb-4 vs-fade-in`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="vs-label">Full Name</label>
                    <input
                      type="text"
                      className="vs-input"
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="vs-label">Email Address</label>
                    <input
                      type="email"
                      className="vs-input"
                      placeholder="you@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="vs-label">Subject</label>
                    <input
                      type="text"
                      className="vs-input"
                      placeholder="How can we help?"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="vs-label">Message</label>
                    <textarea
                      className="vs-input"
                      rows="4"
                      placeholder="Tell us more..."
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="vs-btn vs-btn-primary"
                    style={{ width: '100%' }}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: INFO CARDS */}
            <div className="vs-hero-right">
              <div className="vs-steps" style={{ gridTemplateColumns: '1fr' }}>

                <div className="vs-step" style={{ textAlign: 'left', alignItems: 'flex-start', padding: '2rem' }}>
                  <div className="vs-icon-wrapper-modern">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <h3 className="h5">Email Us</h3>
                  <p style={{ marginBottom: '0.5rem', color: '#a1a1aa' }}>For general inquiries and support:</p>
                  <a href="mailto:support@votesecure.com" style={{ color: '#fff' }}>support@votesecure.com</a>
                </div>

                <div className="vs-step" style={{ textAlign: 'left', alignItems: 'flex-start', padding: '2rem' }}>
                  <div className="vs-icon-wrapper-modern">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <h3 className="h5">Call Us</h3>
                  <p style={{ marginBottom: '0.5rem', color: '#a1a1aa' }}>Mon-Fri from 8am to 5pm:</p>
                  <a href="tel:+94766784978" style={{ color: '#fff' }}>+94 76 678 4978</a>
                </div>

                <div className="vs-step" style={{ textAlign: 'left', alignItems: 'flex-start', padding: '2rem' }}>
                  <div className="vs-icon-wrapper-modern">
                    <i className="fa-solid fa-building"></i>
                  </div>
                  <h3 className="h5">Visit Us</h3>
                  <p style={{ color: '#a1a1aa', marginBottom: '0' }}>
                    123 Innovation Drive,<br />
                    Tech City, TC 90210
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

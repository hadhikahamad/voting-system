import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from '../components/Footer';
import AuthSlideshow from "../components/AuthSlideshow";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    voter_id: "",
    password: "",
    password_confirmation: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('voter_id', formData.voter_id);
      formDataObj.append('password', formData.password);
      formDataObj.append('password_confirmation', formData.password_confirmation);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          throw new Error(firstError);
        }
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMsg("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/voter"), 1200);

    } catch (err) {
      setMsg(err.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vs-page">
      <LandingNavbar />

      <div className="vs-auth-container" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: '#0f172a' }}>
        {/* Left Side - Slideshow */}
        <div className="vs-auth-image" style={{ flex: '1', display: 'none', position: 'relative', overflow: 'hidden' }}>
          <AuthSlideshow />

          {/* CSS media query to show on desktop only */}
          <style>{`
               @media (min-width: 900px) {
                   .vs-auth-image { display: block !important; }
               }
           `}</style>
        </div>

        {/* Vertical Divider */}
        <div className="vs-auth-divider">
          <div className="vs-divider-line"></div>
          <div className="vs-divider-line"></div>
        </div>

        {/* Right Side - Form */}
        <div className="vs-auth-form-container vs-animate-gradient" style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(-45deg, #0f172a, #1e293b, #0f172a, #172554)' }}>
          <div className="vs-card vs-glass-card-hover" style={{ maxWidth: '500px', width: '100%', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.4s ease' }}>

            <div className="text-center mb-4 vs-animate-slide-up">
              <h2 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>Create Account</h2>
              <p className="vs-text-muted">Join VoteSecure to participate in elections.</p>
            </div>

            {msg && (
              <div className={`vs-alert mb-4 ${msg.includes('✅') ? 'vs-alert-success' : 'vs-alert-danger'}`} style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`fa-solid ${msg.includes('✅') ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                {msg}
              </div>
            )}

            <form onSubmit={submit} autoComplete="off">
              <div className="vs-input-group mb-3 vs-animate-slide-up vs-delay-100">
                <label className="vs-label" style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-user" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                  <input
                    type="text"
                    className="vs-input"
                    name="name"
                    value={formData.name}
                    onChange={change}
                    placeholder="Enter your full name"
                    required
                    style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                  />
                </div>
              </div>

              <div className="vs-input-group mb-3 vs-animate-slide-up vs-delay-100">
                <label className="vs-label" style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Voter ID Number</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-id-card" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                  <input
                    type="text"
                    className="vs-input"
                    name="voter_id"
                    value={formData.voter_id}
                    onChange={change}
                    placeholder="e.g. ABC1234567"
                    required
                    style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                  />
                </div>
                <small className="vs-text-muted mt-1 d-block" style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '5px' }}>
                  Used for identity verification.
                </small>
              </div>

              <div className="vs-input-group mb-3 vs-animate-slide-up vs-delay-200">
                <label className="vs-label" style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                  <input
                    type="email"
                    className="vs-input"
                    name="email"
                    value={formData.email}
                    onChange={change}
                    placeholder="name@example.com"
                    required
                    style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                  />
                </div>
              </div>

              <div className="vs-input-group mb-3 vs-animate-slide-up vs-delay-200">
                <label className="vs-label" style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Profile Photo (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-camera" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                  <input
                    type="file"
                    className="vs-input"
                    name="photo"
                    onChange={e => setData('photo', e.target.files[0])}
                    accept="image/jpeg,image/png,image/gif,image/avif"
                    style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)', paddingTop: '10px' }}
                  />
                </div>
              </div>

              <div className="row vs-animate-slide-up vs-delay-200">
                <div className="col-md-6">
                  <div className="vs-input-group mb-4">
                    <label className="vs-label" style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                      <input
                        type="password"
                        className="vs-input"
                        name="password"
                        value={formData.password}
                        onChange={change}
                        placeholder="••••••••"
                        required
                        style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="vs-input-group mb-4">
                    <label className="vs-label" style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                      <input
                        type="password"
                        className="vs-input"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={change}
                        placeholder="••••••••"
                        required
                        style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="vs-btn vs-btn-primary vs-w-full vs-animate-slide-up vs-delay-300"
                disabled={loading}
                style={{ padding: '14px', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.5px' }}
              >
                {loading ? (
                  <span><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Creating account...</span>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </form>

            <div className="vs-auth-footer mt-4 text-center vs-animate-slide-up vs-delay-300">
              <p style={{ color: '#94a3b8' }}>
                Already have an account? <Link to="/login" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div >

      <Footer />
    </div >
  );
}

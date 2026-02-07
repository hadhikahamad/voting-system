import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from '../components/Footer';

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

      <div className="vs-auth-wrapper">
        <div className="vs-auth-card vs-fade-in">
          <div className="vs-auth-head">
            <h3>Register as Voter</h3>
            <p>Create your voter account to vote in elections.</p>
          </div>

          {msg && (
            <div className={`vs-alert ${msg.includes('✅') ? 'vs-alert-success' : 'vs-alert-danger'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="vs-auth-form" autoComplete="off">
            <div className="vs-input-group">
              <label className="vs-label">Full Name</label>
              <input
                type="text"
                className="vs-input"
                name="name"
                value={formData.name}
                onChange={change}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="vs-input-group">
              <label className="vs-label">Voter ID Number</label>
              <input
                type="text"
                className="vs-input"
                name="voter_id"
                value={formData.voter_id}
                onChange={change}
                placeholder="e.g. ABC1234567"
                required
              />
              <small className="vs-text-muted mt-1 d-block" style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                Used for identity verification.
              </small>
            </div>

            <div className="vs-input-group">
              <label className="vs-label">Email Address</label>
              <input
                type="email"
                className="vs-input"
                name="email"
                value={formData.email}
                onChange={change}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="vs-input-group">
              <label className="vs-label">Password</label>
              <input
                type="password"
                className="vs-input"
                name="password"
                value={formData.password}
                onChange={change}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="vs-input-group">
              <label className="vs-label">Confirm Password</label>
              <input
                type="password"
                className="vs-input"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={change}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              className="vs-btn vs-btn-primary vs-w-full mt-2"
              disabled={loading}
              style={{ padding: '14px' }}
            >
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>

          <div className="vs-auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

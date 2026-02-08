import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import AuthSlideshow from "../components/AuthSlideshow";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const change = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/voter");
            }

        } catch (err) {
            setMsg(err.message || "❌ Login failed");
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

                    {/* CSS media query to show on desktop only - inline style used for simplicity, assume md breakpoint ~768px */}
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
                    <div className="vs-card vs-glass-card-hover" style={{ maxWidth: '450px', width: '100%', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.4s ease' }}>

                        <div className="text-center mb-5 vs-animate-slide-up">
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>Welcome Back</h2>
                            <p className="vs-text-muted">Enter your credentials to access your account.</p>
                        </div>

                        {msg && (
                            <div className={`vs-alert mb-4 ${msg.includes('Login failed') ? 'vs-alert-danger' : 'vs-alert-success'}`} style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className={`fa-solid ${msg.includes('Login failed') ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                                {msg}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="vs-input-group mb-4 vs-animate-slide-up vs-delay-100">
                                <label className="vs-label" style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                                    <input
                                        type="email"
                                        className="vs-input"
                                        name="email"
                                        value={form.email}
                                        onChange={change}
                                        placeholder="name@example.com"
                                        required
                                        style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                                    />
                                </div>
                            </div>

                            <div className="vs-input-group mb-5 vs-animate-slide-up vs-delay-200">
                                <label className="vs-label" style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                                    <input
                                        type="password"
                                        className="vs-input"
                                        name="password"
                                        value={form.password}
                                        onChange={change}
                                        placeholder="••••••••"
                                        required
                                        style={{ paddingLeft: '45px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="vs-btn vs-btn-primary vs-w-full vs-animate-slide-up vs-delay-300"
                                disabled={loading}
                                style={{ padding: '14px', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.5px' }}
                            >
                                {loading ? (
                                    <span><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Logging in...</span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            <div className="vs-auth-footer mt-4 text-center vs-animate-slide-up vs-delay-300">
                                <p style={{ color: '#94a3b8' }}>
                                    Don't have an account? <Link to="/register" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

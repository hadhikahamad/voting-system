import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import axios from "axios";

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

            <div className="vs-main vs-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="vs-card">
                        <div className="vs-text-center mb-4">
                            <h2>Welcome Back</h2>
                            <p className="vs-text-muted">Login to continue to VoteSecure</p>
                        </div>

                        {msg && (
                            <div className={`vs-badge mb-3 ${msg.includes('success') ? 'vs-badge-success' : 'vs-badge-danger'}`} style={{ display: 'flex', width: '100%', padding: '10px' }}>
                                {msg}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="vs-input-group">
                                <label className="vs-label">Email Address</label>
                                <input
                                    type="email"
                                    className="vs-input"
                                    name="email"
                                    value={form.email}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <div className="vs-input-group">
                                <label className="vs-label">Password</label>
                                <input
                                    type="password"
                                    className="vs-input"
                                    name="password"
                                    value={form.password}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="vs-btn vs-btn-primary vs-w-full mb-4"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <div className="vs-auth-footer">
                                Don't have an account? <Link to="/register">Register here</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

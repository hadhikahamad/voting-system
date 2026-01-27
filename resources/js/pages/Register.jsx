import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      // ✅ register new voter user
      await axios.post("/register", form);

      setMsg("✅ Registration successful! Redirecting to Login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LandingNavbar />

      <div className="auth-bg py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-lg border-0 rounded-4 p-4">
                <h3 className="fw-bold mb-2 text-center">Register as Voter</h3>
                <p className="text-muted text-center">
                  Create your voter account to vote in elections.
                </p>

                {msg && <div className="alert alert-info">{msg}</div>}

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={change}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={change}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={change}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password_confirmation"
                      value={form.password_confirmation}
                      onChange={change}
                      required
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2 fw-bold rounded-3"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>

                  <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-bold text-decoration-none">
                      Login
                    </Link>
                  </p>
                </form>
              </div>

              <div className="text-center text-muted small mt-3">
                © {new Date().getFullYear()} Voting System
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

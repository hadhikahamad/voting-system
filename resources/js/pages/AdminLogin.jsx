import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      // ✅ login request (Laravel session login)
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/login", { email, password });

      // ✅ After login, go to Admin page
      navigate("/admin");
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Invalid credentials");
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
                <h3 className="fw-bold mb-2 text-center">Admin Login</h3>
                <p className="text-muted text-center">
                  Only admins can access the admin panel.
                </p>

                {msg && <div className="alert alert-danger">{msg}</div>}

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    className="btn btn-success w-100 py-2 fw-bold rounded-3"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login as Admin"}
                  </button>

                  <p className="text-center mt-3 mb-0">
                    Not a voter?{" "}
                    <Link to="/register" className="fw-bold text-decoration-none">
                      Register
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

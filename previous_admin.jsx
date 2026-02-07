import React from "react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Admin Panel</h2>
          <p className="text-muted mb-4">
            This is the admin page. Here admin will create elections and add candidates.
          </p>

          <div className="alert alert-warning mb-4">
            Next step: We will build Create Election + Add Candidate forms with API.
          </div>

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-outline-secondary">Back Home</Link>
            <Link to="/voter" className="btn btn-success">Go Voter Panel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

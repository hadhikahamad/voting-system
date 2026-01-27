import React from "react";
import { Link } from "react-router-dom";

export default function VoterPanel() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Voter Panel</h2>
          <p className="text-muted mb-4">
            This is the voter page. Here you will see elections and submit your vote.
          </p>

          <div className="alert alert-info mb-4">
            Next step: We will connect this page to your database elections + candidates.
          </div>

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-outline-secondary">Back Home</Link>
            <Link to="/admin" className="btn btn-primary">Go Admin Panel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

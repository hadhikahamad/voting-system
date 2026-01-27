import React from "react";

export default function Admin() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold mb-3">Admin Panel</h3>
        <p className="text-muted">
          Manage elections, candidates and results.
        </p>

        <div className="alert alert-warning">
          Admin controls will be added here.
        </div>
      </div>
    </div>
  );
}

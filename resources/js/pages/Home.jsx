import React from "react";

export default function Home() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold mb-3">Voter Dashboard</h3>
        <p className="text-muted">
          Welcome! Select an election and cast your vote.
        </p>

        <div className="alert alert-info">
          Voting functionality will appear here.
        </div>
      </div>
    </div>
  );
}

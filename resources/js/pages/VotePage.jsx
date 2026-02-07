import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";

export default function VotePage() {
    const { electionId } = useParams();
    const navigate = useNavigate();

    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchElectionDetails();
    }, [electionId]);

    const fetchElectionDetails = async () => {
        try {
            // Fetch Election Info
            const electionRes = await fetch(`http://localhost:8000/api/elections/${electionId}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!electionRes.ok) throw new Error("Failed to load election details");
            const electionData = await electionRes.json();
            setElection(electionData);

            // Fetch Candidates
            const candidatesRes = await fetch(`http://localhost:8000/api/elections/${electionId}/candidates`, {
                headers: { 'Accept': 'application/json' }
            });
            // Note: Endpoint might be different if your backend separates them, but assuming this exists based on Home.jsx
            if (candidatesRes.ok) {
                const candidatesData = await candidatesRes.json();
                setCandidates(candidatesData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedCandidate) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to vote.");
            navigate("/voter"); // Redirect to login/register
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/vote", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    election_id: electionId,
                    candidate_id: selectedCandidate,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Vote submitted successfully!");
                setCandidates([]); // Hide candidates or show results
                setTimeout(() => navigate("/"), 2000); // Redirect after 2s
            } else {
                setError(data.message || "Failed to submit vote");
            }
        } catch (err) {
            setError("Error submitting vote: " + err.message);
        }
    };

    if (loading) return (
        <div className="vs-page">
            <LandingNavbar />
            <div className="vs-main vs-container vs-text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p>Loading election...</p>
            </div>
        </div>
    );

    return (
        <div className="vs-page">
            <LandingNavbar />

            <main className="vs-main">
                <div className="vs-container">
                    <div className="vs-card mb-4">
                        {error && <div className="vs-badge vs-badge-danger mb-3">{error}</div>}
                        {success && <div className="vs-badge vs-badge-success mb-3">{success}</div>}

                        {election && (
                            <>
                                <h1 className="mb-2">{election.title}</h1>
                                <p className="vs-text-muted">{election.description}</p>
                                <div className="mt-3">
                                    <span className={`vs-badge ${election.status === 'active' ? 'vs-badge-success' : 'vs-badge-warning'}`}>
                                        {election.status}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <h2 className="mb-4">Candidates</h2>

                    {candidates.length > 0 ? (
                        <div className="vs-grid-3">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    className={`vs-card ${selectedCandidate === candidate.id ? 'active-candidate' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        borderColor: selectedCandidate === candidate.id ? 'var(--vs-primary)' : 'var(--vs-border)',
                                        background: selectedCandidate === candidate.id ? 'rgba(109, 92, 255, 0.1)' : 'var(--vs-bg-card)'
                                    }}
                                    onClick={() => setSelectedCandidate(candidate.id)}
                                >
                                    <div className="text-center mb-3">
                                        <div style={{
                                            width: '80px', height: '80px', background: '#333', borderRadius: '50%', margin: '0 auto',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                                        }}>
                                            👤
                                        </div>
                                    </div>
                                    <h3 className="vs-text-center">{candidate.name}</h3>
                                    <p className="vs-text-muted vs-text-center">{candidate.party || "Independent"}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="vs-text-muted">No candidates available or voting closed.</p>
                    )}

                    <div className="mt-4 vs-text-right">
                        <button
                            className="vs-btn vs-btn-primary"
                            disabled={!selectedCandidate || !!success}
                            onClick={handleVote}
                            style={{ fontSize: '1.2rem', padding: '12px 30px' }}
                        >
                            {success ? "Voted" : "Submit Vote"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

const Home = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [results, setResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicElections();
  }, []);

  const fetchPublicElections = async () => {
    try {
      const response = await fetch('/api/elections', {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        // Only show active elections
        setElections(data.filter(el => el.status === 'active'));
      } else {
        setError('Failed to load elections.');
      }
      setLoading(false);
    } catch (error) {
      setError('Cannot connect to server.');
      setLoading(false);
    }
  };

  const handleElectionSelect = async (electionId) => {
    try {
      const [candRes, resRes] = await Promise.all([
        fetch(`/api/elections/${electionId}/candidates`, { headers: { 'Accept': 'application/json' } }),
        fetch(`/api/elections/${electionId}/results`, { headers: { 'Accept': 'application/json' } })
      ]);

      if (candRes.ok && resRes.ok) {
        setCandidates(await candRes.json());
        setResults(await resRes.json());
        setSelectedElection(electionId);
        setSelectedCandidate('');
        setMessage('');

        setTimeout(() => {
          document.getElementById('candidate-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError('Failed to load election details.');
      }
    } catch (error) {
      setError('Failed to load election details.');
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage('Please select a candidate');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to cast your vote.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          election_id: selectedElection,
          candidate_id: selectedCandidate
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Your vote has been cast successfully!');
        setSuccess(true);
        setHasVoted(true);
        // Refresh results
        const resRes = await fetch(`/api/elections/${selectedElection}/results`, {
          headers: { 'Accept': 'application/json' }
        });
        if (resRes.ok) setResults(await resRes.json());

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage(data.message || 'Failed to submit vote');
        setSuccess(false);
      }
    } catch (error) {
      setMessage('Error submitting vote: ' + error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="vs-page">
      <LandingNavbar />

      <main className="vs-main">
        {/* HERO SECTION */}
        <section className="vs-hero-mini">
          <div className="vs-container">
            <div className="vs-fade-in">
              <h1 className="vs-hero-title-sm">Active Elections</h1>
              <p className="vs-hero-subtitle-sm">
                Secure. Transparent. Decentralized. Cast your vote in the active polls below.
              </p>
            </div>
          </div>
        </section>

        <div className="vs-container" style={{ paddingBottom: '80px' }}>
          {/* FEEDBACK HELPER */}
          {error && <div className="vs-badge vs-badge-danger mb-4 vs-w-full p-3">{error}</div>}

          {loading ? (
            <div className="vs-text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="vs-grid-3">
              {elections.length === 0 ? (
                <div className="vs-card vs-col-span-full vs-text-center py-5">
                  <h3 className="mb-2">No Active Elections</h3>
                  <p className="vs-text-muted">Stay tuned! New voting sessions will appear here soon.</p>
                </div>
              ) : (
                elections.map(election => (
                  <div
                    key={election.id}
                    className={`vs-card vs-election-card ${selectedElection === election.id ? 'active' : ''}`}
                    onClick={() => handleElectionSelect(election.id)}
                  >
                    <div className="vs-flex-between mb-3">
                      <span className="vs-badge vs-badge-success">LIVE</span>
                      <small className="vs-text-muted">Ends: {new Date(election.end_date).toLocaleDateString()}</small>
                    </div>
                    <h3 className="mb-2">{election.title}</h3>
                    <p className="vs-text-muted small mb-4">{election.description}</p>
                    <button className="vs-btn vs-btn-outline vs-w-full">
                      {selectedElection === election.id ? 'Selected' : 'View Ballot'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CANDIDATE SELECTION OR RESULTS */}
          {selectedElection && (
            <div id="candidate-section" className="vs-mt-5 vs-fade-in">
              <div className="vs-divider mb-5"></div>

              {/* RESULTS VIEW */}
              {results && results.results && (
                <div className="vs-card mb-5 vs-slide-down" style={{ border: '1px solid rgba(109, 92, 255, 0.2)', background: 'rgba(13, 17, 23, 0.6)' }}>
                  <div className="vs-flex-between mb-4">
                    <h2 className="m-0">Live Results</h2>
                    <div className="vs-badge vs-badge-success" style={{ animation: 'pulse 2s infinite' }}>● LIVE UPDATING</div>
                  </div>
                  <div className="vs-flex-column" style={{ gap: '25px' }}>
                    {results.results.map(res => (
                      <div key={res.candidate_id} className="vs-result-item-premium">
                        <div className="vs-flex-between mb-3">
                          <div className="vs-flex-center gap-3">
                            <div className="vs-avatar-sm">
                              {res.candidate?.photo ? (
                                <img src={`/storage/${res.candidate.photo}`} alt={res.candidate.name} />
                              ) : <i className="fa-solid fa-user-circle" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)' }}></i>}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{res.candidate?.name}</div>
                              <div className="vs-text-muted small vs-flex-center gap-2">
                                {res.candidate?.party_logo && <img src={`/storage/${res.candidate.party_logo}`} style={{ width: '16px' }} alt="L" />}
                                {res.candidate?.party || 'Independent'}
                              </div>
                            </div>
                          </div>
                          <div className="vs-text-right">
                            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#30d5c8' }}>{res.percentage}%</div>
                            <div className="vs-text-muted small">{res.votes} votes</div>
                          </div>
                        </div>
                        <div className="vs-progress-bg-premium">
                          <div
                            className="vs-progress-bar-premium"
                            style={{ width: `${res.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="vs-divider my-2"></div>
                    <div className="vs-flex-between vs-text-muted mt-2 px-2">
                      <span>Verification Method: Peer-to-Peer Blockchain</span>
                      <span style={{ fontWeight: 600, color: '#6d5cff' }}>Total Calculated: {results.total_votes}</span>
                    </div>
                  </div>
                </div>
              )}

              {!hasVoted && candidates.length > 0 && (
                <>
                  <h2 className="vs-text-center mb-5">Cast Your Vote</h2>
                  <div className="vs-grid-3">
                    {candidates.map(candidate => (
                      <div
                        key={candidate.id}
                        className={`vs-card vs-candidate-card ${selectedCandidate === candidate.id ? 'active' : ''}`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <div className="vs-candidate-avatar">
                          {candidate.photo ? (
                            <img src={`/storage/${candidate.photo}`} alt={candidate.name} />
                          ) : <i className="fa-solid fa-user-circle" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)' }}></i>}
                        </div>
                        <div className="vs-flex-center gap-2 mb-2">
                          {candidate.party_logo && (
                            <img
                              src={`/storage/${candidate.party_logo}`}
                              alt="Logo"
                              style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'contain' }}
                            />
                          )}
                          <h3 className="m-0">{candidate.name}</h3>
                        </div>
                        <p className="vs-text-muted mb-0">{candidate.party || 'Independent'}</p>

                        {selectedCandidate === candidate.id && (
                          <div className="vs-check-badge"><i className="fa-solid fa-check"></i></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="vs-text-center mt-5" style={{ maxWidth: '600px', margin: '40px auto 0' }}>
                    {message && (
                      <div className={`vs-badge ${success ? 'vs-badge-success' : 'vs-badge-danger'} mb-4 vs-w-full p-4 vs-slide-down`}>
                        <div className="vs-flex-center gap-3">
                          <span style={{ fontSize: '1.5rem' }}>
                            {success ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-solid fa-triangle-exclamation"></i>}
                          </span>
                          <span style={{ fontWeight: 600 }}>{message}</span>
                        </div>
                      </div>
                    )}
                    <button
                      className="vs-btn vs-btn-primary vs-btn-lg vs-w-full"
                      onClick={handleVote}
                      disabled={!selectedCandidate || loading}
                      style={{
                        padding: '20px 0',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}
                    >
                      {loading ? 'Submitting...' : 'Confirm & Cast Your Vote'}
                    </button>
                    <p className="vs-text-muted mt-4" style={{ fontSize: '0.9rem' }}>
                      <span style={{ color: '#ff6b6b' }}>*</span> This action is permanent and cannot be reversed on the blockchain.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
                .vs-hero-mini {
                    background: linear-gradient(180deg, rgba(13, 17, 23, 0.8) 0%, rgba(13, 17, 23, 1) 100%);
                    padding: 100px 0 60px;
                    text-align: center;
                }
                .vs-hero-title-sm {
                    font-size: 3rem;
                    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 16px;
                }
                .vs-hero-subtitle-sm {
                    font-size: 1.2rem;
                    color: rgba(255,255,255,0.6);
                    max-width: 600px;
                    margin: 0 auto;
                }
                .vs-election-card {
                    cursor: pointer;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .vs-election-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(109, 92, 255, 0.4);
                    background: rgba(255,255,255,0.05);
                }
                .vs-election-card.active {
                    background: rgba(109, 92, 255, 0.1);
                    border-color: #6d5cff;
                }
                .vs-candidate-card {
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                    padding: 40px 20px;
                    transition: all 0.3s;
                }
                .vs-candidate-card:hover {
                    background: rgba(255,255,255,0.05);
                }
                .vs-candidate-card.active {
                    background: rgba(109, 92, 255, 0.15);
                    border-color: #6d5cff;
                }
                .vs-candidate-avatar {
                    width: 80px;
                    height: 80px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    margin: 0 auto 20px;
                }
                .vs-check-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 30px;
                    height: 30px;
                    background: #30d5c8;
                    border-radius: 50%;
                    color: #0d1117;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    box-shadow: 0 0 15px rgba(48, 213, 200, 0.3);
                }
                .vs-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                }
                .vs-flex-gap { display: flex; gap: 10px; }
                .vs-progress-bg {
                    height: 12px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                    overflow: hidden;
                }
                .vs-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #6d5cff, #30d5c8);
                    box-shadow: 0 0 10px rgba(109, 92, 255, 0.5);
                    transition: width 1s ease-in-out;
                }
                .vs-result-item {
                    background: rgba(255,255,255,0.02);
                    padding: 15px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .vs-result-item-premium {
                    background: rgba(255,255,255,0.02);
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: all 0.3s;
                }
                .vs-result-item-premium:hover {
                    background: rgba(109, 92, 255, 0.05);
                    border-color: rgba(109, 92, 255, 0.2);
                }
                .vs-avatar-sm {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .vs-avatar-sm img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .vs-progress-bg-premium {
                    height: 8px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .vs-progress-bar-premium {
                    height: 100%;
                    background: linear-gradient(90deg, #6d5cff, #30d5c8);
                    box-shadow: 0 0 15px rgba(48, 213, 200, 0.4);
                    border-radius: 4px;
                    transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
    </div>
  );
};

export default Home;

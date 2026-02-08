import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from '../components/Footer';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, ended: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        ended: false
      };
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.ended) return <div className="vs-text-muted small">Voting Ended</div>;

  return (
    <div className="vs-countdown-wrap vs-countdown-active">
      <div className="vs-countdown-item">
        <span className="vs-countdown-value">{timeLeft.days}</span>
        <span className="vs-countdown-label">Days</span>
      </div>
      <div className="vs-countdown-item">
        <span className="vs-countdown-value">{timeLeft.hours}</span>
        <span className="vs-countdown-label">Hrs</span>
      </div>
      <div className="vs-countdown-item">
        <span className="vs-countdown-value">{timeLeft.minutes}</span>
        <span className="vs-countdown-label">Min</span>
      </div>
      <div className="vs-countdown-item">
        <span className="vs-countdown-value">{timeLeft.seconds}</span>
        <span className="vs-countdown-label">Sec</span>
      </div>
    </div>
  );
};

const VoterPanel = () => {
  const [activeElections, setActiveElections] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [closedElections, setClosedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [viewingResults, setViewingResults] = useState(null);
  const [votingFor, setVotingFor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmVote, setConfirmVote] = useState({ show: false, candidateId: null, candidateName: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    fetchElections();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/elections');
      if (res.ok) {
        const data = await res.json();
        const now = new Date();

        const active = [];
        const upcoming = [];
        const closed = [];

        data.forEach(el => {
          const start = new Date(el.start_date);
          const end = new Date(el.end_date);

          // Fix: Only extend end time if it is explicitly set to midnight (00:00:00)
          // This handles cases where only a date was provided (defaulting to midnight).
          // If a specific time (e.g., 17:00) was set, we respect it.
          if ((end.getHours() === 0 && end.getMinutes() === 0) || (end.getUTCHours() === 0 && end.getUTCMinutes() === 0)) {
            end.setHours(23, 59, 59, 999);
            el.end_date = end.toISOString();
          }

          if (el.status === 'closed' || now > end) {
            closed.push(el);
          } else if (el.status === 'active' && now >= start && now <= end) {
            active.push(el);
          } else if (el.status === 'active' && now < start) {
            upcoming.push(el);
          }
        });

        setActiveElections(active);
        setUpcomingElections(upcoming);
        setClosedElections(closed);
      } else {
        showToast('Failed to load elections', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (election) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/elections/${election.id}/results`);
      if (res.ok) {
        const data = await res.json();
        setViewingResults({ ...election, resultData: data });
      } else {
        showToast('Failed to load results', 'error');
      }
    } catch (err) {
      showToast('Error fetching results', 'error');
    } finally {
      setLoading(false);
    }
  };

  const initiateVote = (candidateId, name) => {
    setConfirmVote({ show: true, candidateId, candidateName: name });
  };

  const handleVote = async () => {
    const candidateId = confirmVote.candidateId;
    setConfirmVote({ show: false, candidateId: null, candidateName: '' });
    setVotingFor(candidateId);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ election_id: selectedElection.id, candidate_id: candidateId })
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Vote cast successfully!', 'success');
        setSelectedElection(null);
        // Refresh to see if user has already voted (backend should handle prevention)
        fetchElections();
      } else {
        showToast(data.message || 'Failed to submit vote', 'error');
      }
    } catch (err) {
      showToast('Error submitting vote', 'error');
    } finally {
      setVotingFor(null);
    }
  };

  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmVote.show && (
        <div className="vs-modal-overlay">
          <div className="vs-modal">
            <div className="vs-modal-icon">🗳️</div>
            <h3>Confirm Your Vote</h3>
            <p>
              Are you sure you want to vote for <strong>{confirmVote.candidateName}</strong>?<br />
              This action is permanent and cannot be undone.
            </p>
            <div className="vs-modal-actions">
              <button
                className="vs-btn vs-btn-ghost"
                onClick={() => setConfirmVote({ show: false, candidateId: null, candidateName: '' })}
              >
                Cancel
              </button>
              <button
                className="vs-btn vs-btn-primary"
                onClick={handleVote}
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`vs-toast ${toast.type}`}>
          <div className="vs-toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
          </div>
          <div className="vs-toast-content">
            <span className="vs-toast-title">
              {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
            </span>
            <span className="vs-toast-message">{toast.message}</span>
          </div>
          <button className="vs-toast-close" onClick={() => setToast({ ...toast, show: false })}>×</button>
        </div>
      )}

      <div className="vs-section" style={{ minHeight: '80vh' }}>
        <div className="container">

          {/* HEADER */}
          <div className="vs-section-head vs-flex-between mb-5">
            <div>
              <h2 className="vs-title">
                Voter <span>Panel</span>
                {!!currentUser?.is_verified && (
                  <span className="vs-badge vs-badge-success" style={{ marginLeft: '15px', fontSize: '0.7rem', verticalAlign: 'middle', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <span style={{ marginRight: '5px' }}>✓</span> Verified Voter
                  </span>
                )}
              </h2>
              <p className="vs-subtitle">
                {viewingResults ? 'Election results and final tallies.' : 'Select an ongoing election and cast your secure vote.'}
              </p>
            </div>
            {(selectedElection || viewingResults) && (
              <button
                className="vs-btn vs-btn-ghost"
                onClick={() => {
                  setSelectedElection(null);
                  setViewingResults(null);
                }}
              >
                ← Back to Dashboard
              </button>
            )}
          </div>

          {loading ? (
            <div className="vs-text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 vs-text-muted">Loading data...</p>
            </div>
          ) : !selectedElection && !viewingResults ? (
            /* DASHBOARD VIEW */
            <div className="vs-fade-in">
              {/* VERIFICATION WARNING */}
              {currentUser && !currentUser.is_verified && (
                <div className="vs-alert vs-alert-warning mb-4 vs-fade-in" style={{ background: 'rgba(243, 156, 18, 0.1)', borderColor: 'rgba(243, 156, 18, 0.2)', color: '#f39c12' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>⏳</span>
                    <div>
                      <strong style={{ display: 'block' }}>Verification Pending</strong>
                      <span className="small">Your account is currently under review. You will be able to vote once an administrator verifies your identity.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE ELECTIONS */}
              {/* ACTIVE ELECTIONS */}
              <div className="mb-5">
                <div className="vs-flex-between mb-3">
                  <h4 style={{ fontWeight: 800, margin: 0 }}>Active Elections</h4>
                  {!!currentUser?.is_verified && <span className="vs-badge">{activeElections.length} Running</span>}
                </div>

                {!currentUser?.is_verified ? (
                  <div className="vs-card vs-w-full vs-text-center py-5" style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
                    <h4 style={{ color: '#94a3b8' }}>Access Restricted</h4>
                    <p className="vs-text-muted">You must be a <strong>Verified Voter</strong> to view and participate in active elections.</p>
                  </div>
                ) : (
                  <div className="vs-grid-4">
                    {activeElections.length === 0 ? (
                      <div className="vs-card vs-w-full vs-text-center py-5" style={{ gridColumn: '1 / -1' }}>
                        <p className="vs-text-muted">No ongoing elections at the moment. Check "Upcoming" or "Completed".</p>
                      </div>
                    ) : (activeElections.map(election => (
                      <div key={election.id} className="vs-stat-card vs-flex-column align-items-start" style={{ gap: '10px' }}>
                        <div className="vs-badge vs-badge-success" style={{ marginBottom: '5px' }}>
                          <div className="dot"></div> Active Now
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>{election.title}</h3>
                        <p className="vs-text-muted small" style={{ minHeight: '40px' }}>
                          {election.description || 'Secure digital voting for ' + election.title}
                        </p>

                        <div className="vs-w-full">
                          <div className="vs-timer-label">TIME REMAINING</div>
                          <CountdownTimer targetDate={election.end_date} />
                        </div>

                        <button
                          className="vs-btn vs-btn-primary vs-w-full mt-2"
                          onClick={() => setSelectedElection(election)}
                        >
                          View & Vote
                        </button>
                      </div>
                    ))
                    )}
                  </div>
                )}
              </div>

              {/* UPCOMING ELECTIONS */}
              {upcomingElections.length > 0 && (
                <div className="mb-5">
                  <div className="vs-flex-between mb-3">
                    <h4 style={{ fontWeight: 800, margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>Upcoming Elections</h4>
                    <span className="vs-badge" style={{ background: 'rgba(109, 92, 255, 0.1)', color: '#6d5cff' }}>{upcomingElections.length} Starting Soon</span>
                  </div>
                  <div className="vs-grid-4">
                    {upcomingElections.map(election => (
                      <div key={election.id} className="vs-stat-card vs-flex-column align-items-start" style={{ gap: '10px', opacity: 0.9 }}>
                        <div className="vs-badge" style={{ marginBottom: '5px', background: 'rgba(109, 92, 255, 0.05)', color: '#6d5cff' }}>
                          Pending
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>{election.title}</h3>
                        <p className="vs-text-muted small">
                          Starts: {new Date(election.start_date).toLocaleDateString()} at {new Date(election.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="vs-text-muted small" style={{ fontStyle: 'italic' }}>
                          Voting will automatically open on the start date.
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPLETED ELECTIONS */}
              <div>
                <div className="vs-flex-between mb-3">
                  <h4 style={{ fontWeight: 800, margin: 0 }}>Completed Elections</h4>
                  <span className="vs-badge vs-badge-danger">{closedElections.length} Closed</span>
                </div>
                <div className="vs-grid-4">
                  {closedElections.length === 0 ? (
                    <div className="vs-card vs-w-full vs-text-center py-4" style={{ gridColumn: '1 / -1' }}>
                      <p className="vs-text-muted">No completed elections to show.</p>
                    </div>
                  ) : (
                    closedElections.map(election => (
                      <div key={election.id} className="vs-stat-card vs-flex-column align-items-start" style={{ gap: '10px', opacity: 0.8 }}>
                        <div className="vs-badge vs-badge-danger" style={{ marginBottom: '5px' }}>
                          Closed
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>{election.title}</h3>

                        {!currentUser?.is_verified ? (
                          <button className="vs-btn vs-btn-ghost vs-w-full" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            🔒 Results Locked
                          </button>
                        ) : (
                          <button
                            className="vs-btn vs-btn-success vs-w-full"
                            onClick={() => fetchResults(election)}
                          >
                            View Results
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : viewingResults ? (
            /* RESULTS VIEW */
            <div className="vs-fade-in row justify-content-center">
              <div className="col-lg-8">
                <div className="vs-card mb-4" style={{ background: 'rgba(48, 213, 200, 0.05)', border: '1px solid rgba(48, 213, 200, 0.1)' }}>
                  <div className="vs-badge mb-2">Final Results</div>
                  <h3 className="mb-1">{viewingResults.title}</h3>
                  <p className="vs-text-muted mb-0">Total Votes Cast: {viewingResults.resultData?.total_votes || 0}</p>
                </div>

                <div className="vs-results-list">
                  {(() => {
                    const results = viewingResults.resultData?.results || [];
                    const sortedResults = [...results].sort((a, b) => b.votes - a.votes);
                    const maxVotes = sortedResults.length > 0 ? sortedResults[0].votes : 0;
                    const winnersCount = sortedResults.filter(r => r.votes === maxVotes && r.votes > 0).length;
                    const isTie = winnersCount > 1;

                    return (
                      <>
                        {isTie && (
                          <div className="vs-alert vs-alert-warning mb-4 vs-fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.5rem' }}>⚖️</span>
                              <div>
                                <strong style={{ display: 'block' }}>Tie Detected!</strong>
                                <span className="small">
                                  The top {winnersCount} candidates are tied with {maxVotes} votes each.
                                  A clear winner cannot be decided. Please consider conducting a re-election.
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {sortedResults.map((res, index) => {
                          const percentage = res.percentage || 0;
                          const candidate = res.candidate;
                          const isWinner = index === 0 && res.votes > 0 && !isTie;
                          const isTied = res.votes === maxVotes && maxVotes > 0 && isTie;

                          return (
                            <div key={candidate.id} className={`vs-result-item ${isWinner ? 'winner' : ''} ${isTied ? 'tied' : ''} vs-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                              <div className="vs-result-content">
                                <img
                                  src={candidate.photo ? `/storage/${candidate.photo}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                  alt={candidate.name}
                                  className="vs-result-photo"
                                />

                                <div className="vs-result-info">
                                  <div className="vs-flex-between align-items-start">
                                    <div>
                                      {isWinner && <div className="vs-winner-badge" style={{ marginBottom: '4px', fontSize: '0.65rem', padding: '2px 8px' }}>🏆 Winner</div>}
                                      {isTied && <div className="vs-badge" style={{ marginBottom: '4px', fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(243, 156, 18, 0.2)', color: '#f39c12' }}>⚖️ Tied</div>}
                                      <h3 style={{ fontWeight: 800, margin: 0, fontSize: '1.1rem' }}>{candidate.name}</h3>
                                      <div className="vs-result-party-box">
                                        {candidate.party_logo && (
                                          <img src={`/storage/${candidate.party_logo}`} className="vs-result-party-logo" alt="party" />
                                        )}
                                        <span className="vs-text-muted small">{candidate.party || 'Independent'}</span>
                                      </div>
                                    </div>

                                    <div className="vs-result-stats">
                                      <span className={`vs-result-percent ${isWinner ? 'vs-text-primary' : ''}`} style={{ color: isWinner ? '#30d5c8' : isTied ? '#f39c12' : '#fff', fontSize: '1.2rem' }}>
                                        {percentage}%
                                      </span>
                                      <span className="vs-result-votes" style={{ fontSize: '0.7rem' }}>{res.votes} votes</span>
                                    </div>
                                  </div>

                                  <div className="vs-result-bar-container" style={{ height: '6px', marginTop: '10px', marginBottom: '0' }}>
                                    <div
                                      className="vs-result-bar"
                                      style={{
                                        width: `${percentage}%`,
                                        background: isTied ? 'linear-gradient(90deg, #f39c12, #e67e22)' : undefined
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            /* CANDIDATE VIEW */
            <div className="vs-fade-in">
              <div className="vs-card mb-4" style={{ background: 'rgba(109, 92, 255, 0.05)', border: '1px solid rgba(109, 92, 255, 0.1)' }}>
                <h3 className="mb-2">Election: {selectedElection.title}</h3>
                <p className="mb-0 vs-text-muted">{selectedElection.description}</p>
              </div>

              <div className="vs-candidate-grid">
                {selectedElection.candidates?.length === 0 ? (
                  <div className="vs-card vs-w-full vs-text-center py-4" style={{ gridColumn: '1 / -1' }}>
                    <p className="vs-text-muted">No candidates have been registered for this election yet.</p>
                  </div>
                ) : (
                  selectedElection.candidates?.map(candidate => (
                    <div key={candidate.id} className="vs-card vs-slide-down vs-flex-column" style={{ padding: '0', overflow: 'hidden' }}>
                      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <img
                          src={candidate.photo ? `/storage/${candidate.photo}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                          alt={candidate.name}
                        />
                        <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px' }}>
                          <div className="vs-pill" style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.8rem' }}>
                            {candidate.party_logo && <img src={`/storage/${candidate.party_logo}`} style={{ width: '14px', height: '14px', marginRight: '6px' }} />}
                            {candidate.party || 'Independent'}
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <h4 className="mb-2" style={{ fontWeight: 900 }}>{candidate.name}</h4>
                        <p className="vs-text-muted small" style={{ minHeight: '60px' }}>{candidate.bio || 'Professional candidate dedicated to positive change.'}</p>
                        <button
                          className="vs-btn vs-btn-primary vs-w-full"
                          onClick={() => {
                            if (currentUser && !currentUser.is_verified) {
                              showToast('Your account must be verified before you can vote.', 'error');
                            } else {
                              initiateVote(candidate.id, candidate.name);
                            }
                          }}
                          disabled={votingFor !== null}
                          style={currentUser && !currentUser.is_verified ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          {votingFor === candidate.id ? 'Casting Vote...' : 'Vote for ' + candidate.name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VoterPanel;

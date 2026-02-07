import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import ModernDatePicker from '../components/ModernDatePicker';

import logo from '../images/VoteSecure.png';// Icons (Modern FontAwesome)
const IconDashboard = () => <i className="fa-solid fa-chart-line"></i>;
const IconElections = () => <i className="fa-solid fa-check-to-slot"></i>;
const IconUsers = () => <i className="fa-solid fa-users"></i>;
const IconSettings = () => <i className="fa-solid fa-gear"></i>;
const IconLogout = () => <i className="fa-solid fa-right-from-bracket"></i>;
const IconMessages = () => <i className="fa-solid fa-message"></i>;

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [elections, setElections] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [showCreateWrapper, setShowCreateWrapper] = useState(false);
    const [selectedElectionForCandidates, setSelectedElectionForCandidates] = useState(null);
    const [newCandidate, setNewCandidate] = useState({ name: '', party: '', bio: '' });
    const [isAddingCandidate, setIsAddingCandidate] = useState(false);
    const [editingElection, setEditingElection] = useState(null);
    const [viewingResults, setViewingResults] = useState(null);
    const [resultsData, setResultsData] = useState(null);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'primary' // 'primary', 'danger', etc.
    });

    const triggerConfirm = (title, message, onConfirm, type = 'primary') => {
        setConfirmModal({ isOpen: true, title, message, onConfirm, type });
    };

    const closeConfirm = () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // Form State
    const [newElection, setNewElection] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        is_public: true
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData();
        // Set refresh interval
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const [statsRes, electionsRes, usersRes, messagesRes] = await Promise.all([
                fetch('/api/admin/dashboard', { headers }),
                fetch('/api/admin/elections', { headers }),
                fetch('/api/admin/users', { headers }),
                fetch('/api/admin/messages', { headers })
            ]);

            if (statsRes.ok) {
                setStats(await statsRes.json());
            } else {
                // Fallback stats if API fails
                setStats({ total_users: 0, active_elections: 0, total_votes: 0, total_elections: 0 });
            }
            if (electionsRes.ok) setElections(await electionsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (messagesRes.ok) setMessages(await messagesRes.json());

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Failed to sync data with server', 'error');
            // Set fallback stats so dashboard still renders
            setStats({ total_users: 0, active_elections: 0, total_votes: 0, total_elections: 0 });
            setLoading(false);
        }
    };

    const handleCreateElection = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingElection
                ? `/api/admin/elections/${editingElection.id}`
                : '/api/admin/elections';
            const method = editingElection ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newElection)
            });

            if (response.ok) {
                showToast(editingElection ? 'Election updated successfully!' : 'Election created successfully!', 'success');
                setShowCreateWrapper(false);
                setEditingElection(null);
                setNewElection({ title: '', description: '', start_date: '', end_date: '', is_public: true });
                fetchData();
            } else {
                const error = await response.json();
                showToast(error.message || `Failed to ${editingElection ? 'update' : 'create'} election`, 'error');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    };

    const fetchResults = async (electionId, silent = false) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/elections/${electionId}/results`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                setResultsData(data);
                if (!silent) setViewingResults(electionId);
            } else {
                if (!silent) showToast('Failed to load results', 'error');
            }
        } catch (err) {
            if (!silent) showToast('Error loading results', 'error');
        }
    };

    // Live Results Polling
    useEffect(() => {
        let interval;
        if (viewingResults) {
            // Scroll to results section
            setTimeout(() => {
                const element = document.getElementById('results-analytics');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            // Initial silent fetch to ensure data is fresh immediately
            fetchResults(viewingResults, true);

            interval = setInterval(() => {
                fetchResults(viewingResults, true);
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [viewingResults]);

    const handleLogout = () => {
        triggerConfirm(
            'Confirm Logout',
            'Are you sure you want to logout of the administrative panel?',
            () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
            },
            'danger'
        );
    };

    if (loading) {
        return (
            <div className="vs-page">
                <LandingNavbar />
                <div className="vs-main vs-container vs-text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="vs-page">
            <LandingNavbar />

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

            {/* CONFIRMATION MODAL */}
            {confirmModal.isOpen && (
                <div className="vs-modal-overlay vs-fade-in">
                    <div className="vs-modal vs-slide-down">
                        <div className="card-inner">
                            <div className="vs-modal-icon" style={{ color: confirmModal.type === 'danger' ? '#ef4444' : '#6d5cff' }}>
                                {confirmModal.type === 'danger' ? '⚠️' : '❓'}
                            </div>
                            <h3>{confirmModal.title}</h3>
                            <p>{confirmModal.message}</p>
                            <div className="vs-modal-actions">
                                <button
                                    className="vs-btn vs-btn-outline"
                                    onClick={closeConfirm}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`vs-btn ${confirmModal.type === 'danger' ? 'vs-btn-danger' : 'vs-btn-primary'}`}
                                    style={{ background: confirmModal.type === 'danger' ? '#ef4444' : undefined }}
                                    onClick={() => {
                                        confirmModal.onConfirm();
                                        closeConfirm();
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="vs-admin-wrapper">
                {/* SIDEBAR */}
                <aside className="vs-sidebar">
                    <div className="vs-sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={logo} alt="VoteSecure" className="vs-logo-img" style={{ height: '32px' }} />
                        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vote Secure</span>
                    </div>

                    <nav className="vs-sidebar-nav">
                        <button
                            className={`vs-sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <IconDashboard /> Dashboard
                        </button>
                        <button
                            className={`vs-sidebar-item ${activeTab === 'elections' ? 'active' : ''}`}
                            onClick={() => setActiveTab('elections')}
                        >
                            <IconElections /> Elections
                        </button>
                        <button
                            className={`vs-sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <IconUsers /> Users
                        </button>
                        <button
                            className={`vs-sidebar-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <IconMessages /> Messages
                            {messages.filter(m => !m.is_read).length > 0 && (
                                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 800 }}>
                                    {messages.filter(m => !m.is_read).length}
                                </span>
                            )}
                        </button>
                    </nav>

                    <div className="vs-sidebar-footer">
                        <button className="vs-sidebar-item danger" onClick={handleLogout}>
                            <IconLogout /> Logout
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="vs-admin-content">

                    {/* DASHBOARD VIEW */}
                    {activeTab === 'dashboard' && stats && (
                        <div className="vs-fade-in">
                            <h2 className="mb-4">System Overview</h2>
                            <div className="vs-grid-4">
                                <div className="vs-stat-card">
                                    <div className="vs-stat-icon purple">👥</div>
                                    <div className="vs-stat-info">
                                        <h4>Total Users</h4>
                                        <div className="vs-stat-number">{stats.total_users}</div>
                                    </div>
                                </div>
                                <div className="vs-stat-card">
                                    <div className="vs-stat-icon blue">🗳️</div>
                                    <div className="vs-stat-info">
                                        <h4>Active Elections</h4>
                                        <div className="vs-stat-number">{stats.active_elections}</div>
                                    </div>
                                </div>
                                <div className="vs-stat-card">
                                    <div className="vs-stat-icon green">✅</div>
                                    <div className="vs-stat-info">
                                        <h4>Total Votes</h4>
                                        <div className="vs-stat-number">{stats.total_votes}</div>
                                    </div>
                                </div>
                                <div className="vs-stat-card">
                                    <div className="vs-stat-icon orange">⏳</div>
                                    <div className="vs-stat-info">
                                        <h4>All Elections</h4>
                                        <div className="vs-stat-number">{stats.total_elections}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="vs-grid-2 mt-4">
                                <div className="vs-card">
                                    <h3 className="mb-3">Recent Activity</h3>
                                    <p className="vs-text-muted">No recent activity logs available.</p>
                                </div>
                                <div className="vs-card">
                                    <h3 className="mb-3">Quick Actions</h3>
                                    <div className="vs-flex-gap">
                                        <button className="vs-btn vs-btn-primary" onClick={() => { setActiveTab('elections'); setShowCreateWrapper(true); }}>
                                            + New Election
                                        </button>
                                        <button className="vs-btn vs-btn-secondary" onClick={() => setActiveTab('users')}>
                                            Verify Users
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ELECTIONS VIEW */}
                    {activeTab === 'elections' && (
                        <div className="vs-fade-in">
                            <div className="vs-flex-between mb-4">
                                <h3>{editingElection ? 'Update Election' : 'Manage Elections'}</h3>
                                {editingElection ? (
                                    <div className="vs-flex-gap">
                                        <button
                                            className="vs-btn vs-btn-xs vs-btn-ghost"
                                            onClick={() => {
                                                setEditingElection(null);
                                                setNewElection({ title: '', description: '', start_date: '', end_date: '', is_public: true });
                                                setShowCreateWrapper(false);
                                            }}
                                        >
                                            Cancel Edit
                                        </button>
                                        <button
                                            className="vs-btn vs-btn-action vs-btn-xs"
                                            style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }}
                                            onClick={() => fetchResults(editingElection.id)}
                                        >
                                            Results
                                        </button>
                                    </div>
                                ) : (
                                    <button className={`vs-btn ${showCreateWrapper ? 'vs-btn-outline' : 'vs-btn-primary'}`} onClick={() => setShowCreateWrapper(!showCreateWrapper)}>
                                        {showCreateWrapper ? 'Cancel' : '+ New Election'}
                                    </button>
                                )}</div>

                            {/* CREATE FORM */}
                            {showCreateWrapper && (
                                <div className="vs-card mb-4 vs-slide-down" style={{ position: 'relative', zIndex: 10 }}>
                                    <h3 className="mb-3">{editingElection ? 'Edit Election' : 'Create New Election'}</h3>
                                    <form onSubmit={handleCreateElection}>
                                        <div className="vs-input-group">
                                            <label className="vs-label">Election Title</label>
                                            <input
                                                className="vs-input"
                                                value={newElection.title}
                                                onChange={e => setNewElection({ ...newElection, title: e.target.value })}
                                                placeholder="e.g. 2026 Student Council Election"
                                                required
                                            />
                                        </div>
                                        <div className="vs-input-group">
                                            <label className="vs-label">Description</label>
                                            <textarea
                                                className="vs-input"
                                                rows="3"
                                                value={newElection.description}
                                                onChange={e => setNewElection({ ...newElection, description: e.target.value })}
                                                placeholder="Enter election details..."
                                            />
                                        </div>
                                        <div className="vs-grid-2">
                                            <ModernDatePicker
                                                label="Start Date"
                                                value={newElection.start_date}
                                                onChange={(val) => setNewElection({ ...newElection, start_date: val })}
                                            />
                                            <ModernDatePicker
                                                label="End Date"
                                                value={newElection.end_date}
                                                onChange={(val) => setNewElection({ ...newElection, end_date: val })}
                                            />
                                        </div>
                                        <div className="vs-text-right">
                                            <button type="submit" className="vs-btn vs-btn-primary vs-w-full">
                                                {editingElection ? 'Save Changes' : 'Create Election'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ELECTIONS LIST */}
                            <div className="vs-card">
                                <table className="vs-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Duration</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elections.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center p-4">No elections found. Create one above!</td></tr>
                                        ) : (
                                            elections.map(election => (
                                                <tr key={election.id}>
                                                    <td>
                                                        <div style={{ fontWeight: 600 }}>{election.title}</div>
                                                        <small className="vs-text-muted">{election.description?.substring(0, 30)}...</small>
                                                    </td>
                                                    <td>
                                                        <span className={`vs-badge ${election.status === 'active' ? 'vs-badge-success' : 'vs-badge-warning'}`}>
                                                            {election.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            Start: {new Date(election.start_date).toLocaleDateString()}<br />
                                                            End: {new Date(election.end_date).toLocaleDateString()}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="vs-flex-gap">
                                                            <button
                                                                className={`vs-btn vs-btn-action vs-btn-xs ${election.status === 'active' ? 'vs-btn-deactivate' : 'vs-btn-activate'}`}
                                                                onClick={async () => {
                                                                    const token = localStorage.getItem('token');
                                                                    try {
                                                                        const res = await fetch(`/api/admin/elections/${election.id}/toggle`, {
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Authorization': `Bearer ${token}`,
                                                                                'Accept': 'application/json'
                                                                            }
                                                                        });
                                                                        if (res.ok) {
                                                                            const data = await res.json();
                                                                            showToast(`Election is now ${data.status}`, 'success');
                                                                            fetchData();
                                                                        }
                                                                    } catch (err) {
                                                                        showToast('Failed to change status', 'error');
                                                                    }
                                                                }}
                                                            >
                                                                {election.status === 'active' ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                            <button
                                                                className="vs-btn vs-btn-action vs-btn-candidates vs-btn-xs"
                                                                onClick={() => {
                                                                    setSelectedElectionForCandidates(election);
                                                                    setNewCandidate({ name: '', party: '', bio: '' });
                                                                    // Scroll to candidates section
                                                                    setTimeout(() => {
                                                                        document.querySelector('.vs-card.mt-4.vs-slide-down')?.scrollIntoView({ behavior: 'smooth' });
                                                                    }, 100);
                                                                }}
                                                            >
                                                                Candidates
                                                            </button>
                                                            <button
                                                                className="vs-btn vs-btn-action vs-btn-edit vs-btn-xs"
                                                                onClick={() => {
                                                                    setEditingElection(election);
                                                                    setNewElection({
                                                                        title: election.title,
                                                                        description: election.description || '',
                                                                        start_date: election.start_date,
                                                                        end_date: election.end_date,
                                                                        is_public: !!election.is_public
                                                                    });
                                                                    setShowCreateWrapper(true);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="vs-btn vs-btn-action vs-btn-xs"
                                                                style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }}
                                                                onClick={() => fetchResults(election.id)}
                                                            >
                                                                Results
                                                            </button>
                                                            <button
                                                                className="vs-btn vs-btn-danger vs-btn-xs"
                                                                onClick={() => {
                                                                    triggerConfirm(
                                                                        'Delete Election',
                                                                        `Are you sure you want to permanently delete "${election.title}"? All votes and candidates will be lost.`,
                                                                        async () => {
                                                                            const token = localStorage.getItem('token');
                                                                            try {
                                                                                const res = await fetch(`/api/admin/elections/${election.id}`, {
                                                                                    method: 'DELETE',
                                                                                    headers: {
                                                                                        'Authorization': `Bearer ${token}`,
                                                                                        'Accept': 'application/json'
                                                                                    }
                                                                                });
                                                                                if (res.ok) {
                                                                                    showToast('Election deleted successfully', 'success');
                                                                                    fetchData();
                                                                                } else {
                                                                                    showToast('Failed to delete election', 'error');
                                                                                }
                                                                            } catch (err) {
                                                                                showToast('Network error', 'error');
                                                                            }
                                                                        },
                                                                        'danger'
                                                                    );
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* RESULTS SUMMARY SECTION */}
                            {viewingResults && resultsData && (
                                <div id="results-analytics" className="vs-card mt-4 vs-slide-down" style={{ border: '1px solid rgba(48, 213, 200, 0.3)', background: 'rgba(13, 17, 23, 0.6)' }}>
                                    <div className="vs-flex-between mb-4">
                                        <div>
                                            <h3 className="m-0" style={{ color: '#30d5c8' }}>Real-time Analytics</h3>
                                            <p className="vs-text-muted small">Election Results Detail View</p>
                                        </div>
                                        <button className="vs-btn vs-btn-xs vs-btn-danger" onClick={() => setViewingResults(null)}>Close Results</button>
                                    </div>
                                    <div className="vs-grid-2" style={{ gap: '30px' }}>
                                        <div className="vs-flex-column" style={{ gap: '20px' }}>
                                            {resultsData.results.map(res => (
                                                <div key={res.candidate_id} className="vs-result-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div className="vs-flex-between mb-2">
                                                        <div className="vs-flex-center gap-2">
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {res.candidate?.photo ? <img src={`/storage/${res.candidate.photo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                                                            </div>
                                                            <span style={{ fontWeight: 600 }}>{res.candidate?.name}</span>
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#30d5c8' }}>{res.votes} votes ({res.percentage}%)</span>
                                                    </div>
                                                    <div className="vs-progress-bg" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div className="vs-progress-bar" style={{ width: `${res.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6d5cff, #30d5c8)', borderRadius: '4px' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="vs-card vs-flex-center" style={{ background: 'rgba(109, 92, 255, 0.05)', border: '1px dashed rgba(109, 92, 255, 0.3)', minHeight: '200px' }}>
                                            <div className="vs-text-center">
                                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#6d5cff', textShadow: '0 0 20px rgba(109, 92, 255, 0.3)' }}>{resultsData.total_votes}</div>
                                                <div className="vs-text-muted" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Total Verified Votes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CANDIDATES MANAGEMENT SECTION */}
                            {selectedElectionForCandidates && (
                                <div className="vs-card mt-4 vs-slide-down">
                                    <div className="vs-flex-between mb-4">
                                        <h3>Manage Candidates: {selectedElectionForCandidates.title}</h3>
                                        <button className="vs-btn vs-btn-xs" onClick={() => setSelectedElectionForCandidates(null)}>Close</button>
                                    </div>
                                    <div className="vs-grid-2">
                                        {/* Add Candidate Form */}
                                        <div>
                                            <h4 className="mb-3">Add Candidate</h4>
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                setIsAddingCandidate(true);
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    const formData = new FormData();
                                                    formData.append('name', newCandidate.name);
                                                    formData.append('party', newCandidate.party || '');
                                                    formData.append('bio', newCandidate.bio || '');
                                                    if (newCandidate.photo_file) formData.append('photo', newCandidate.photo_file);
                                                    if (newCandidate.logo_file) formData.append('party_logo', newCandidate.logo_file);

                                                    const res = await fetch(`/api/admin/elections/${selectedElectionForCandidates.id}/candidates`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                            'Accept': 'application/json'
                                                        },
                                                        body: formData
                                                    });

                                                    const data = await res.json();

                                                    if (res.ok) {
                                                        setNewCandidate({ name: '', party: '', bio: '' });
                                                        showToast('Candidate added successfully', 'success');
                                                        fetchData();

                                                        const updatedElections = await (await fetch(`/api/admin/elections`, {
                                                            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                                                        })).json();
                                                        const match = updatedElections.find(el => el.id === selectedElectionForCandidates.id);
                                                        setSelectedElectionForCandidates(match);
                                                    } else {
                                                        showToast(data.message || 'Failed to add candidate', 'error');
                                                    }
                                                } catch (err) {
                                                    console.error('Candidate addition error:', err);
                                                    showToast('Network error or server unavailable', 'error');
                                                } finally {
                                                    setIsAddingCandidate(false);
                                                }
                                            }}>
                                                <div className="vs-input-group">
                                                    <label className="vs-label">Full Name</label>
                                                    <input
                                                        className="vs-input"
                                                        value={newCandidate.name}
                                                        onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="vs-input-group">
                                                    <label className="vs-label">Party / Affiliation</label>
                                                    <input
                                                        className="vs-input"
                                                        value={newCandidate.party}
                                                        onChange={e => setNewCandidate({ ...newCandidate, party: e.target.value })}
                                                    />
                                                </div>
                                                <div className="vs-input-group">
                                                    <label className="vs-label">Bio (Optional)</label>
                                                    <textarea
                                                        className="vs-input"
                                                        rows="2"
                                                        value={newCandidate.bio}
                                                        onChange={e => setNewCandidate({ ...newCandidate, bio: e.target.value })}
                                                    />
                                                </div>
                                                <div className="vs-grid-2" style={{ gap: '15px' }}>
                                                    <div className="vs-input-group">
                                                        <label className="vs-label small">Candidate Photo</label>
                                                        <input
                                                            type="file"
                                                            className="vs-input small"
                                                            onChange={e => setNewCandidate({ ...newCandidate, photo_file: e.target.files[0] })}
                                                            accept="image/*"
                                                        />
                                                    </div>
                                                    <div className="vs-input-group">
                                                        <label className="vs-label small">Party Symbol</label>
                                                        <input
                                                            type="file"
                                                            className="vs-input small"
                                                            onChange={e => setNewCandidate({ ...newCandidate, logo_file: e.target.files[0] })}
                                                            accept="image/*"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="vs-btn vs-btn-primary vs-w-full"
                                                    disabled={isAddingCandidate}
                                                >
                                                    {isAddingCandidate ? 'Adding...' : 'Add Candidate'}
                                                </button>
                                            </form>
                                        </div>

                                        {/* Candidates List */}
                                        <div>
                                            <h4 className="mb-3">Existing Candidates</h4>
                                            <div className="vs-candidate-grid">
                                                {selectedElectionForCandidates.candidates?.length === 0 ? (
                                                    <p className="vs-text-muted">No candidates added yet.</p>
                                                ) : (
                                                    selectedElectionForCandidates.candidates?.map(c => (
                                                        <div key={c.id} className="vs-candidate-card vs-slide-down">
                                                            <img
                                                                src={c.photo ? `/storage/${c.photo}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                                className="vs-candidate-avatar"
                                                                alt={c.name}
                                                            />
                                                            <div className="vs-candidate-info">
                                                                <div className="vs-candidate-name">{c.name}</div>
                                                                <div className="vs-candidate-party">
                                                                    {c.party_logo && <img src={`/storage/${c.party_logo}`} className="vs-candidate-party-logo" alt="Logo" />}
                                                                    {c.party || 'Independent Candidate'}
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="vs-btn vs-btn-outline vs-btn-xs text-danger vs-candidate-remove"
                                                                onClick={() => {
                                                                    triggerConfirm(
                                                                        'Remove Candidate',
                                                                        `Are you sure you want to remove ${c.name} from this election? This action cannot be undone.`,
                                                                        async () => {
                                                                            const token = localStorage.getItem('token');
                                                                            try {
                                                                                const res = await fetch(`/api/admin/candidates/${c.id}`, {
                                                                                    method: 'DELETE',
                                                                                    headers: {
                                                                                        'Authorization': `Bearer ${token}`,
                                                                                        'Accept': 'application/json'
                                                                                    }
                                                                                });
                                                                                if (res.ok) {
                                                                                    showToast(`${c.name} removed successfully`, 'success');
                                                                                    fetchData();
                                                                                    const updatedElections = await (await fetch(`/api/admin/elections`, {
                                                                                        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                                                                                    })).json();
                                                                                    const match = updatedElections.find(el => el.id === selectedElectionForCandidates.id);
                                                                                    setSelectedElectionForCandidates(match);
                                                                                }
                                                                            } catch (err) {
                                                                                showToast('Failed to remove candidate', 'error');
                                                                            }
                                                                        },
                                                                        'danger'
                                                                    );
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* USERS VIEW */}
                    {activeTab === 'users' && (
                        <div className="vs-fade-in">
                            <h2 className="mb-4">User Management</h2>
                            <div className="vs-card">
                                <table className="vs-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Voter ID</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="vs-flex-center gap-3">
                                                        <div className="vs-user-avatar">
                                                            {user.photo ? (
                                                                <img src={`/storage/${user.photo}`} alt={user.name} />
                                                            ) : (
                                                                <div className="vs-user-avatar-placeholder">{user.name.charAt(0)}</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                {user.name}
                                                                {user.is_verified && <span title="Verified" style={{ color: '#30d5c8', fontSize: '0.9rem' }}>✓</span>}
                                                            </div>
                                                            <small className="vs-text-muted">{user.email}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{user.voter_id || 'N/A'}</code></td>
                                                <td><span className="vs-badge vs-badge-info">{user.role}</span></td>
                                                <td>
                                                    <span className={`vs-badge ${user.is_active ? 'vs-badge-success' : 'vs-badge-danger'}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="vs-flex-gap">
                                                        <div style={{ minWidth: '80px' }}>
                                                            {user.is_verified ? (
                                                                <span className="vs-badge vs-badge-success" style={{ marginBottom: 0 }}>Verified</span>
                                                            ) : (
                                                                <button
                                                                    className="vs-btn vs-btn-primary vs-btn-xs"
                                                                    onClick={() => {
                                                                        triggerConfirm(
                                                                            'Verify User',
                                                                            `Are you sure you want to verify ${user.name}? This will allow them to participate in elections.`,
                                                                            async () => {
                                                                                const token = localStorage.getItem('token');
                                                                                try {
                                                                                    const res = await fetch(`/api/admin/users/${user.id}/verify`, {
                                                                                        method: 'PUT',
                                                                                        headers: {
                                                                                            'Authorization': `Bearer ${token}`,
                                                                                            'Accept': 'application/json'
                                                                                        }
                                                                                    });
                                                                                    if (res.ok) {
                                                                                        showToast('User verified successfully', 'success');
                                                                                        fetchData();
                                                                                    } else {
                                                                                        showToast('Failed to verify user', 'error');
                                                                                    }
                                                                                } catch (err) {
                                                                                    showToast('Network error', 'error');
                                                                                }
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    Verify
                                                                </button>
                                                            )}
                                                        </div>
                                                        <button
                                                            className="vs-btn vs-btn-danger vs-btn-xs"
                                                            onClick={() => {
                                                                triggerConfirm(
                                                                    'Delete User',
                                                                    `Are you sure you want to delete ${user.name}? This will permanently remove their profile and all associated data.`,
                                                                    async () => {
                                                                        const token = localStorage.getItem('token');
                                                                        try {
                                                                            const res = await fetch(`/api/admin/users/${user.id}`, {
                                                                                method: 'DELETE',
                                                                                headers: {
                                                                                    'Authorization': `Bearer ${token}`,
                                                                                    'Accept': 'application/json'
                                                                                }
                                                                            });
                                                                            if (res.ok) {
                                                                                showToast('User deleted successfully', 'success');
                                                                                fetchData();
                                                                            } else {
                                                                                const err = await res.json();
                                                                                showToast(err.message || 'Failed to delete user', 'error');
                                                                            }
                                                                        } catch (err) {
                                                                            showToast('Network error', 'error');
                                                                        }
                                                                    },
                                                                    'danger'
                                                                );
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* MESSAGES VIEW */}
                    {activeTab === 'messages' && (
                        <div className="vs-fade-in">
                            <h2 className="mb-4">User Messages</h2>
                            <div className="vs-card">
                                {messages.length === 0 ? (
                                    <div className="vs-text-center py-5">
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</div>
                                        <p className="vs-text-muted">No messages received yet.</p>
                                    </div>
                                ) : (
                                    <div className="vs-messages-list">
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`vs-message-item mb-3 ${!msg.is_read ? 'unread' : ''}`}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                    border: `1px solid ${!msg.is_read ? 'rgba(109, 92, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                                                    borderRadius: '16px',
                                                    padding: '20px',
                                                    position: 'relative',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {!msg.is_read && (
                                                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: '#6d5cff', borderRadius: '50%' }}></div>
                                                )}
                                                <div className="vs-flex-between mb-2">
                                                    <div>
                                                        <h4 style={{ margin: 0, fontWeight: 800 }}>{msg.subject}</h4>
                                                        <small className="vs-text-muted">From: <strong>{msg.name}</strong> ({msg.email})</small>
                                                    </div>
                                                    <small className="vs-text-muted">{new Date(msg.created_at).toLocaleString()}</small>
                                                </div>
                                                <p className="mt-3" style={{ lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.8)' }}>{msg.message}</p>
                                                <div className="vs-flex-gap mt-3">
                                                    {!msg.is_read && (
                                                        <button
                                                            className="vs-btn vs-btn-xs vs-btn-action"
                                                            onClick={async () => {
                                                                const token = localStorage.getItem('token');
                                                                const res = await fetch(`/api/admin/messages/${msg.id}/read`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                                });
                                                                if (res.ok) fetchData();
                                                            }}
                                                        >
                                                            Mark as Read
                                                        </button>
                                                    )}
                                                    <button
                                                        className="vs-btn vs-btn-xs vs-btn-danger"
                                                        onClick={() => {
                                                            triggerConfirm(
                                                                'Delete Message',
                                                                'Are you sure you want to delete this message? This action is permanent.',
                                                                async () => {
                                                                    const token = localStorage.getItem('token');
                                                                    const res = await fetch(`/api/admin/messages/${msg.id}`, {
                                                                        method: 'DELETE',
                                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                                    });
                                                                    if (res.ok) {
                                                                        showToast('Message deleted', 'success');
                                                                        fetchData();
                                                                    }
                                                                },
                                                                'danger'
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;


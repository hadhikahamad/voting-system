import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

// Images (Ensure these imports match your project structure)

export default function HowItWorks() {
    return (
        <div className="vs-page">
            <LandingNavbar />

            {/* HEADER SECTION */}
            <section className="vs-hero" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="vs-badge" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
                            <span className="dot" />
                            Simple Process
                        </div>

                        <h1 className="vs-title">
                            How <span>VoteSecure</span> Works
                        </h1>

                        <p className="vs-subtitle" style={{ margin: '0 auto 2rem' }}>
                            We've streamlined the voting process to be secure, transparent, and incredibly easy to use.
                            Here is everything you need to know about casting your vote.
                        </p>
                    </div>
                </div>
                <div className="vs-blob" aria-hidden="true" />
            </section>

            {/* STEPS SECTION */}
            <section className="vs-section" style={{ paddingTop: 0 }}>
                <div className="container">

                    <div className="vs-steps">
                        {/* Step 1 */}
                        <div className="vs-step text-center p-4">
                            <div className="vs-step-num mx-auto" style={{ width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                            <h3 className="mb-3">Create Your Account</h3>
                            <p className="vs-text-muted mb-4">
                                Start by registering on our secure platform. You'll need to provide verifiable identification to ensure the integrity of the election.
                            </p>
                            <ul className="vs-list text-start d-inline-block small mb-4" style={{ listStyle: 'none', padding: 0 }}>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Secure Registration</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Identity Verification</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Instant Approval</li>
                            </ul>
                            <div>
                                <Link to="/register" className="vs-btn vs-btn-primary vs-btn-sm">Sign Up Now</Link>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="vs-step text-center p-4">
                            <div className="vs-step-num mx-auto" style={{ width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                            <h3 className="mb-3">Cast Your Vote</h3>
                            <p className="vs-text-muted mb-4">
                                Once verified, access the ballot for your specific organization. Review candidate profiles and make your choice with a single click.
                            </p>
                            <ul className="vs-list text-start d-inline-block small mb-4" style={{ listStyle: 'none', padding: 0 }}>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> User-Friendly Ballot</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> One-Click Voting</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Blockchain Encryption</li>
                            </ul>
                        </div>

                        {/* Step 3 */}
                        <div className="vs-step text-center p-4">
                            <div className="vs-step-num mx-auto" style={{ width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
                            <h3 className="mb-3">View Live Results</h3>
                            <p className="vs-text-muted mb-4">
                                Watch the results update in real-time as votes are cast. Once the election concludes, final results are instantly available and audit-ready.
                            </p>
                            <ul className="vs-list text-start d-inline-block small mb-4" style={{ listStyle: 'none', padding: 0 }}>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Real-Time Analytics</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Transparent Counting</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-primary me-2"></i> Final Report Generation</li>
                            </ul>
                            <div>
                                <Link to="/" className="vs-btn vs-btn-ghost vs-btn-sm">View Active Elections</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

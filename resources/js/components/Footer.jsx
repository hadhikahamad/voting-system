import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/VoteSecure.png";

const Footer = () => {
    return (
        <footer className="vs-footer" id="contact">
            <div className="container">
                <div className="vs-footer-grid">
                    <div>
                        <div className="vs-footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <img src={logo} alt="VoteSecure" className="vs-logo-img" />
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>Vote Secure</span>
                        </div>
                        <p className="vs-footer-text">
                            Secure online voting for universities, clubs, and organizations.
                        </p>
                    </div>

                    <div>
                        <div className="vs-footer-head">Links</div>
                        <a href="#features" className="vs-footer-link"><i className="fa-solid fa-star me-2"></i> Features</a>
                        <Link to="/how-it-works" className="vs-footer-link"><i className="fa-solid fa-layer-group me-2"></i> How it works</Link>
                        <Link to="/admin" className="vs-footer-link"><i className="fa-solid fa-lock me-2"></i> Admin</Link>
                    </div>

                    <div>
                        <div className="vs-footer-head">Contact</div>
                        <div className="vs-footer-text"><i className="fa-solid fa-envelope me-2"></i> Email: support@votesecure.com</div>
                        <div className="vs-footer-text"><i className="fa-solid fa-phone me-2"></i> Phone: +94 76 678 4978</div>
                        <div className="vs-flex-gap mt-3">
                            <a href="#" className="vs-footer-link"><i className="fa-brands fa-twitter fa-lg"></i></a>
                            <a href="#" className="vs-footer-link"><i className="fa-brands fa-facebook fa-lg"></i></a>
                            <a href="#" className="vs-footer-link"><i className="fa-brands fa-instagram fa-lg"></i></a>
                        </div>
                    </div>
                </div>

                <div className="vs-footer-bottom">
                    &copy; {new Date().getFullYear()} VoteSecure. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

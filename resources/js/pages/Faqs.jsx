import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

export default function Faqs() {
  const faqs = [
    {
      id: "01",
      q: "How do I register to vote?",
      a: "Click on the 'Register / Vote' button in the top right corner. You'll need to provide your full name, email, and valid Voter ID. Once registered, your account will be verified by an administrator before you can cast a vote."
    },
    {
      id: "02",
      q: "Is my vote anonymous?",
      a: "Yes, absolutely. Our system uses advanced encryption to ensure that your vote is kept confidential. While we verify that you have voted to prevent duplicates, your specific choice is anonymized in the final tally."
    },
    {
      id: "03",
      q: "How are the results calculated?",
      a: "Results are calculated in real-time as votes are cast. Our secure backend aggregates the data instantly. However, official results may be held until the election period formally closes, depending on the admin settings."
    },
    {
      id: "04",
      q: "Can I change my vote?",
      a: "No. To maintain the integrity of the election process, once a vote is cast and confirmed, it cannot be altered or retracted. Please double-check your selection before submitting."
    },
    {
      id: "05",
      q: "What if I forget my password?",
      a: "If you cannot log in, please contact the election administrator or support team via the Contact page. For security reasons, password resets may require additional identity verification."
    },
    {
      id: "06",
      q: "Is the platform mobile-friendly?",
      a: "Yes! VoteSecure is optimized for all devices. You can register, view candidates, and vote from your smartphone, tablet, or desktop computer with ease."
    }
  ];

  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO SECTION */}
      <section className="vs-hero" style={{ minHeight: 'auto', paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="vs-badge" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
              <span className="dot" />
              Support
            </div>

            <h1 className="vs-title">
              Common <span>Questions</span>
            </h1>

            <p className="vs-subtitle" style={{ margin: '0 auto' }}>
              Clear answers to help you navigate the voting process.
            </p>
          </div>
        </div>
        <div className="vs-blob" aria-hidden="true" />
      </section>

      {/* FAQ LIST SECTION - NEW ROW STYLE */}
      <section className="vs-section" style={{ paddingTop: '0' }}>
        <div className="container">

          <div className="vs-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="vs-card vs-faq-row vs-animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="vs-faq-number">{faq.id}</div>
                <div className="vs-faq-content">
                  <h3 className="h5 mb-2 text-white">{faq.q}</h3>
                  <p className="vs-text-muted mb-0">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 text-center">
            <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>Still have questions?</p>
            <Link to="/contact" className="vs-btn vs-btn-outline" style={{ color: '#fff' }}>Contact Support</Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

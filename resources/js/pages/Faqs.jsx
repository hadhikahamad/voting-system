import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";

const faqs = [
  {
    q: "What is VoteSecure?",
    a: "VoteSecure is an online voting system designed for universities and organizations to conduct secure, transparent, and efficient elections."
  },
  {
    q: "Who can create an election?",
    a: "Only administrators can create elections, add candidates, open or close elections, and manage election data."
  },
  {
    q: "How does voter registration work?",
    a: "Voters register using a unique voter ID. This ID is used to ensure each voter can vote only once per election."
  },
  {
    q: "Can I vote more than once?",
    a: "No. The system checks if a voter ID has already voted in a specific election and blocks duplicate voting automatically."
  },
  {
    q: "What happens if an election is closed?",
    a: "If an election status is set to 'closed', no new votes are accepted. Attempting to vote will return an error."
  },
  {
    q: "How are votes counted?",
    a: "Votes are stored securely and counted per candidate. Results are calculated dynamically based on total votes."
  },
  {
    q: "Can I see live results?",
    a: "Yes. Results can be viewed in real time, including total votes and percentage per candidate."
  },
  {
    q: "How is election integrity ensured?",
    a: "VoteSecure ensures integrity through voter validation, election status checks, and preventing duplicate votes."
  },
  {
    q: "Can candidates be removed?",
    a: "Yes. Administrators can delete candidates if needed before or after elections."
  },
  {
    q: "What happens when an election is deleted?",
    a: "Deleting an election removes the election and its associated candidates and votes permanently."
  }
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="vs-page">
      <LandingNavbar />

      {/* HERO */}
      <section className="faq-hero">
        <div className="container">
          <h1 className="faq-title">
            Frequently Asked <span>Questions</span>
          </h1>
          <p className="faq-subtitle">
            Answers to common questions about elections, voting, and security.
          </p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? "open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="faq-answer">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="vs-footer">
        <div className="container">
          <div className="vs-footer-bottom">
            © {new Date().getFullYear()} VoteSecure — Laravel + React
          </div>
        </div>
      </footer>
    </div>
  );
}

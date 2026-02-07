import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import HowItWorks from "../pages/HowItWorks";
import Faqs from "../pages/Faqs";
import Register from "../pages/Register";
import AdminPanel from "../pages/AdminPanel"; // This serves as Login/Admin Dashboard
import Admin from "../pages/Admin"; // Placeholder admin page?
import VoterPanel from "../pages/VoterPanel";
import VotePage from "../pages/VotePage";

import Login from "../pages/Login";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/register" element={<Register />} />

            {/* Admin/Login Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPanel />} />

            {/* Protected Routes (Logic should be inside components or wrapped) */}
            <Route path="/voter" element={<VoterPanel />} />
            <Route path="/vote" element={<VotePage />} />
        </Routes>
    );
};

export default App;

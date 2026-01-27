import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Faqs from "../pages/Faqs";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/voter" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faqs" element={<Faqs />} />
    </Routes>
  );
}

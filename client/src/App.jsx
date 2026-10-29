import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ProblemList from "./ProblemList";
import ProblemDetail from "./ProblemDetail";
import Login from "./Login";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
        {/* Navbar stays visible on all pages */}
        <Navbar />

        {/* Dynamic page routes */}
        <Routes>
          <Route path="/" element={<ProblemList />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
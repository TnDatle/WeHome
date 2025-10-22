import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TrackOrder from "./pages/TrackOrder"; 
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/TrackOrder" element={<TrackOrder />} /> 
            <Route path="/auth/Login" element={<Login />} /> 
            <Route path="/auth/Register" element={<Register />} /> 

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

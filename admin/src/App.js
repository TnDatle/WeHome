import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Category from "./Components/Category";
import Dashboard from "./Pages/Dashboard";
import Product from "./Pages/Product";
import Order from "./Pages/Order";
import User from "./Pages/User";
import Setting from "./Pages/Setting";
import "./Style/index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="admin-layout">
        <Header />
        <div className="admin-body">
          <Category />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/products" element={<Product />} />
              <Route path="/users" element={<User />} />
              <Route path="/settings" element={<Setting />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;

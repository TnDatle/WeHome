import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TrackOrder from "./pages/TrackOrder"; 
import Login from "./auth/Login";
import Register from "./auth/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Product from "./product/Product";
import ProductDetail from "./product/ProductDetail";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";

// ==== POLICY PAGES ====
import DeliveryPolicy from "./policy/deliveryPolicy";
import RefundPolicy from "./policy/refundPolicy";
function App() {
  return (
      <UserProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pages/TrackOrder" element={<TrackOrder />} /> 
              <Route path="/auth/Login" element={<Login />} /> 
              <Route path="/auth/Register" element={<Register />} /> 
              <Route path="/pages/Cart" element={<Cart />} /> 
              <Route path="/pages/Checkout" element={<Checkout />} /> 
              <Route path="/category/:slug" element={<Product />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<Search />} /> 
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/policy/DeliveryPolicy" element={<DeliveryPolicy />} /> 
              <Route path="/policy/RefundPolicy" element={<RefundPolicy />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
     </UserProvider>
  );
}

export default App;

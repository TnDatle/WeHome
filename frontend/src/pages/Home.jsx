import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import "../style/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("❌ Lỗi khi tải sản phẩm:", err));
  }, []);

  return (
     <>
      <Helmet>
        <title>WeHome - An tâm mua sắm</title>
      </Helmet>
    <div className="home-page">
      {/* ==== HERO BANNER ==== */}
      <section className="hero-banner">
        <div className="banner-content">
          <h1>Khám Phá Đồ Gia Dụng Thông Minh</h1>
          <p>Tiện nghi - Hiện đại - Nâng tầm không gian sống</p>
          <Button variant="light" className="banner-btn">
            Mua ngay
          </Button>
        </div>
      </section>
    </div>
    </>
  );
}

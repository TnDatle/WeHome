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

  const categories = [
    { id: 1, name: "Thiết bị nhà bếp", icon: "🍳" },
    { id: 2, name: "Máy lọc không khí", icon: "🌬️" },
    { id: 3, name: "Đèn & chiếu sáng", icon: "💡" },
    { id: 4, name: "Dụng cụ vệ sinh", icon: "🧹" },
    { id: 5, name: "Đồ dùng phòng tắm", icon: "🛁" },
    { id: 6, name: "Đồ điện gia dụng nhỏ", icon: "🔌" },
    { id: 7, name: "Chăm sóc cá nhân", icon: "💆" },
    { id: 8, name: "Thiết bị giặt sấy", icon: "🧺" },
    { id: 9, name: "Gia dụng thông minh", icon: "🏠" },
    { id: 10, name: "Nội thất & trang trí", icon: "🪑" },
  ];

  return (
    <>
      <Helmet>
        <title>WeHome - An tâm mua sắm</title>
      </Helmet>

      <div className="home-page">
        {/* ==== HERO BANNER ==== */}
        <section className="hero-banner">
          <div className="banner-overlay">
            <div className="banner-content text-center text-white">
              <h1>Khám Phá Đồ Gia Dụng Thông Minh</h1>
              <p>Tiện nghi - Hiện đại - Nâng tầm không gian sống</p>

              {/* === DANH MỤC NGAY TRONG ẢNH === */}
              <div className="banner-categories mt-4">
                <Container>
                  <Row className="g-3 justify-content-center">
                    {categories.map((cat) => (
                      <Col
                        key={cat.id}
                        xs={4}
                        sm={3}
                        md={2}
                        className="text-center"
                      >
                        <div className="banner-category-card">
                          <div className="banner-category-icon">{cat.icon}</div>
                          <p className="banner-category-name mb-0">
                            {cat.name}
                          </p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Container>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

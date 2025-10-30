import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { db } from "../config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import "../style/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  // Danh mục chính
  const categories = [
    { id: 1, name: "Thiết bị nhà bếp", icon: "🍳", slug: "kitchen" },
    { id: 2, name: "Máy lọc không khí", icon: "🌬️", slug: "air-purifier" },
    { id: 3, name: "Đèn & chiếu sáng", icon: "💡", slug: "lighting" },
    { id: 4, name: "Dụng cụ vệ sinh", icon: "🧹", slug: "cleaning" },
    { id: 5, name: "Đồ dùng phòng tắm", icon: "🛁", slug: "bathroom" },
    { id: 6, name: "Đồ điện gia dụng nhỏ", icon: "🔌", slug: "small-appliances" },
    { id: 7, name: "Chăm sóc cá nhân", icon: "💆", slug: "personal-care" },
    { id: 8, name: "Thiết bị giặt sấy", icon: "🧺", slug: "laundry" },
    { id: 9, name: "Gia dụng thông minh", icon: "🏠", slug: "smart-home" },
    { id: 10, name: "Nội thất & trang trí", icon: "🪑", slug: "furniture" },
  ];

  //Lấy sản phẩm từ Firestore và chọn random 4 sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Products"));
        const allProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Trộn ngẫu nhiên và chọn 4 sản phẩm
        const randomProducts = allProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setProducts(randomProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>WeHome - An tâm mua sắm</title>
      </Helmet>

      <div className="home-page py-4">
        <Container fluid="lg">
          <Row>
            {/* ==== CỘT TRÁI: DANH MỤC ==== */}
            <Col md={3} lg={2} className="mb-4 mb-md-0">
              <div className="category-sidebar p-3 shadow-sm bg-white rounded">
                <h6 className="fw-bold text-danger text-uppercase mb-3">
                  Danh mục sản phẩm
                </h6>
                <ul className="list-unstyled m-0">
                  {categories.map((cat) => (
                    <li key={cat.id} className="mb-2">
                      <Link
                        to={`/category/${cat.slug}`}
                        className="category-link d-flex align-items-center"
                      >
                        <span className="me-2 fs-5">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* ==== CỘT PHẢI ==== */}
            <Col md={9} lg={10}>
              {/* ==== Banner chính ==== */}
              <div className="main-banner mb-4 rounded-4 overflow-hidden shadow-sm">
                <div className="banner-overlay">
                  <div className="banner-text text-white">
                    <h2 className="fw-bold mb-2">
                      Nâng tầm không gian sống cùng{" "}
                      <span className="wehome-brand">WeHome</span>
                    </h2>
                    <p className="mb-4">
                      Sản phẩm tiện nghi, thông minh, thân thiện với mọi gia đình Việt
                    </p>
                    <Button
                      variant="light"
                      as={Link}
                      to="/category/smart-home"
                      className="fw-semibold px-4 py-2"
                    >
                      Khám phá ngay
                    </Button>
                  </div>
                </div>
              </div>

              {/* ==== GỢI Ý SẢN PHẨM ==== */}
              <h5 className="fw-bold text-uppercase text-danger mb-3">
                Sản phẩm nổi bật
              </h5>

              <Row className="g-3">
                {products.map((p) => (
                  <Col key={p.id} xs={6} md={4} lg={3}>
                    <Link
                      to={`/product/${p.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <Card className="product-card shadow-sm border-0">
                        <div className="product-img-wrapper">
                          <img
                            src={p.images?.[0] || "/images/noimage.jpg"}
                            alt={p.name}
                            className="img-fluid"
                          />
                        </div>
                        <Card.Body className="text-center">
                          <Card.Title className="product-name">
                            {p.name}
                          </Card.Title>
                          <p className="product-price text-danger fw-bold mb-0">
                            {p.price?.toLocaleString("vi-VN")}₫
                          </p>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

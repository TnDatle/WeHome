import React from "react";
import { Container, Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { FaPhoneAlt, FaShoppingCart, FaUser, FaSearch, FaClipboardList, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../style/Header.css";

export default function Header() {
  return (
    <header className="header-area">
      {/* --- Thanh trên cùng --- */}
      <div className="top-bar">
        <Container className="d-flex justify-content-between align-items-center">
          <span className="text-white">
            <FaPhoneAlt className="me-2" />
            <strong>Hotline:</strong> 0909.090.909
          </span>
          <div className="top-links">
            <a href="#">Chính sách bán hàng</a>
            <a href="#">Liên hệ</a>
            <a href="#">Tuyển dụng</a>
            <a href="../auth/Login" className="login-link">
              <FaUser className="me-1" /> Đăng nhập
            </a>
          </div>
        </Container>
      </div>

      {/* --- Logo + Thanh tìm kiếm + Biểu tượng --- */}
      <div className="middle-bar">
        <Container>
          <Row className="align-items-center">
            <Col md={3} sm={12} className="text-center text-md-start mb-2 mb-md-0">
              <Link to="/" className="logo text-decoration-none">
                <h2 className="m-0">
                    <span className="logo-icon">W</span>E<span>HOME</span>
                </h2>
                </Link>
            </Col>

            <Col md={6} sm={12}>
              <InputGroup className="search-box">
                <FormControl placeholder="Bạn cần tìm sản phẩm gì?" />
                <Button variant="dark">
                  <FaSearch /> Tìm kiếm
                </Button>
              </InputGroup>
            </Col>

            <Col md={3} sm={12} className="icons text-center text-md-end mt-3 mt-md-0">
              <a href="../pages/Cart" className="icon-item">
                <FaShoppingCart />
                <span>Giỏ hàng</span>
              </a>
              <a href="../pages/TrackOrder" className="icon-item">
                <FaClipboardList />
                <span>Đơn hàng</span>
              </a>
              <a href="#" className="icon-item">
                <FaQuestionCircle />
                <span>Hỏi đáp</span>
              </a>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}

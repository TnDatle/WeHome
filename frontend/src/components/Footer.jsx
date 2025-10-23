import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import "../style/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-area text-white">
      <div className="footer-main">
        <Container>
          <Row className="justify-content-between">
            {/* ==== CỘT 1: GIỚI THIỆU ==== */}
            <Col md={5} sm={12} className="mb-4">
              <h4 className="footer-logo">
                <span className="logo-icon">W</span>E<span>HOME</span>
              </h4>
              <p className="footer-desc">
                WeHome.com tự hào mang đến những sản phẩm gia dụng thông minh,
                bền bỉ và tiện lợi — giúp nâng tầm chất lượng cuộc sống hiện đại của
                mọi gia đình Việt.
              </p>
              <ul className="footer-contact list-unstyled">
                <li>
                  <FaMapMarkerAlt className="me-2 text-danger" />
                  <strong>TP. Hồ Chí Minh:</strong> 18A/1 Cộng Hòa , Phường Tân Sơn Nhất
                </li>
                <li>
                  <FaMapMarkerAlt className="me-2 text-danger" />
                  <strong>TP. Hồ Chí Minh:</strong> 104 Nguyễn Văn Trỗi , Phường Phú Nhuận
                </li>
                <li>
                  <FaPhoneAlt className="me-2 text-danger" />
                  <strong>Hotline:</strong>{" "}
                  <span className="hotline">0909090909</span>
                </li>
                <li>
                  <FaEnvelope className="me-2 text-danger" />
                  <strong>Email hỗ trợ:</strong> support@wehome.com
                </li>
                <li>
                  <FaGlobe className="me-2 text-danger" />
                  <strong>Website:</strong> https://wehome.vaa.vn
                </li>
              </ul>
            </Col>

            {/* ==== CỘT 2: GIỚI THIỆU & TRỢ GIÚP ==== */}
            <Col md={3} sm={6} className="mb-4">
              <h5 className="footer-title">VỀ CHÚNG TÔI</h5>
              <ul className="footer-links list-unstyled">
                <li><a href="#">Giới thiệu doanh nghiệp</a></li>
                <li><a href="#">Liên hệ hợp tác</a></li>
                <li><a href="#">Cơ hội nghề nghiệp</a></li>
              </ul>

              <h5 className="footer-title mt-4">HƯỚNG DẪN MUA HÀNG</h5>
              <ul className="footer-links list-unstyled">
                <li><a href="#">Cách đặt hàng trực tuyến</a></li>
                <li><a href="#">Phương thức thanh toán</a></li>
                <li><a href="#">Chính sách giao hàng</a></li>
                <li><a href="#">Quản lý đơn hàng</a></li>
              </ul>
            </Col>

            {/* ==== CỘT 3: CHÍNH SÁCH & KẾT NỐI ==== */}
            <Col md={4} sm={6} className="mb-4">
              <h5 className="footer-title">CHÍNH SÁCH KHÁCH HÀNG</h5>
              <ul className="footer-links list-unstyled">
                <li><a href="../policy/DeliveryPolicy">Chính sách bán hàng</a></li>
                <li><a href="#">Vận chuyển & giao nhận</a></li>
                <li><a href="#">Bảo hành & bảo trì</a></li>
                <li><a href="#">Bảo mật thông tin</a></li>
                <li><a href="../policy/refundPolicy">Đổi trả & hoàn tiền</a></li>
              </ul>

              <h5 className="footer-title mt-4">KẾT NỐI CÙNG CHÚNG TÔI</h5>
              <div className="social-links mb-3">
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaYoutube /></a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ==== DÒNG DƯỚI ==== */}
      <div className="footer-bottom text-center">
        <Container>
          <p className="copyright">
            © {new Date().getFullYear()} WeHome.com — All rights reserved - Nhóm 8.
          </p>
        </Container>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from "react";
import {Container,Row,Col,Form,Button,Card,Spinner, Alert,} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import "../style/TrackOrder.css";

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrderInfo(null);

    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại!");
      return;
    }

    if (!/^(0|\+84)\d{9,10}$/.test(phone)) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (phone === "0832216580" || phone === "0321234567") {
        setOrderInfo({
          name: "Lê Tấn Đạt",
          phone: "0832 216 580",
          status: "Đang giao hàng",
          address: "104 Nguyễn Văn Trỗi, Q. Phú Nhuận, TP.HCM",
          date: "22/10/2025",
          items: [
            {
              name: "Nồi chiên không dầu Lock&Lock",
              qty: 1,
              price: "1.290.000₫",
            },
            {
              name: "Máy lọc không khí Sharp",
              qty: 1,
              price: "2.990.000₫",
            },
          ],
        });
      } else {
        setError("Không tìm thấy đơn hàng cho số điện thoại này!");
      }
    }, 1000);
  };

  // Tự cuộn mượt xuống phần kết quả
  useEffect(() => {
    if (orderInfo) {
      setTimeout(() => {
        const resultSection = document.querySelector(".result-card");
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [orderInfo]);

  return (
  <>
      <Helmet>
        <title>Tra cứu đơn hàng - WeHome</title>
      </Helmet>  
    <div className="track-order-page">
      <Container className="py-4">
        <h2 className="text-center mb-4 fw-bold text-danger">
          Tra cứu đơn hàng 
        </h2>

        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="p-4 shadow-sm border-0 track-card">
              <Form onSubmit={handleTrack}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại của bạn..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="danger"
                  type="submit"
                  className="w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang tra cứu...
                    </>
                  ) : (
                    "Tra cứu ngay"
                  )}
                </Button>
              </Form>
              {error && (
                <Alert variant="danger" className="mt-3 text-center">
                  {error}
                </Alert>
              )}
            </Card>
          </Col>
        </Row>

        {orderInfo && (
          <Row className="justify-content-center mt-4 mb-5">
            <Col md={8}>
              <Card className="p-4 shadow-sm border-0 result-card">
                <h5 className="fw-bold mb-3 text-danger">
                   Thông tin đơn hàng
                </h5>
                <p><strong>Khách hàng:</strong> {orderInfo.name}</p>
                <p><strong>SĐT:</strong> {orderInfo.phone}</p>
                <p><strong>Địa chỉ:</strong> {orderInfo.address}</p>
                <p><strong>Ngày đặt:</strong> {orderInfo.date}</p>
                <p className="status">
                  <strong>Trạng thái:</strong> <span>{orderInfo.status}</span>
                </p>

                <h6 className="mt-4 fw-bold">Sản phẩm trong đơn:</h6>
                <ul className="product-list">
                  {orderInfo.items.map((item, idx) => (
                    <li key={idx}>
                      <span>{item.name}</span>
                      <span>{item.qty} × {item.price}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
    </>
  );
}

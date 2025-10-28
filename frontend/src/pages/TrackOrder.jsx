import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { db } from "../config/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../style/TrackOrder.css";

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrders([]);

    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại!");
    if (!/^(0|\+84)\d{9,10}$/.test(phone))
      return setError("Số điện thoại không hợp lệ!");

    try {
      setLoading(true);

      const ordersRef = collection(db, "Orders");
      const q = query(ordersRef, where("phone", "==", phone.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Không tìm thấy đơn hàng cho số điện thoại này!");
      } else {
        const result = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setOrders(result);
      }
    } catch (err) {
      console.error("🔥 Lỗi tra cứu đơn hàng:", err);
      setError("Không thể tra cứu đơn hàng, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orders.length > 0) {
      setTimeout(() => {
        const el = document.querySelector(".result-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [orders]);

  // ✅ Phân loại đơn hàng
  const currentOrders = orders.filter(
    (o) => o.status === "Chờ xử lý" || o.status === "Đang giao"
  );
  const pastOrders = orders.filter(
    (o) => o.status === "Hoàn thành" || o.status === "Đã hủy"
  );

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

          {/* =================== KẾT QUẢ =================== */}
          {orders.length > 0 && (
            <div className="result-section mt-5 mb-5">
              {/* ===== ĐƠN HÀNG HIỆN TẠI ===== */}
              {currentOrders.length > 0 && (
                <>
                  <h4 className="fw-bold text-danger mb-3">Đơn hàng hiện tại</h4>
                  {currentOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="p-4 mb-4 shadow-sm border-0 result-card"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="fw-semibold text-danger mb-2">
                          Mã đơn: {order.orderId}
                        </h5>
                        <span
                          className={`order-status-badge ${
                            order.status === "Chờ xử lý"
                              ? "pending"
                              : order.status === "Đang giao"
                              ? "shipping"
                              : "done"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p>
                        <strong>Khách hàng:</strong> {order.fullname}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {order.address},{" "}
                        {order.commune}, {order.province}
                      </p>
                      <p>
                        <strong>Ngày đặt:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                      <p>
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {order.payment?.toUpperCase()}
                      </p>
                      <p>
                        <strong>Trạng thái thanh toán:</strong>{" "}
                        <span
                          className={
                            order.paymentStatus === "Đã thanh toán"
                              ? "text-success fw-semibold"
                              : "text-danger fw-semibold"
                          }
                        >
                          {order.paymentStatus}
                        </span>
                      </p>

                      {order.shipping && (
                        <>
                          <p>
                            <strong>Đơn vị vận chuyển:</strong>{" "}
                            {order.shipping.carrier}
                          </p>
                          <p>
                            <strong>Mã vận đơn:</strong>{" "}
                            {order.shipping.trackingCode}
                          </p>
                          <p>
                            <strong>Trạng thái giao:</strong>{" "}
                            {order.shipping.currentStatus === "picked_up"
                              ? "📦 Đã lấy hàng"
                              : order.shipping.currentStatus === "in_transit"
                              ? "🚚 Đang giao"
                              : order.shipping.currentStatus === "delivered"
                              ? "✅ Đã giao thành công"
                              : "—"}
                          </p>
                        </>
                      )}

                      {/* 🟢 DANH SÁCH SẢN PHẨM */}
                      <h6 className="mt-3 fw-bold">Sản phẩm:</h6>
                      <div className="product-list">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center justify-content-between border-bottom py-2"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image || "/images/no-image.png"}
                                alt={item.name}
                                className="rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  border: "1px solid #eee",
                                }}
                              />
                              <div>
                                <div className="fw-semibold">{item.name}</div>
                                <small className="text-muted">
                                  Số lượng: {item.quantity} ×{" "}
                                  {item.price.toLocaleString("vi-VN")}₫
                                </small>
                              </div>
                            </div>
                            <div className="fw-bold text-danger">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between fw-bold mt-3">
                        <span>Tổng cộng:</span>
                        <span className="text-danger">
                          {order.total.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </Card>
                  ))}
                </>
              )}

              {/* ===== LỊCH SỬ ĐƠN HÀNG ===== */}
              {pastOrders.length > 0 && (
                <>
                  <h4 className="fw-bold text-secondary mt-5 mb-3">
                    Lịch sử đơn hàng
                  </h4>
                  {pastOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="p-4 mb-4 shadow-sm border-0 result-card bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="fw-semibold text-dark mb-2">
                          Mã đơn: {order.orderId}
                        </h5>
                        <span
                          className={`order-status-badge ${
                            order.status === "Hoàn thành" ? "done" : "cancel"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p>
                        <strong>Ngày đặt:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                      <p>
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {order.payment?.toUpperCase()}
                      </p>
                      <p>
                        <strong>Trạng thái thanh toán:</strong>{" "}
                        {order.paymentStatus}
                      </p>

                      {/* 🟢 DANH SÁCH SẢN PHẨM TRONG LỊCH SỬ */}
                      <h6 className="mt-3 fw-bold">Sản phẩm:</h6>
                      <div className="product-list">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center justify-content-between border-bottom py-2"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image || "/images/no-image.png"}
                                alt={item.name}
                                className="rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  border: "1px solid #eee",
                                }}
                              />
                              <div>
                                <div className="fw-semibold">{item.name}</div>
                                <small className="text-muted">
                                  Số lượng: {item.quantity} ×{" "}
                                  {item.price.toLocaleString("vi-VN")}₫
                                </small>
                              </div>
                            </div>
                            <div className="fw-bold text-danger">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between fw-bold mt-3">
                        <span>Phí giao hàng:</span>
                        <span>30.000₫</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold mt-3">
                        <span>Tổng cộng:</span>
                        <span>{(order.total + 30000).toLocaleString("vi-VN")}₫</span>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

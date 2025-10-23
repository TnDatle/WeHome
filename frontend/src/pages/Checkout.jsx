import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { getProvinces, getCommunes } from "../API/Vietnam";
import "../style/Checkout.css";

export default function Checkout() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    commune: "",
    note: "",
    payment: "cod", // ✅ mặc định COD
  });

  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    setForm({ ...form, province: code, commune: "" });
    if (!code) return setCommunes([]);
    const data = await getCommunes(code);
    setCommunes(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setForm({ ...form, payment: e.target.value });
  };

  // Tạo mã đơn hàng tự động
  const [orderId] = useState(() => {
    return "DH" + Date.now().toString().slice(-8);
  });
  
  // Thông tin ngân hàng
  const bankInfo = {
    bank: "Vietcombank",
    accountNumber: "000000000",
    accountName: "NGUYEN VAN A",
    amount: "1640000"
  };
  
  // Tạo link QR code
  const qrCodeUrl = `https://img.vietqr.io/image/VCB-${bankInfo.accountNumber}-compact2.png?amount=${bankInfo.amount}&addInfo=${orderId}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  return (
    <div className="checkout-page container py-4">
      <Helmet>
        <title>Thanh toán - WeHome</title>
      </Helmet>

      <h3 className="fw-bold text-center text-uppercase mb-4">Thanh Toán</h3>

      <Row>
        {/* --- FORM BÊN TRÁI --- */}
        <Col md={7}>
          <Card className="p-4 shadow-sm border-0 checkout-card">
            <h5 className="fw-semibold mb-3 text-danger">Thông tin người nhận</h5>

            <Form>
              {/* ======= Thông tin người nhận ======= */}
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* ======= Địa chỉ ======= */}
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ cụ thể</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Số nhà, tên đường..."
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh / Thành phố</Form.Label>
                    <Form.Select
                      name="province"
                      value={form.province}
                      onChange={handleProvinceChange}
                      required
                    >
                      <option value="">-- Chọn Tỉnh/Thành phố --</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phường / Xã</Form.Label>
                    <Form.Select
                      name="commune"
                      value={form.commune}
                      onChange={handleChange}
                      disabled={!communes.length}
                      required
                    >
                      <option value="">
                        {communes.length
                          ? "-- Chọn Phường/Xã --"
                          : "Chọn Tỉnh trước"}
                      </option>
                      {communes.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* ======= Phương thức thanh toán ======= */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-danger">
                  Phương thức thanh toán
                </Form.Label>

                <div className="payment-options">
                  <Form.Check
                    type="radio"
                    id="payment-cod"
                    label="Thanh toán khi nhận hàng (COD)"
                    value="cod"
                    checked={form.payment === "cod"}
                    onChange={handlePaymentChange}
                    className="mb-2"
                  />
                  
                  <div className="payment-method-wrapper mb-2">
                    <Form.Check
                      type="radio"
                      id="payment-bank"
                      label="Chuyển khoản ngân hàng"
                      value="bank"
                      checked={form.payment === "bank"}
                      onChange={handlePaymentChange}
                    />
                    {form.payment === "bank" && (
                      <div className="bank-info mt-3 p-3 bg-light border rounded">
                        <Row>
                          <Col md={7}>
                            <p className="mb-2"><strong>Ngân hàng:</strong> {bankInfo.bank}</p>
                            <p className="mb-2"><strong>Số tài khoản:</strong> {bankInfo.accountNumber}</p>
                            <p className="mb-2"><strong>Chủ tài khoản:</strong> {bankInfo.accountName}</p>
                            <p className="mb-2"><strong>Số tiền:</strong> {parseInt(bankInfo.amount).toLocaleString('vi-VN')}₫</p>
                            <p className="mb-0">
                              <strong>Nội dung:</strong> 
                              <span className="text-danger fw-semibold ms-1">{orderId}</span>
                            </p>
                            <small className="text-muted d-block mt-1">
                              * Vui lòng ghi đúng nội dung để được xác nhận nhanh
                            </small>
                          </Col>
                          <Col md={5} className="text-center">
                            <img 
                              src={qrCodeUrl}
                              alt="QR Code thanh toán" 
                              className="img-fluid rounded"
                              style={{maxWidth: "180px", border: "2px solid #ddd"}}
                            />
                            <small className="text-muted d-block mt-2">
                              Quét mã QR để thanh toán
                            </small>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>

                  <div className="payment-method-wrapper">
                    <Form.Check
                      type="radio"
                      id="payment-wallet"
                      label="Ví điện tử"
                      value="wallet"
                      checked={form.payment === "wallet"}
                      onChange={handlePaymentChange}
                    />
                    {form.payment === "wallet" && (
                      <div className="wallet-options mt-2 d-flex gap-3 ps-4">
                        <div 
                          className="wallet-item p-3 border rounded text-center cursor-pointer"
                          style={{flex: 1, cursor: "pointer", transition: "all 0.2s"}}
                          onClick={() => alert("Chuyển đến Momo")}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = "#d82d8b"}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = "#dee2e6"}
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                            alt="Momo" 
                            style={{width: "60px", height: "60px", objectFit: "contain"}}
                          />
                          <p className="mb-0 mt-2 fw-semibold">Momo</p>
                        </div>
                        <div 
                          className="wallet-item p-3 border rounded text-center cursor-pointer"
                          style={{flex: 1, cursor: "pointer", transition: "all 0.2s"}}
                          onClick={() => alert("Chuyển đến VNPay")}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0066b2"}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = "#dee2e6"}
                        >
                          <img 
                            src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" 
                            alt="VNPay" 
                            style={{width: "60px", height: "60px", objectFit: "contain"}}
                          />
                          <p className="mb-0 mt-2 fw-semibold">VNPay</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Form.Group>
              {/* ======= Ghi chú ======= */}
              <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Ví dụ: giao buổi sáng, gọi trước khi đến..."
                />
              </Form.Group>

              <Button variant="danger" className="w-100 fw-semibold mt-2">
                Xác nhận đặt hàng
              </Button>
            </Form>
          </Card>
        </Col>

        {/* --- TÓM TẮT ĐƠN HÀNG --- */}
        <Col md={5}>
          <Card className="p-4 shadow-sm border-0 checkout-summary mt-4 mt-md-0">
            <h5 className="fw-semibold mb-3 text-danger">Tóm tắt đơn hàng</h5>

            <div className="order-items mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span className="fw-semibold d-block">
                    Tay cầm PS5 DualSense
                  </span>
                  <small className="text-muted">1 × 1.490.000₫</small>
                </div>
                <span className="fw-semibold">1.490.000₫</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span className="fw-semibold d-block">Dây HDMI cao cấp</span>
                  <small className="text-muted">2 × 120.000₫</small>
                </div>
                <span className="fw-semibold">240.000₫</span>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>30.000₫</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>1.640.000₫</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

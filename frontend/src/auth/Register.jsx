import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { getProvinces, getCommunes } from "../API/Vietnam";
import "../style/Register.css";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    province: "",
    commune: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Lấy danh sách tỉnh/thành ---
  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  // --- Khi chọn tỉnh ---
  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    setForm({ ...form, province: provinceCode, commune: "" });
    const data = await getCommunes(provinceCode);
    setCommunes(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullname, email, password, phone, address, province, commune } = form;
    if (!fullname || !email || !password || !phone || !address || !province || !commune) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setSuccess("Đăng ký tài khoản thành công!");
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký tài khoản - WeHome</title>
      </Helmet>

      <div className="register-page">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} sm={10}>
              <Card className="register-card shadow-sm border-0 p-4">
                {/* Header */}
                <div className="register-header text-center mb-4">
                  <h4 className="fw-bold text-danger mb-1">Tạo tài khoản WeHome</h4>
                  <p className="text-muted small mb-0">
                    Hoàn tất thông tin để tiếp tục mua sắm
                  </p>
                </div>


                <div className="alert alert-warning small py-2 mb-3 text-center" role="alert">
                   Dữ liệu địa chỉ sử dụng <strong>thông tin hành chính sau sáp nhập (2025)</strong>
                </div>

                {/* Form */}
                <Form onSubmit={handleRegister}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullname"
                          placeholder="Nguyễn Văn A"
                          value={form.fullname}
                          onChange={handleChange}
                          className="form-input-modern"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email của bạn..."
                          value={form.email}
                          onChange={handleChange}
                          className="form-input-modern"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Tối thiểu 6 ký tự"
                          value={form.password}
                          onChange={handleChange}
                          className="form-input-modern"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="VD: 0987654321"
                          value={form.phone}
                          onChange={handleChange}
                          className="form-input-modern"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Số nhà, tên đường..."
                      value={form.address}
                      onChange={handleChange}
                      className="form-input-modern"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh / Thành phố</Form.Label>
                    <Form.Select
                      name="province"
                      value={form.province}
                      onChange={handleProvinceChange}
                      className="form-input-modern"
                    >
                      <option value="">-- Chọn Tỉnh/Thành phố --</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phường / Xã</Form.Label>
                    <Form.Select
                      name="commune"
                      value={form.commune}
                      onChange={handleChange}
                      className="form-input-modern"
                      disabled={!communes.length}
                    >
                      <option value="">
                        {communes.length ? "-- Chọn Phường/Xã --" : "Chọn Tỉnh trước"}
                      </option>
                      {communes.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 fw-semibold register-btn-modern mt-2"
                  >
                    Đăng ký ngay
                  </Button>
                </Form>

                {/* Alerts */}
                {error && (
                  <Alert variant="danger" className="mt-3 text-center">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mt-3 text-center">
                    {success}
                  </Alert>
                )}

                {/* Footer */}
                <div className="text-center mt-3">
                  <span className="small">
                    Đã có tài khoản?{" "}
                    <a href="Login" className="text-danger fw-semibold">
                      Đăng nhập
                    </a>
                  </span>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

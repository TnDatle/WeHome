import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Helmet } from "react-helmet-async"; 
import "../style/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (email === "admin@wehome.vn" && password === "123456") {
      setSuccess("Đăng nhập thành công!");
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập - WeHome</title>
      </Helmet>

      <div className="login-page">
        <Container>
          <Row className="justify-content-center">
            <Col md={5} sm={8}>
              <Card className="login-card shadow-sm border-0 p-4">
                {/* --- HEADER --- */}
                <div className="login-header text-center mb-4">
                  <h4 className="fw-bold text-danger mb-1">Đăng nhập WeHome</h4>
                  <p className="text-muted small mb-0">
                    Chào mừng bạn trở lại
                  </p>
                </div>

                {/* --- FORM --- */}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email đăng nhập</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email của bạn..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input-modern"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input-modern"
                    />
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 fw-semibold login-btn-modern"
                  >
                    Đăng nhập
                  </Button>
                </Form>

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

                {/* --- FOOTER LINKS --- */}
                <div className="text-center mt-3">
                  <a href="/forgot-password" className="text-danger small d-block mb-1">
                    Quên mật khẩu?
                  </a>
                  <span className="small">
                    Chưa có tài khoản?{" "}
                    <a href="Register" className="text-danger fw-semibold">
                      Đăng ký ngay
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

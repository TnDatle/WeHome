import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import "../style/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Đăng nhập Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Lấy thông tin Firestore
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Không tìm thấy thông tin người dùng!");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      if (userData.role === "Customer") {
        // ✅ SweetAlert thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          text: `Chào mừng bạn trở lại, ${userData.fullname}!`,
          showConfirmButton: false,
          timer: 1800,
        });

        // Lưu user và điều hướng sau 1.5s
        localStorage.setItem("wehomeUser", JSON.stringify(userData));
        setTimeout(() => navigate("/"), 1500);
      } else if (userData.role === "Admin") {
        setError("Tài khoản quản trị viên không thể đăng nhập tại đây!");
      } else {
        setError("Tài khoản không hợp lệ!");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") setError("Email không tồn tại!");
      else if (err.code === "auth/wrong-password") setError("Mật khẩu không đúng!");
      else setError("Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
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
                <div className="login-header text-center mb-4">
                  <h4 className="fw-bold text-danger mb-1">Đăng nhập WeHome</h4>
                  <p className="text-muted small mb-0">Chào mừng bạn trở lại</p>
                </div>

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
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </Form>

                {error && (
                  <Alert variant="danger" className="mt-3 text-center">
                    {error}
                  </Alert>
                )}

                <div className="text-center mt-3">
                  <a href="/forgot-password" className="text-danger small d-block mb-1">
                    Quên mật khẩu?
                  </a>
                  <span className="small">
                    Chưa có tài khoản?{" "}
                    <a href="/auth/Register" className="text-danger fw-semibold">
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

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { getProvinces, getCommunes } from "../API/Vietnam";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import "../style/Register.css";

export default function Register() {
  const navigate = useNavigate();

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

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    const selectedProvince = provinces.find((p) => p.code === provinceCode);
    setForm({ ...form, province: selectedProvince?.name || "", commune: "" });
    const data = await getCommunes(provinceCode);
    setCommunes(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullname, email, password, phone, address, province, commune } = form;
    if (!fullname || !email || !password || !phone || !address || !province || !commune) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      // 1️⃣ Tạo tài khoản bằng Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Lưu thông tin vào Firestore
      await setDoc(doc(db, "Users", user.uid), {
        fullname,
        email,
        phone,
        address,
        province,
        commune,
        role: "Customer", 
        createdAt: new Date(),
      });

      setSuccess("Đăng ký tài khoản thành công!");
      setTimeout(() => navigate("/auth/Login"), 1500);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email này đã được sử dụng!");
      } else if (err.code === "auth/weak-password") {
        setError("Mật khẩu phải có ít nhất 6 ký tự!");
      } else {
        setError("Đăng ký thất bại, vui lòng thử lại!");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký tài khoản - WeHome</title>
      </Helmet>
      <div className="register-page">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="register-card p-4 border-0 shadow-sm">
                <h4 className="text-danger fw-bold text-center mb-3">Tạo tài khoản WeHome</h4>

                <Form onSubmit={handleRegister}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control name="fullname" value={form.fullname} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Điện thoại</Form.Label>
                        <Form.Control type="tel" name="phone" value={form.phone} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control name="address" value={form.address} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh / Thành phố</Form.Label>
                    <Form.Select onChange={handleProvinceChange}>
                      <option value="">-- Chọn Tỉnh/Thành phố --</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phường / Xã</Form.Label>
                    <Form.Select name="commune" value={form.commune} onChange={handleChange} disabled={!communes.length}>
                      <option value="">{communes.length ? "-- Chọn Phường/Xã --" : "Chọn Tỉnh trước"}</option>
                      {communes.map((c) => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button type="submit" variant="danger" className="w-100 fw-semibold">Đăng ký ngay</Button>
                </Form>

                {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3 text-center">{success}</Alert>}

                <div className="text-center mt-3">
                  <small>
                    Đã có tài khoản?{" "}
                    <a href="/login" className="text-danger fw-semibold">Đăng nhập</a>
                  </small>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

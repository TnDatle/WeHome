import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import { useUser } from "../context/UserContext";
import { getProvinces, getCommunes } from "../API/Vietnam";
import  "../style/Profile.css" ;
import Swal from "sweetalert2";

export default function Profile() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    commune: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  //  Load danh sách tỉnh
  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  //  Load dữ liệu user khi có user
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    setForm({
      fullname: user.fullname || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      province: user.province || "",
      commune: user.commune || "",
    });

    if (user.province) {
      const province = provinces.find((p) => p.name === user.province);
      if (province) {
        getCommunes(province.code).then(setCommunes);
        setSelectedProvince(province.code);
      }
    }
  }, [user, loading, navigate, provinces]);

  //  Khi chọn tỉnh
  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    const province = provinces.find((p) => p.code.toString() === provinceCode);
    setForm({ ...form, province: province?.name || "", commune: "" });
    const data = await getCommunes(provinceCode);
    setCommunes(data);
  };

  //  Khi chọn phường
  const handleCommuneChange = (e) => {
    const communeName = e.target.value;
    setForm({ ...form, commune: communeName });
  };

  //  Khi thay đổi input khác
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Cập nhật hồ sơ
  const handleUpdate = async (e) => {
  e.preventDefault();

  if (!user || !user.uid) {
    Swal.fire({
      icon: "error",
      title: "Bạn chưa đăng nhập!",
      text: "Vui lòng đăng nhập lại để tiếp tục.",
    });
    return;
  }

  try {
    const userRef = doc(db, "Users", user.uid);
    await updateDoc(userRef, {
      fullname: form.fullname,
      phone: form.phone,
      address: form.address,
      province: form.province,
      commune: form.commune,
    });

    Swal.fire({
      icon: "success",
      title: "Cập nhật thành công!",
      text: "Thông tin hồ sơ của bạn đã được lưu.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: "Không thể cập nhật thông tin. Vui lòng thử lại.",
    });
  }
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <div className="profile-page py-5">
      <Container>
        <Card className="shadow-sm p-4 border-0">
          <h4 className="fw-bold text-danger mb-4">Hồ sơ người dùng</h4>

          <Form onSubmit={handleUpdate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ cụ thể</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tỉnh / Thành phố</Form.Label>
                  <Form.Select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                  >
                    <option value="">-- Chọn Tỉnh / Thành phố --</option>
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
                    value={form.commune}
                    onChange={handleCommuneChange}
                    disabled={!communes.length}
                  >
                    <option value="">
                      {communes.length ? "-- Chọn Phường / Xã --" : "Chọn Tỉnh trước"}
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

            <div className="text-end mt-3">
              <Button type="submit" variant="danger" className="fw-semibold px-4">
                Cập nhật
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

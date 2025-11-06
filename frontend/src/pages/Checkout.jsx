import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { getProvinces, getCommunes } from "../API/Vietnam";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { db } from "../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import toast from "react-hot-toast";
import "../style/Checkout.css";

export default function Checkout() {
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    commune: "",
    note: "",
    payment: "cod",
  });
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  const navigate = useNavigate();
  const { user } = useUser();

  //  Load giỏ hàng và danh sách tỉnh
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("checkout_cart")) || [];
    if (savedCart.length === 0) {
      toast.error("Giỏ hàng trống!");
      navigate("/cart");
    } else {
      setCart(savedCart);
      setTotal(savedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }

    // Load danh sách tỉnh
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
      setLoadingProvinces(false);
    };
    fetchProvinces();
  }, [navigate]);

  //  Load thông tin user (nếu có)
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || provinces.length === 0) return;

      try {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const u = docSnap.data();

          const provinceMatch = provinces.find((p) => p.name === u.province);
          const provinceCode = provinceMatch ? provinceMatch.code : "";

          let communeCode = "";
          if (provinceCode) {
            const data = await getCommunes(provinceCode);
            setCommunes(data);
            const communeMatch = data.find((c) => c.name === u.commune);
            communeCode = communeMatch ? communeMatch.code : "";
          }

          setForm((prev) => ({
            ...prev,
            fullname: u.fullname || "",
            phone: u.phone || "",
            email: u.email || user.email || "",
            address: u.address || "",
            province: u.province || "",
            commune: u.commune || "",
            provinceCode,
            communeCode,
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            email: user.email || "",
          }));
        }
      } catch (err) {
        console.error("🔥 Lỗi khi load thông tin người dùng:", err);
      }
    };

    loadUserProfile();
  }, [user, provinces]);

  //  Xử lý thay đổi
  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    const selected = provinces.find((p) => p.code === code);

    setForm({
      ...form,
      province: selected ? selected.name : "",
      commune: "",
      provinceCode: code,
      communeCode: "",
    });

    if (!code) return setCommunes([]);
    const data = await getCommunes(code);
    setCommunes(data);
  };

  const handleCommuneChange = (e) => {
    const code = e.target.value;
    const selected = communes.find((c) => c.code === code);
    setForm({
      ...form,
      commune: selected ? selected.name : "",
      communeCode: code,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setForm({ ...form, payment: e.target.value });
  };

  //  Mã đơn hàng tự động
  const [orderId] = useState(() => {
    return "DH" + Date.now().toString().slice(-8);
  });

  //  Thông tin ngân hàng
  const bankInfo = {
    bank: "Vietcombank",
    accountNumber: "000000000",
    accountName: "NGUYEN VAN A",
    amount: total + 30000,
  };

  const qrCodeUrl = `https://img.vietqr.io/image/VCB-${bankInfo.accountNumber}-compact2.png?amount=${bankInfo.amount}&addInfo=${orderId}&accountName=${encodeURIComponent(
    bankInfo.accountName
  )}`;

  //  Submit đơn hàng
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullname || !form.phone || !form.address || !form.province) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      ...form,
      items: cart,
      total,
      orderId,
      status: "Chờ xử lý",
      createdAt: new Date().toISOString(),
      paymentStatus: "Chưa thanh toán",
    };

    if (user) {
      orderData.userID = user.uid;
      orderData.role = "Customer";
      orderData.isGuest = false;
    } else {
      orderData.role = "Guest";
      orderData.isGuest = true;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", orderData);
      toast.success("Đặt hàng thành công!");
      localStorage.removeItem("checkout_cart");
      localStorage.removeItem("wehome_cart");
      // Phát sự kiện tùy chỉnh để cập nhật cartCount trong Header
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/thankyou", { state: { orderId } });
    } catch (err) {
      console.error(" Lỗi khi gửi đơn hàng:", err);
      toast.error("Không thể đặt hàng, vui lòng thử lại!");
    }
  };

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

            {loadingProvinces ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="danger" /> <p>Đang tải dữ liệu địa chỉ...</p>
              </div>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    placeholder="Nhập họ và tên"
                    value={form.fullname}
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
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!!user}
                    style={{ background: user ? "#f8f9fa" : "#fff" }}
                  />
                </Form.Group>

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
                        value={form.provinceCode || ""}
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
                        value={form.communeCode || ""}
                        onChange={handleCommuneChange}
                        disabled={!communes.length}
                        required
                      >
                        <option value="">
                          {communes.length ? "-- Chọn Phường/Xã --" : "Chọn Tỉnh trước"}
                        </option>
                        {communes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* ======= PHƯƠNG THỨC THANH TOÁN ======= */}
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

                    <Form.Check
                      type="radio"
                      id="payment-bank"
                      label="Chuyển khoản ngân hàng"
                      value="bank"
                      checked={form.payment === "bank"}
                      onChange={handlePaymentChange}
                      className="mb-2"
                    />

                    {form.payment === "bank" && (
                      <div className="bank-info mt-3 p-3 bg-light border rounded">
                        <Row>
                          <Col md={7}>
                            <p className="mb-2"><strong>Ngân hàng:</strong> {bankInfo.bank}</p>
                            <p className="mb-2"><strong>Số tài khoản:</strong> {bankInfo.accountNumber}</p>
                            <p className="mb-2"><strong>Chủ tài khoản:</strong> {bankInfo.accountName}</p>
                            <p className="mb-2"><strong>Số tiền:</strong> {bankInfo.amount.toLocaleString("vi-VN")}₫</p>
                            <p className="mb-0"><strong>Nội dung:</strong> <span className="text-danger fw-semibold">{orderId}</span></p>
                          </Col>
                          <Col md={5} className="text-center">
                            <img src={qrCodeUrl} alt="QR Code" className="img-fluid rounded" style={{ maxWidth: "180px" }} />
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                </Form.Group>

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

                <Button variant="danger" className="w-100 fw-semibold mt-2" onClick={handleSubmit}>
                  Xác nhận đặt hàng
                </Button>
              </Form>
            )}
          </Card>
        </Col>

        {/* --- TÓM TẮT ĐƠN HÀNG --- */}
        <Col md={5}>
          <Card className="p-4 shadow-sm border-0 checkout-summary mt-4 mt-md-0">
            <h5 className="fw-semibold mb-3 text-danger">Tóm tắt đơn hàng</h5>
            <div className="order-items mb-3">
              {cart.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span className="fw-semibold d-block">{item.name}</span>
                    <small className="text-muted">{item.quantity} × {item.price.toLocaleString("vi-VN")}₫</small>
                  </div>
                  <span className="fw-semibold">
                    {(item.quantity * item.price).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>30.000₫</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>{(total + 30000).toLocaleString("vi-VN")}₫</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

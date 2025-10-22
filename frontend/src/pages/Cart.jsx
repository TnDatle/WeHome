import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "../style/Cart.css";

export default function Cart() {
  // ✅ Dữ liệu mẫu (sau này có thể thay bằng API hoặc localStorage)
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Nồi chiên không dầu Lock&Lock",
      price: 1290000,
      quantity: 1,
      image: "https://cdn.tgdd.vn/Products/Images/1983/235502/lock-lock-llaf-112d-1.jpg",
    },
    {
      id: 2,
      name: "Máy lọc không khí Sharp",
      price: 2990000,
      quantity: 1,
      image: "https://cdn.tgdd.vn/Products/Images/5477/229415/sharp-fp-j40e-w-1.jpg",
    },
  ]);

  // ✅ Tăng giảm số lượng
  const handleQuantityChange = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // ✅ Xóa sản phẩm
  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // ✅ Tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


    const navigate = useNavigate();

    const handleCheckout = () => {
    // Chuyển hướng sang trang thanh toán
    navigate("../pages/Checkout");
  };
  return (
    <>
      <Helmet>
        <title>Giỏ hàng - WeHome</title>
      </Helmet>

      <div className="cart-page">
        <Container>
          <h3 className="text-center mb-4 fw-bold text-danger">Giỏ hàng của bạn</h3>

          {cart.length === 0 ? (
            <Card className="text-center py-5 border-0 shadow-sm">
              <h5>Giỏ hàng của bạn đang trống!</h5>
              <p className="text-muted small">Hãy thêm sản phẩm để tiếp tục mua sắm nhé.</p>
              <Button variant="danger" href="/">
                Tiếp tục mua sắm
              </Button>
            </Card>
          ) : (
            <Row>
              <Col md={8}>
                <Card className="cart-list shadow-sm border-0">
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="cart-img"
                              />
                              <span className="cart-name">{item.name}</span>
                            </div>
                          </td>
                          <td>{item.price.toLocaleString("vi-VN")}₫</td>
                          <td>
                            <div className="qty-controls">
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, -1)}
                              >
                                −
                              </Button>
                              <span className="qty-value">{item.quantity}</span>
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td>
                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemove(item.id)}
                            >
                              ✕
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="cart-summary shadow-sm border-0 p-3">
                  <h5 className="fw-bold mb-3">Tóm tắt đơn hàng</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính</span>
                    <span>{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="d-flex justify-content-between fw-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-danger fs-5">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <hr />
                  <Button variant="danger" className="w-100 fw-semibold" onClick={handleCheckout}>
                    Tiến hành đặt hàng
                  </Button>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}

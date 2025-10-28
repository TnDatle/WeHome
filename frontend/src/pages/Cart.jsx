import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "../utils/cartUtils"; 
import "../style/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();


  // ✅ Lấy giỏ hàng từ localStorage khi load trang
  useEffect(() => {
    setCart(getCart());
  }, []);

  // ✅ Tăng giảm số lượng
  const handleQuantityChange = (id, delta) => {
    const updated = updateQuantity(
      id,
      Math.max(
        1,
        (cart.find((item) => item.id === id)?.quantity || 1) + delta
      )
    );
    setCart(updated);
    refreshCartCount(); 
  };

  const handleRemove = (id) => {
    const updated = removeFromCart(id);
    setCart(updated);
    refreshCartCount(); 
  };

  // Tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Chuyển sang trang Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");
    
    // Lưu giỏ hàng vào localStorage để Checkout đọc lại
    localStorage.setItem("checkout_cart", JSON.stringify(cart));

    navigate("../pages/Checkout");
  };

  return (
    <>
      <Helmet>
        <title>Giỏ hàng - WeHome</title>
      </Helmet>

      <div className="cart-page">
        <Container>
          <h3 className="text-center mb-4 fw-bold text-danger">
            Giỏ hàng của bạn
          </h3>

          {cart.length === 0 ? (
            <Card className="text-center py-5 border-0 shadow-sm">
              <h5>Giỏ hàng của bạn đang trống!</h5>
              <p className="text-muted small">
                Hãy thêm sản phẩm để tiếp tục mua sắm nhé.
              </p>
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
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                              >
                                −
                              </Button>
                              <span className="qty-value">
                                {item.quantity}
                              </span>
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(item.id, 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td>
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            ₫
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
                  <Button
                    variant="danger"
                    className="w-100 fw-semibold"
                    onClick={handleCheckout}
                  >
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

import React, { useState } from "react";
import { Container, Row, Col, Nav, Button, Table } from "react-bootstrap";
import "./Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fake data sản phẩm
  const products = [
    { id: 1, name: "Áo thun trắng", price: "150.000đ", stock: 10 },
    { id: 2, name: "Quần jeans xanh", price: "350.000đ", stock: 5 },
    { id: 3, name: "Giày sneaker", price: "800.000đ", stock: 8 },
  ];

  // Render nội dung theo tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <h2>Bảng điều khiển</h2>
            <p>Xin chào admin! Hôm nay bạn có 3 đơn hàng mới 🎉</p>
          </>
        );

      case "products":
        return (
          <>
            <h2>Quản lý sản phẩm</h2>
            <Button variant="primary" className="mb-3">+ Thêm sản phẩm</Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <Button size="sm" variant="warning" className="me-2">Sửa</Button>
                      <Button size="sm" variant="danger">Xóa</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        );

      case "orders":
        return <h2>Quản lý đơn hàng (đang phát triển)</h2>;

      case "users":
        return <h2>Quản lý người dùng (đang phát triển)</h2>;

      default:
        return <h2>Trang không tồn tại</h2>;
    }
  };

  return (
    <Container fluid className="admin-container">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="admin-sidebar p-3">
          <h4 className="text-white text-center mb-4">Admin Panel</h4>
          <Nav className="flex-column">
            <Nav.Link
              className={`admin-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              🏠 Dashboard
            </Nav.Link>
            <Nav.Link
              className={`admin-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              📦 Sản phẩm
            </Nav.Link>
            <Nav.Link
              className={`admin-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              🧾 Đơn hàng
            </Nav.Link>
            <Nav.Link
              className={`admin-link ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              👤 Người dùng
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main content */}
        <Col md={10} className="admin-content p-4">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;

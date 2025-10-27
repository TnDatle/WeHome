import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Spinner,
  Button,
  Nav,
} from "react-bootstrap";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import "../style/Orders.css";

export default function Orders() {
  const { loading } = useUser();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [fetching, setFetching] = useState(true);

  // ✅ MOCK DATA
  const mockOrders = [
    {
      id: "1",
      userId: "mock-uid",
      orderCode: "WH20251027001",
      items: [
        { name: "Nồi chiên không dầu Philips HD9252", qty: 1, price: 2490000 },
        { name: "Bình đun siêu tốc Lock&Lock", qty: 1, price: 690000 },
      ],
      total: 3180000,
      status: "Chờ xử lý",
      paymentMethod: "Thanh toán khi nhận hàng",
      paymentStatus: "Chưa thanh toán",
      createdAt: { seconds: 1730001200, nanoseconds: 0 },
      shippingAddress: "18A/1 Cộng Hòa, P.4, Q.Tân Bình, TP.HCM",
    },
    {
      id: "2",
      userId: "mock-uid",
      orderCode: "WH20251026002",
      items: [
        { name: "Máy hút bụi Electrolux ZSP4301", qty: 1, price: 3290000 },
      ],
      total: 3290000,
      status: "Đang giao",
      paymentMethod: "MoMo",
      paymentStatus: "Đã thanh toán",
      createdAt: { seconds: 1729991100, nanoseconds: 0 },
      shippingAddress: "45 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    },
    {
      id: "3",
      userId: "mock-uid",
      orderCode: "WH20251025003",
      items: [
        { name: "Máy lọc không khí Xiaomi Air Purifier 4", qty: 1, price: 3490000 },
        { name: "Tinh dầu khử mùi Airwick", qty: 2, price: 199000 },
      ],
      total: 3888000,
      status: "Hoàn thành",
      paymentMethod: "Chuyển khoản ngân hàng",
      paymentStatus: "Đã thanh toán",
      createdAt: { seconds: 1729800000, nanoseconds: 0 },
      shippingAddress: "Số 10 Lê Văn Việt, Thủ Đức, TP.HCM",
    },
    {
      id: "4",
      userId: "mock-uid",
      orderCode: "WH20251020004",
      items: [
        { name: "Máy sấy tóc Panasonic", qty: 1, price: 499000 },
        { name: "Bàn ủi hơi nước Philips GC1740", qty: 1, price: 699000 },
      ],
      total: 1198000,
      status: "Đã hủy",
      paymentMethod: "COD",
      paymentStatus: "Hoàn tiền",
      createdAt: { seconds: 1729500000, nanoseconds: 0 },
      shippingAddress: "Tòa nhà Landmark 81, Bình Thạnh, TP.HCM",
    },
  ];

  // 🔹 Giả lập tải dữ liệu
  useEffect(() => {
    setFetching(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setFetching(false);
    }, 600);
  }, []);

  // 🔹 Phân loại đơn hàng
  const currentOrders = orders.filter(
    (o) =>
      o.status === "Chờ xử lý" ||
      o.status === "Đang xử lý" ||
      o.status === "Đang giao"
  );
  const historyOrders = orders.filter(
    (o) => o.status === "Hoàn thành" || o.status === "Đã hủy"
  );

  // 🔹 Badge trạng thái đơn hàng
  const getBadgeVariant = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "warning";
      case "Đang giao":
        return "info";
      case "Hoàn thành":
        return "success";
      case "Đã hủy":
        return "secondary";
      default:
        return "light";
    }
  };

  // 🔹 Xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    Swal.fire({
      title: `Đơn hàng ${order.orderCode}`,
      html: `
        <div style="text-align:left">
          <p><strong>Trạng thái đơn hàng:</strong> ${order.status}</p>
          <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
          <p><strong>Trạng thái thanh toán:</strong> ${order.paymentStatus}</p>
          <p><strong>Ngày đặt:</strong> ${new Date(
            order.createdAt.seconds * 1000
          ).toLocaleString("vi-VN")}</p>
          <p><strong>Địa chỉ giao hàng:</strong> ${
            order.shippingAddress || "Chưa cập nhật"
          }</p>
          <hr/>
          <strong>Danh sách sản phẩm:</strong>
          <ul style="padding-left:16px;">
            ${order.items
              .map(
                (item) =>
                  `<li>${item.name} (${item.qty} x ${item.price.toLocaleString(
                    "vi-VN"
                  )}₫)</li>`
              )
              .join("")}
          </ul>
          <hr/>
          <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString(
            "vi-VN"
          )}₫</p>
        </div>
      `,
      confirmButtonText: "Đóng",
      confirmButtonColor: "#dc3545",
      width: 600,
    });
  };

  // 🔹 Hủy đơn hàng
  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: "Xác nhận hủy đơn?",
      text: "Sau khi hủy, đơn hàng sẽ không thể phục hồi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Hủy đơn hàng",
      cancelButtonText: "Thoát",
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "Đã hủy", paymentStatus: "Hoàn tiền" }
              : o
          )
        );

        Swal.fire({
          icon: "success",
          title: "Đã hủy đơn hàng",
          text: "Đơn hàng của bạn đã được hủy thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  if (loading || fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  // 🔹 Bảng danh sách đơn hàng
  const renderTable = (data) => (
    <Table responsive bordered hover className="align-middle">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Mã đơn</th>
          <th>Ngày đặt</th>
          <th>Trạng thái</th>
          <th>Tổng tiền</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((order, index) => (
          <tr key={order.id}>
            <td>{index + 1}</td>
            <td>{order.orderCode}</td>
            <td>
              {new Date(order.createdAt.seconds * 1000).toLocaleString("vi-VN")}
            </td>
            <td>
              <Badge bg={getBadgeVariant(order.status)}>{order.status}</Badge>
            </td>
            <td>{order.total.toLocaleString("vi-VN")}₫</td>
            <td className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleViewDetails(order)}
              >
                Xem
              </Button>

              {order.status === "Chờ xử lý" && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Hủy đơn
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <div className="orders-page py-5">
      <Container>
        <Card className="shadow-sm border-0 p-4">
          <h4 className="fw-bold text-danger mb-4">Đơn hàng của tôi</h4>

          {/* Tabs */}
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
            className="mb-3"
          >
            <Nav.Item>
              <Nav.Link eventKey="current">Đơn hàng hiện tại</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="history">Lịch sử đơn hàng</Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === "current" ? (
            currentOrders.length ? (
              renderTable(currentOrders)
            ) : (
              <p className="text-center text-muted">
                Không có đơn hàng nào đang xử lý hoặc giao.
              </p>
            )
          ) : historyOrders.length ? (
            renderTable(historyOrders)
          ) : (
            <p className="text-center text-muted">
              Chưa có đơn hàng nào trong lịch sử.
            </p>
          )}
        </Card>
      </Container>
    </div>
  );
}

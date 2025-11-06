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
import { db } from "../config/Firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import "../style/Orders.css";

export default function Orders() {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [fetching, setFetching] = useState(true);

  //  Lấy đơn hàng từ Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return setFetching(false); // chưa đăng nhập

      try {
        setFetching(true);
        const q = query(
          collection(db, "Orders"),
          where("userID", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi truy vấn đơn hàng:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchOrders();
  }, [user]);

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

  //  Badge trạng thái đơn hàng
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

  //  Xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    Swal.fire({
      title: `Đơn hàng ${order.orderId}`,
      html: `
        <div style="text-align:left">
          <p><strong>Trạng thái đơn hàng:</strong> ${order.status}</p>
          <p><strong>Phương thức thanh toán:</strong> ${order.payment}</p>
          <p><strong>Trạng thái thanh toán:</strong> ${
            order.paymentStatus || "Chưa cập nhật"
          }</p>
          <p><strong>Ngày đặt:</strong> ${
            order.createdAt
              ? new Date(order.createdAt).toLocaleString("vi-VN")
              : "-"
          }</p>
          <p><strong>Địa chỉ giao hàng:</strong> ${
            order.address || "Chưa cập nhật"
          }, ${order.commune || ""}, ${order.province || ""}</p>
          <hr/>
          <strong>Danh sách sản phẩm:</strong>
          <ul style="padding-left:16px;">
            ${order.items
              .map(
                (item) =>
                  `<li>${item.name} (${item.quantity} × ${item.price.toLocaleString(
                    "vi-VN"
                  )}₫)</li>`
              )
              .join("")}
          </ul>
          <hr/>
          <p><strong>Phí giao hàng: 30.000đ</strong></p>
          <p><strong>Tổng tiền:</strong> ${(order.total + 30000).toLocaleString(
            "vi-VN"
          )}₫</p>
        </div>
      `,
      confirmButtonText: "Đóng",
      confirmButtonColor: "#dc3545",
      width: 600,
    });
  };

  //  Hủy đơn hàng
  const handleCancelOrder = async (order) => {
    Swal.fire({
      title: "Xác nhận hủy đơn?",
      text: "Sau khi hủy, đơn hàng sẽ không thể phục hồi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Hủy đơn hàng",
      cancelButtonText: "Thoát",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateDoc(doc(db, "Orders", order.id), {
            status: "Đã hủy",
            paymentStatus: "Hoàn tiền",
          });

          setOrders((prev) =>
            prev.map((o) =>
              o.id === order.id
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
        } catch (err) {
          console.error("🔥 Lỗi khi hủy đơn hàng:", err);
          Swal.fire("Lỗi!", "Không thể hủy đơn hàng. Thử lại sau.", "error");
        }
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

  //  Bảng danh sách đơn hàng
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
            <td>{order.orderId}</td>
            <td>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("vi-VN")
                : "-"}
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
                  onClick={() => handleCancelOrder(order)}
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

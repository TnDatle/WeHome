import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/Order.css";
import { printInvoice } from "../Components/InvoicePrint";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [dateFilter, setDateFilter] = useState("");

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("🔥 Lỗi khi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật trạng thái
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/orders/${id}/status`, {
        status: newStatus,
      });
      await fetchOrders(); // gọi lại danh sách để đảm bảo dữ liệu mới nhất
    } catch (err) {
      console.error("🔥 Lỗi cập nhật trạng thái:", err);
    }
  };


  // Tạo vận chuyển
  const handleCreateShipment = async (id) => {
    try {
      const carrier = prompt("Nhập đơn vị vận chuyển (GHN / GHTK / VNPOST):", "GHN");
      if (!carrier) return;

      const res = await axios.patch(`/api/orders/${id}/shipping`, {
        carrier,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status: res.data.status,
                shipping: {
                  carrier: res.data.carrier || carrier,
                  trackingCode: res.data.trackingCode,
                  currentStatus: "picked_up",
                },
              }
            : o
        )
      );
      alert(`Đã tạo vận chuyển thành công! Mã vận đơn: ${res.data.trackingCode}`);
    } catch (err) {
      console.error("🔥 Lỗi tạo vận chuyển:", err.response?.data || err.message);
      alert("Không thể tạo đơn vận chuyển, vui lòng thử lại!");
    }
  };

  // Xóa đơn hàng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("🔥 Lỗi khi xóa đơn hàng:", err);
    }
  };

  // Lọc đơn hàng
  const filteredOrders = orders
    .filter((o) => o.fullname?.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => (statusFilter === "Tất cả" ? true : o.status === statusFilter))
    .filter((o) => (dateFilter ? o.createdAt?.slice(0, 10) === dateFilter : true));

  return (
    <div className="order-container">
      <div className="order-header">
        <h4>Quản lý đơn hàng</h4>
        <button className="btn-refresh" onClick={fetchOrders}>
          🔄 Làm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="order-filter">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên khách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>Tất cả</option>
          <option>Chờ xử lý</option>
          <option>Đang giao</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
        </select>
      </div>

      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="no-data">Không có đơn hàng nào phù hợp.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const locked = o.status === "Hoàn thành" || o.status === "Đã hủy";
              return (
                <tr key={o.id}>
                  <td>{o.orderId}</td>
                  <td>{o.fullname}</td>
                  <td>{o.createdAt ? o.createdAt.slice(0, 10) : "—"}</td>
                  <td>{o.total.toLocaleString("vi-VN")} ₫</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`status-dropdown ${o.status?.toLowerCase()}`}
                      disabled={locked} // ✅ không cho đổi nếu hoàn thành/hủy
                    >
                      <option>Chờ xử lý</option>
                      <option>Đang giao</option>
                      <option>Hoàn thành</option>
                      <option>Đã hủy</option>
                    </select>
                  </td>
                  <td>
                    {o.paymentStatus === "Đã thanh toán" ? (
                      <span className="paid">Đã thanh toán</span>
                    ) : (
                      <span className="unpaid">Chưa thanh toán</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => setSelectedOrder(o)}>Xem</button>
                    {o.status === "Chờ xử lý" && (
                      <button
                        className="ship-btn"
                        onClick={() => handleCreateShipment(o.id)}
                      >
                        Tạo vận chuyển
                      </button>
                    )}
                    <button className="danger" onClick={() => handleDelete(o.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal chi tiết */}
      {selectedOrder && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h5>Chi tiết đơn hàng {selectedOrder.orderId}</h5>
            <p><strong>Khách hàng:</strong> {selectedOrder.fullname}</p>
            <p><strong>Email:</strong> {selectedOrder.email || "—"}</p>
            <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address}, {selectedOrder.commune}, {selectedOrder.province}</p>
            <p><strong>Ghi chú:</strong> {selectedOrder.note || "Không có"}</p>
            <p><strong>Ngày đặt:</strong> {selectedOrder.createdAt?.slice(0, 10)}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment}</p>
            <p><strong>Trạng thái thanh toán:</strong> {selectedOrder.paymentStatus}</p>
            <p><strong>Trạng thái đơn:</strong> {selectedOrder.status}</p>

            <h6>Danh sách sản phẩm:</h6>
            <ul>
              {selectedOrder.items?.map((p, i) => (
                <li key={i}>
                  {p.name} — {p.quantity} × {p.price.toLocaleString("vi-VN")}₫
                </li>
              ))}
            </ul>

            {selectedOrder.shipping && (
              <>
                <hr />
                <h6>Đơn vị vận chuyển:</h6>
                <p><strong>Đơn vị:</strong> {selectedOrder.shipping.carrier}</p>
                <p><strong>Mã vận đơn:</strong> {selectedOrder.shipping.trackingCode}</p>
                <p><strong>Trạng thái giao:</strong>
                  {selectedOrder.shipping.currentStatus === "picked_up"
                    ? " Đã lấy hàng"
                    : selectedOrder.shipping.currentStatus === "in_transit"
                    ? " Đang giao"
                    : selectedOrder.shipping.currentStatus === "delivered"
                    ? " Đã giao thành công"
                    : " — "}
                </p>
              </>
            )}

            <hr />
            <p><strong>Tổng tiền:</strong> {selectedOrder.total.toLocaleString("vi-VN")} ₫</p>

            <div className="modal-buttons">
              <button className="print-btn" onClick={() => printInvoice(selectedOrder)}>🖨 In hóa đơn</button>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;

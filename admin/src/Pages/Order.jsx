import React, { useState } from "react";
import "../Style/Order.css";
import { printInvoice } from "../Components/InvoicePrint";


const Order = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      code: "DH001",
      customer: "Nguyễn Văn A",
      date: "2025-10-22",
      total: 1250000,
      status: "Hoàn thành",
      paid: true,
      address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      note: "Giao buổi sáng",
      products: [
        { name: "Nồi cơm điện Sharp", qty: 1, price: 850000 },
        { name: "Bếp gas mini", qty: 1, price: 400000 },
      ],
      shipping: {
        carrier: "Giao Hàng Nhanh",
        trackingCode: "GHN123456789",
        currentStatus: "delivered",
      },
    },
    {
      id: 2,
      code: "DH002",
      customer: "Trần Thị B",
      date: "2025-10-21",
      total: 499000,
      status: "Đang giao",
      paid: false,
      address: "45 Nguyễn Trãi, Quận 5, TP.HCM",
      note: "Gọi trước khi giao",
      products: [{ name: "Bình đun siêu tốc", qty: 1, price: 499000 }],
      shipping: {
        carrier: "Giao Hàng Tiết Kiệm",
        trackingCode: "GHTK987654321",
        currentStatus: "in_transit",
      },
    },
    {
      id: 3,
      code: "DH003",
      customer: "Lê Văn C",
      date: "2025-10-23",
      total: 850000,
      status: "Chờ xử lý",
      paid: false,
      address: "78 Pasteur, Quận 1, TP.HCM",
      note: "",
      products: [{ name: "Máy sấy tóc Philips", qty: 2, price: 425000 }],
      shipping: null,
    },
  ]);

  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // ✅ Hàm tạo mã vận đơn ngẫu nhiên (giả lập)
  const generateTrackingCode = () => {
    const prefix = ["GHN", "GHTK", "VNPOST"];
    const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${randomPrefix}${randomNumber}`;
  };

  // ✅ Tạo vận chuyển (giả lập)
  const handleCreateShipment = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;

        const trackingCode = generateTrackingCode();

        return {
          ...o,
          status: "Đang giao",
          shipping: {
            carrier: trackingCode.startsWith("GHN")
              ? "Giao Hàng Nhanh"
              : trackingCode.startsWith("GHTK")
              ? "Giao Hàng Tiết Kiệm"
              : "VNPost",
            trackingCode,
            currentStatus: "picked_up",
          },
        };
      })
    );
    alert("✅ Đã tạo đơn vận chuyển và chuyển sang trạng thái 'Đang giao'");
  };

  // ✅ Cập nhật trạng thái đơn hàng (giả lập)
  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;

        let updatedPaid = o.paid;

        // ✅ Logic đồng bộ thanh toán
        if (newStatus === "Hoàn thành") updatedPaid = true;
        if (newStatus === "Đã hủy") updatedPaid = false;

        return { ...o, status: newStatus, paid: updatedPaid };
      })
    );
  };

  // ✅ Lọc
  const filteredOrders = orders
    .filter((o) => o.customer.toLowerCase().includes(filter.toLowerCase()))
    .filter((o) => (dateFilter ? o.date.startsWith(dateFilter) : true))
    .filter((o) =>
      statusFilter === "Tất cả trạng thái" ? true : o.status === statusFilter
    );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  return (
    <div className="order-container">
      <div className="order-header">
        <h4>Quản lý đơn hàng</h4>
        <div className="order-actions">
          <button className="btn-refresh">🔄 Làm mới</button>
          <button className="btn-add">➕ Thêm đơn hàng</button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="order-filter">
        <input
          type="text"
          placeholder="🔍 Tìm theo khách hàng..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>Tất cả trạng thái</option>
          <option>Chờ xử lý</option>
          <option>Đang giao</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
        </select>
      </div>

      {/* Bảng đơn hàng */}
      {filteredOrders.length === 0 ? (
        <p className="no-data">Không tìm thấy đơn hàng nào.</p>
      ) : (
        <>
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
              {currentOrders.map((o) => {
                const isLocked =
                  o.status === "Hoàn thành" || o.status === "Đã hủy";
                return (
                  <tr key={o.id}>
                    <td>{o.code}</td>
                    <td>{o.customer}</td>
                    <td>{o.date}</td>
                    <td>{o.total.toLocaleString()} ₫</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
                        className={`status-dropdown ${o.status.toLowerCase()}`}
                        disabled={isLocked}
                      >
                        <option>Chờ xử lý</option>
                        <option>Đang giao</option>
                        <option>Hoàn thành</option>
                        <option>Đã hủy</option>
                      </select>
                    </td>
                    <td>
                      {o.paid ? (
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
                          🚚 Tạo vận chuyển
                        </button>
                      )}

                      <button className="danger">Xóa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau →
            </button>
          </div>
        </>
      )}

      {/* Modal chi tiết */}
      {selectedOrder && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h5>🧾 Chi tiết đơn hàng {selectedOrder.code}</h5>
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.customer}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Ghi chú:</strong> {selectedOrder.note || "Không có"}
            </p>

            <h6>Danh sách sản phẩm:</h6>
            <ul>
              {selectedOrder.products.map((p, i) => (
                <li key={i}>
                  {p.name} — {p.qty} x {p.price.toLocaleString()} ₫
                </li>
              ))}
            </ul>

            <p>
              <strong>Tổng tiền:</strong>{" "}
              {selectedOrder.total.toLocaleString()} ₫
            </p>
            <p>
              <strong>Thanh toán:</strong>{" "}
              {selectedOrder.paid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
            </p>

            {/* ✅ Thông tin vận chuyển */}
            {selectedOrder.shipping && (
              <>
                <hr />
                <p>
                  <strong>Đơn vị vận chuyển:</strong>{" "}
                  {selectedOrder.shipping.carrier}
                </p>
                <p>
                  <strong>Mã vận đơn:</strong>{" "}
                  {selectedOrder.shipping.trackingCode}
                </p>
                <p>
                  <strong>Trạng thái giao:</strong>{" "}
                  {selectedOrder.shipping.currentStatus === "picked_up"
                    ? "📦 Đã lấy hàng"
                    : selectedOrder.shipping.currentStatus === "in_transit"
                    ? "🚚 Đang giao"
                    : selectedOrder.shipping.currentStatus === "delivered"
                    ? "✅ Đã giao thành công"
                    : "Chưa giao"}
                </p>
              </>
            )}

            <button
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>
            <button
              className="print-btn"
              onClick={() => printInvoice(selectedOrder)}
            >
               In hóa đơn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;

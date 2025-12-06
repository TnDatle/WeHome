import React, { useEffect, useState } from "react";
import "../Style/Dashboard.css";
import { db } from "../Config/firebase-config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    shipping: 0,
    newUsers: 0,
    products: 0,
    revenueToday: 0,
    revenueMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState([]);
  const [adminsOnline, setAdminsOnline] = useState([]);

  // ================== LẮNG NGHE ADMIN ONLINE REALTIME ==================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Users"), (snapshot) => {
      const allUsers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const admins = allUsers.filter((u) => u.role === "Admin");
      const onlineAdmins = admins.filter((a) => a.isOnline === true);
      setAdminsOnline(onlineAdmins);
    });

    return () => unsub();
  }, []);

  // ================== HỖ TRỢ CHUYỂN createdAt VỀ DATE ==================
  const toJsDate = (value) => {
    if (!value) return null;

    try {
      if (value.toDate) {
        // Firestore Timestamp
        return value.toDate();
      }
      if (value.seconds) {
        // Kiểu { seconds, nanoseconds }
        return new Date(value.seconds * 1000);
      }
      // String / number / ISO
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return d;
    } catch (e) {
      return null;
    }
  };

  // ================== LẤY DỮ LIỆU TỔNG QUAN ==================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ===== USERS =====
        const usersSnap = await getDocs(collection(db, "Users"));
        const allUsers = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const customers = allUsers.filter((u) => u.role === "User").length;

        // Người dùng mới trong 7 ngày
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers = allUsers.filter((u) => {
          if (!u.createdAt) return false;
          const date = toJsDate(u.createdAt);
          if (!date) return false;
          return date.getTime() >= sevenDaysAgo.getTime();
        }).length;

        // ===== PRODUCTS =====
        const productsSnap = await getDocs(collection(db, "Products"));
        const allProducts = productsSnap.docs.map((d) => d.data());
        const products = allProducts.length;

        // Gom nhóm sản phẩm theo danh mục (tính phần trăm)
        const categoryMap = {};
        allProducts.forEach((p) => {
          const cat = p.category || "Khác";
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const entries = Object.entries(categoryMap);
        const totalCount = allProducts.length || 1; // tránh chia 0
        const categoryPercent = entries.map(([cat, count]) => ({
          cat,
          count,
          percent: (count / totalCount) * 100,
        }));
        setCategoryStats(categoryPercent);

        // ===== ORDERS =====
        const ordersSnap = await getDocs(collection(db, "Orders"));
        const allOrders = ordersSnap.docs.map((d) => d.data());
        const orders = allOrders.length;
        const shipping = allOrders.filter(
          (o) => o.status === "Đang giao"
        ).length;

        // ===== DOANH THU DỰA TRÊN deliveredAt (KHÔNG PHỤ THUỘC TIMEZONE MÁY) =====
        let revenueToday = 0;
        let revenueMonth = 0;

        const now = new Date();

        // Mốc ngày / tháng theo UTC (dùng ISO key cho chắc chắn)
        const todayKey = now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
        const monthKey = todayKey.slice(0, 7);           // 'YYYY-MM'

        allOrders.forEach((o) => {
          // Chỉ lấy đơn "Hoàn thành"
          const status = o.status ? o.status.toString().trim().toLowerCase() : "";
          if (status !== "hoàn thành") return;

          // ✅ CHỈ CỘNG DOANH THU NẾU CÓ deliveredAt
          const rawDate = o.shipping?.deliveredAt || null;
          if (!rawDate) return; // không có deliveredAt thì bỏ qua đơn này

          const orderDate = toJsDate(rawDate);
          if (!orderDate) return;

          const iso = orderDate.toISOString();
          const orderDayKey = iso.slice(0, 10);  // 'YYYY-MM-DD'
          const orderMonthKey = iso.slice(0, 7); // 'YYYY-MM'

          // Convert total
          if (o.total === undefined || o.total === null) return;

          let total = 0;
          if (typeof o.total === "number") {
            total = o.total;
          } else {
            const onlyDigits = o.total.toString().replace(/[^\d]/g, "");
            total = parseInt(onlyDigits || "0", 10);
          }

          // Doanh thu HÔM NAY (nếu ngày giao == hôm nay theo UTC)
          if (orderDayKey === todayKey) {
            revenueToday += total;
          }

          // Doanh thu THÁNG NÀY (nếu tháng giao == tháng hiện tại theo UTC)
          if (orderMonthKey === monthKey) {
            revenueMonth += total;
          }
        });

        // ✅ Cập nhật state
        setStats({
          customers,
          orders,
          shipping,
          newUsers,
          products,
          revenueToday,
          revenueMonth,
        });
      } catch (err) {
        console.error("🔥 Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ================== LABEL NGÀY / THÁNG ĐỂ HIỂN THỊ TRÊN UI ==================
  const nowClient = new Date();
  const todayLabel = nowClient.toLocaleDateString("vi-VN"); // vd: 02/12/2025
  const monthLabel = `${nowClient.getMonth() + 1}/${nowClient.getFullYear()}`; // vd: 12/2025

  // ================== DANH SÁCH THẺ ==================
  const items = [
    { title: "Khách hàng", value: stats.customers, color: "red" },
    { title: "Đơn hàng", value: stats.orders, color: "orange" },
    { title: "Đang giao hàng", value: stats.shipping, color: "blue" },
    { title: "Người dùng mới (7 ngày)", value: stats.newUsers, color: "green" },
    { title: "Sản phẩm tồn kho", value: stats.products, color: "purple" },
    {
      title: `Doanh thu ngày ${todayLabel}`,
      value: stats.revenueToday.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      color: "gray",
    },
    {
      title: `Doanh thu tháng ${monthLabel}`,
      value: stats.revenueMonth.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      color: "orange",
    },
  ];

  // ================== TẠO BIỂU ĐỒ TRÒN ==================
  const getConicGradient = () => {
    if (categoryStats.length === 0) return "none";
    let gradient = "";
    let currentAngle = 0;

    const colors = ["#dc3545", "#fd7e14", "#0d6efd", "#198754", "#6f42c1"];

    categoryStats.forEach((c, i) => {
      const start = currentAngle;
      const end = currentAngle + (c.percent / 100) * 360;
      gradient += `${colors[i % colors.length]} ${start}deg ${end}deg, `;
      currentAngle = end;
    });

    return `conic-gradient(${gradient.slice(0, -2)})`;
  };

  return (
    <div className="dashboard-container">
      <h4 className="section-title">Tổng quan hệ thống</h4>

      {loading ? (
        <p className="no-data">Đang tải dữ liệu...</p>
      ) : (
        <div className="dashboard-stats">
          {items.map((item, i) => (
            <div key={i} className={`stat-card ${item.color}`}>
              <h6>{item.title}</h6>
              <h2>{item.value || 0}</h2>
              <p>Cập nhật gần đây</p>
            </div>
          ))}
        </div>
      )}

      {/* ================== BIỂU ĐỒ VÀ BẢNG ONLINE ================== */}
      <div className="dashboard-charts" style={{ marginTop: "50px" }}>
        {/* BIỂU ĐỒ TRÒN */}
        <div className="chart-card">
          <h6>Phân loại sản phẩm</h6>
          {categoryStats.length > 0 ? (
            <>
              <div
                className="chart-pie"
                style={{
                  background: getConicGradient(),
                }}
              ></div>

              <ul className="legend">
                {categoryStats.slice(0, 5).map((c, i) => (
                  <li key={i}>
                    <span
                      className="dot"
                      style={{
                        backgroundColor: [
                          "#dc3545",
                          "#fd7e14",
                          "#0d6efd",
                          "#198754",
                          "#6f42c1",
                        ][i % 5],
                      }}
                    ></span>
                    {c.cat}: {c.count} ({c.percent.toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="no-data">Chưa có dữ liệu sản phẩm</p>
          )}
        </div>

        {/* ADMIN ONLINE */}
        <div className="chart-card">
          <h6 style={{ marginBottom: "15px", fontSize: "1.05rem" }}>
            Quản trị viên đang online
          </h6>
          {adminsOnline.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
                marginTop: "8px",
              }}
            >
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: "8px 12px" }}>Tên</th>
                  <th style={{ padding: "8px 12px" }}>Email</th>
                  <th style={{ padding: "8px 12px", textAlign: "center" }}>
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminsOnline.map((a, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "6px 12px" }}>{a.fullname}</td>
                    <td style={{ padding: "6px 12px" }}>{a.email}</td>
                    <td
                      style={{
                        padding: "6px 12px",
                        color: "#198754",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      ● Online
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data" style={{ fontSize: "0.85rem" }}>
              Không có quản trị viên nào đang hoạt động
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import "../Style/Dashboard.css";

const Dashboard = () => {
  // 🧠 Danh sách thống kê — tạm thời chưa có data
  const stats = [
    { title: "Khách hàng", value: null, change: "", color: "red" },
    { title: "Đơn hàng", value: null, change: "", color: "orange" },
    { title: "Giao hàng", value: null, change: "", color: "blue" },
    { title: "Người dùng mới", value: null, change: "", color: "green" },
    { title: "Sản phẩm tồn kho", value: null, change: "", color: "purple" },
    { title: "Doanh thu hôm nay", value: null, change: "", color: "gray" },
  ];

  // 🧠 Biểu đồ — chưa có dữ liệu
  const trafficData = [];

  return (
    <div className="dashboard-container">
      <h4 className="section-title">📊 Tổng quan hệ thống</h4>

      {/* ----- GRID THỐNG KÊ ----- */}
      <div className="dashboard-stats">
        {stats.map((item, index) => (
          <div key={index} className={`stat-card ${item.color}`}>
            <h6>{item.title}</h6>
            <p className="no-data">Chưa có dữ liệu</p>
          </div>
        ))}
      </div>

      {/* ----- BIỂU ĐỒ ----- */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <h6>Danh mục sản phẩm</h6>
          <div className="empty-chart">
            <p>Chưa có dữ liệu</p>
          </div>
        </div>

        <div className="chart-card">
          <h6>Lượt truy cập sản phẩm</h6>
          {trafficData.length > 0 ? (
            <div className="chart-bars">
              {trafficData.map((v, i) => (
                <div key={i} className="bar" style={{ height: `${v}px` }}></div>
              ))}
            </div>
          ) : (
            <div className="empty-chart">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

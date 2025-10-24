import React, { useState } from "react";
import "../Style/User.css";

const User = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      phone: "0909000001",
      role: "Khách hàng",
      joined: "2025-08-15",
      status: "Hoạt động",
      address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranb@example.com",
      phone: "0909000002",
      role: "Khách hàng",
      joined: "2025-09-02",
      status: "Bị khóa",
      address: "45 Nguyễn Trãi, Quận 5, TP.HCM",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levc@wehome.vn",
      phone: "0909000003",
      role: "Quản trị viên",
      joined: "2025-05-21",
      status: "Hoạt động",
      address: "78 Pasteur, Quận 1, TP.HCM",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamd@gmail.com",
      phone: "0909000004",
      role: "Khách hàng",
      joined: "2025-10-01",
      status: "Hoạt động",
      address: "12 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    },
  ]);

  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Lọc danh sách
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filter.toLowerCase()) &&
      (roleFilter === "Tất cả" || u.role === roleFilter)
  );

  // ✅ Xóa người dùng
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // ✅ Khóa / Mở khóa
  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Hoạt động" ? "Bị khóa" : "Hoạt động",
            }
          : u
      )
    );
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h4>Quản lý người dùng</h4>
      </div>

      {/* Bộ lọc */}
      <div className="user-filter">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option>Tất cả</option>
          <option>Khách hàng</option>
          <option>Quản trị viên</option>
        </select>
      </div>

      {/* Bảng người dùng */}
      {filteredUsers.length === 0 ? (
        <p className="no-data">Không tìm thấy người dùng nào.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>
                  <span
                    className={`status ${
                      u.status === "Hoạt động" ? "active" : "blocked"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>{u.joined}</td>
                <td>
                  <button onClick={() => setSelectedUser(u)}>Xem</button>
                  <button onClick={() => toggleStatus(u.id)}>
                    {u.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                  </button>
                  <button className="danger" onClick={() => handleDelete(u.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal chi tiết */}
      {selectedUser && (
        <div className="user-modal">
          <div className="user-modal-content">
            <h5>Chi tiết người dùng</h5>
            <p>
              <strong>Họ tên:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Điện thoại:</strong> {selectedUser.phone}
            </p>
            <p>
              <strong>Vai trò:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedUser.address}
            </p>
            <p>
              <strong>Ngày tham gia:</strong> {selectedUser.joined}
            </p>
            <button
              className="close-btn"
              onClick={() => setSelectedUser(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

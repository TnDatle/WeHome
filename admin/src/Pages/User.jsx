import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../Config/firebase-config";
import "../Style/User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const roleMap = {
  "Khách hàng": ["khách hàng", "customer", "user"],
  "Quản trị viên": ["quản trị viên", "admin"],
};

  // ✅ Lấy danh sách người dùng từ Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Users"));
        const data = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setUsers(data);
      } catch (err) {
        console.error("🔥 Lỗi khi lấy danh sách người dùng:", err);
        setError("Không thể tải danh sách người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Lọc danh sách
  const filteredUsers = users.filter((u) => {
    const nameMatch = u.fullname?.toLowerCase().includes(filter.toLowerCase());
    const roleMatch =
      roleFilter === "Tất cả" ||
      (u.role &&
        roleMap[roleFilter]?.includes(u.role.toLowerCase()));
    return nameMatch && roleMatch;
  });

  // ✅ Xóa người dùng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      try {
        await deleteDoc(doc(db, "Users", id));
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert("Đã xóa người dùng!");
      } catch (err) {
        console.error("🔥 Lỗi khi xóa người dùng:", err);
        alert("Không thể xóa người dùng!");
      }
    }
  };

  // ✅ Khóa / Mở khóa người dùng
  const toggleStatus = async (user) => {
    const newStatus = user.status === "Hoạt động" ? "Bị khóa" : "Hoạt động";
    try {
      await updateDoc(doc(db, "Users", user.id), { status: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      console.error("🔥 Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái!");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-danger mt-5">{error}</p>;
  }

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
                <td>{u.fullname || u.name}</td>
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
                <td>
                  {u.createdAt
                    ? (u.createdAt.toDate
                        ? u.createdAt.toDate().toLocaleDateString("vi-VN")
                        : new Date(u.createdAt).toLocaleDateString("vi-VN"))
                    : "-"}
                </td>
                <td>
                  <button onClick={() => setSelectedUser(u)}>Xem</button>
                  <button onClick={() => toggleStatus(u)}>
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

      {/* Modal chi tiết người dùng */}
      {selectedUser && (
        <div className="user-modal">
          <div className="user-modal-content">
            <h5>Chi tiết người dùng</h5>
            <p>
              <strong>Họ tên:</strong> {selectedUser.fullname || selectedUser.name}
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
              <strong>Trạng thái:</strong>{" "}
              <span
                style={{
                  color:
                    selectedUser.status === "Hoạt động" ? "#28a745" : "#999",
                  fontWeight: 600,
                }}
              >
                {selectedUser.status}
              </span>
            </p>
            <hr />
            <p>
              <strong>Địa chỉ:</strong> {selectedUser.address || "—"}
            </p>
            <p>
              <strong>Phường/Xã:</strong> {selectedUser.commune || "—"}
            </p>
            <p>
              <strong>Tỉnh/Thành phố:</strong> {selectedUser.province || "—"}
            </p>
            <hr />
            <p>
              <strong>Ngày tham gia:</strong>{" "}
              {selectedUser.createdAt
                ? (selectedUser.createdAt.toDate
                    ? selectedUser.createdAt.toDate().toLocaleDateString("vi-VN")
                    : new Date(selectedUser.createdAt).toLocaleDateString("vi-VN"))
                : "—"}
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

import React, { useState, useEffect, useRef } from "react";
import "../Style/Header.css";
import { useAdmin } from "../context/AdminContext";
import { db } from "../Config/firebase-config";
import {
  doc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  //  Tự đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (menuRef.current && !menuRef.current.contains(e.target)) &&
        (notifRef.current && !notifRef.current.contains(e.target))
      ) {
        setMenuOpen(false);
        setShowNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lắng nghe đơn hàng mới (realtime)
  useEffect(() => {
    //  Query an toàn: không orderBy nếu createdAt không phải Timestamp
    const q = query(collection(db, "Orders"), where("status", "==", "Chờ xử lý"));

    const unsub = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      console.log("Realtime Orders:", allOrders);

      // Sắp xếp thủ công theo ngày tạo (dù là string hay timestamp)
      const sorted = allOrders.sort((a, b) => {
        const timeA = a.createdAt?.seconds
          ? a.createdAt.seconds * 1000
          : new Date(a.createdAt).getTime();
        const timeB = b.createdAt?.seconds
          ? b.createdAt.seconds * 1000
          : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      setNotifications(sorted.slice(0, 5)); // chỉ hiển thị 5 đơn mới nhất
    });

    return () => unsub();
  }, []);

  // Logout
  const handleLogout = async () => {
    if (admin?.uid) {
      await updateDoc(doc(db, "Users", admin.uid), { isOnline: false });
    }
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="admin-header">
        {/* LEFT */}
        <div className="header-left">
          <h3 className="logo">
            WeHome <span>Admin</span>
          </h3>

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-box"
              placeholder="Tìm kiếm sản phẩm, đơn hàng..."
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="header-right">
          {/* 🔔 Nút thông báo */}
          <div
            className="notif-btn-wrapper"
            ref={notifRef}
            onClick={() => setShowNoti((prev) => !prev)}
          >
            <button className="notif-btn" title="Thông báo">
              🔔
              {notifications.length > 0 && (
                <span className="notif-badge">{notifications.length}</span>
              )}
            </button>

            {/* Danh sách thông báo */}
            {showNoti && (
              <div className="notif-dropdown">
                <h6>Đơn hàng mới</h6>
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((o) => (
                      <li
                        key={o.id}
                        onClick={() => navigate(`/orders/${o.id}`)}
                      >
                         <strong>{o.fullname || "Khách hàng"}</strong> vừa đặt đơn{" "}
                        <span>
                          {o.total
                            ? Number(o.total).toLocaleString("vi-VN") + "₫"
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-noti">Không có đơn hàng mới</p>
                )}
              </div>
            )}
          </div>

          {/* 👤 Menu admin */}
          <div
            className="admin-profile"
            ref={menuRef}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="admin-text">
              <span className="admin-name">{admin?.fullname || "Admin"}</span>
              <small className="admin-role">Quản trị viên</small>
            </div>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => setShowConfirm(true)}>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h4>Đăng xuất tài khoản</h4>
            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>
            <div className="modal-actions">
              <button className="yes-btn" onClick={handleLogout}>
                Có
              </button>
              <button className="no-btn" onClick={() => setShowConfirm(false)}>
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

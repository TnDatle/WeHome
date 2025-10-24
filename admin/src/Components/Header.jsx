import React from "react";
import "../Style/Header.css";

const Header = () => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h3 className="logo">WeHome <span>Admin</span></h3>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input type="text" className="search-box" placeholder="Tìm kiếm..." />
        </div>
      </div>

      <div className="header-right">
        <button className="notif-btn" title="Thông báo">🔔</button>

        <div className="admin-profile">
          <img
            src="https://i.imgur.com/0y0y0y0.png"
            alt="Admin"
            className="avatar"
          />
          <div className="admin-text">
            <span className="admin-name">Admin</span>
            <small className="admin-role">Quản trị viên</small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

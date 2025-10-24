import React from "react";
import { NavLink } from "react-router-dom";
import "../Style/Category.css";

const Category = () => {
  const menu = [
    { icon: "🏠", label: "Dashboard", path: "/" },
    { icon: "🛍️", label: "Sản phẩm", path: "/products" },
    { icon: "📦", label: "Đơn hàng", path: "/orders" },
    { icon: "👥", label: "Người dùng", path: "/users" },
    { icon: "⚙️", label: "Cài đặt", path: "/settings" },
  ];

  return (
    <aside className="category">
      <h5 className="category-title">Danh mục</h5>
      <ul className="menu-list">
        {menu.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Category;

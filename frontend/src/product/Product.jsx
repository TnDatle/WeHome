// 📁 src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../style/Product.css";

export default function Products() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Thiết bị nhà bếp", icon: "🍳", slug: "kitchen" },
    { name: "Máy lọc không khí", icon: "🌬️", slug: "air-purifier" },
    { name: "Đèn & chiếu sáng", icon: "💡", slug: "lighting" },
    { name: "Dụng cụ vệ sinh", icon: "🧹", slug: "cleaning" },
    { name: "Đồ dùng phòng tắm", icon: "🛁", slug: "bathroom" },
    { name: "Đồ điện gia dụng nhỏ", icon: "🔌", slug: "small-appliances" },
    { name: "Chăm sóc cá nhân", icon: "💆", slug: "personal-care" },
    { name: "Thiết bị giặt sấy", icon: "🧺", slug: "laundry" },
    { name: "Gia dụng thông minh", icon: "🏠", slug: "smart-home" },
    { name: "Nội thất & trang trí", icon: "🪑", slug: "furniture" },
  ];

  // 🗺️ Map giữa category tiếng Việt và slug
  const slugMap = {
    "Thiết bị nhà bếp": "kitchen",
    "Máy lọc không khí": "air-purifier",
    "Đèn & chiếu sáng": "lighting",
    "Dụng cụ vệ sinh": "cleaning",
    "Đồ dùng phòng tắm": "bathroom",
    "Đồ điện gia dụng nhỏ": "small-appliances",
    "Chăm sóc cá nhân": "personal-care",
    "Thiết bị giặt sấy": "laundry",
    "Gia dụng thông minh": "smart-home",
    "Nội thất & trang trí": "furniture",
  };

  const currentCategory =
    categories.find((c) => c.slug === slug)?.name || "Danh mục sản phẩm";

  // 🟢 Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = res.data;

        // Nếu có slug thì lọc theo map
        const filtered = slug
          ? allProducts.filter((p) => slugMap[p.category] === slug)
          : allProducts;

        setProducts(filtered);
      } catch (err) {
        console.error("🔥 Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  return (
    <div className="product-page container py-3">
      <Helmet>
        <title>{currentCategory} - WeHome</title>
      </Helmet>

      <div className="row">
        {/* ==== SIDEBAR ==== */}
        <div className="col-md-3 col-lg-2 mb-4 mb-md-0">
          <div className="category-sidebar p-3">
            <h6 className="fw-bold text-uppercase mb-3">Danh mục sản phẩm</h6>
            <ul className="list-unstyled m-0">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`category-link ${
                      slug === cat.slug ? "active" : ""
                    }`}
                  >
                    <span className="me-2">{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="col-md-9 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-danger text-uppercase mb-0">
              {currentCategory}
            </h5>
          </div>

          {loading ? (
            <p className="text-center text-muted py-5">Đang tải sản phẩm...</p>
          ) : products.length > 0 ? (
            <div className="category-grid">
              {products.map((p) => (
                <Link
                  key={p._id || p.id}
                  to={`/product/${p._id || p.id}`}
                  className="product-card-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="product-card">
                    <div className="product-img-wrapper">
                      <img
                        src={p.images?.[0] || "/images/no-image.png"}
                        alt={p.name}
                        onError={(e) => (e.target.src = "/images/no-image.png")}
                      />
                    </div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <p className="product-price text-danger fw-bold">
                        {p.price?.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-5">
              Không có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

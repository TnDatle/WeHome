import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "../style/Product.css";

export default function Products() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);

  // Danh mục chính
  const categories = [
    { id: 1, name: "Thiết bị nhà bếp", icon: "🍳", slug: "kitchen" },
    { id: 2, name: "Máy lọc không khí", icon: "🌬️", slug: "air-purifier" },
    { id: 3, name: "Đèn & chiếu sáng", icon: "💡", slug: "lighting" },
    { id: 4, name: "Dụng cụ vệ sinh", icon: "🧹", slug: "cleaning" },
    { id: 5, name: "Đồ dùng phòng tắm", icon: "🛁", slug: "bathroom" },
    { id: 6, name: "Đồ điện gia dụng nhỏ", icon: "🔌", slug: "small-appliances" },
    { id: 7, name: "Chăm sóc cá nhân", icon: "💆", slug: "personal-care" },
    { id: 8, name: "Thiết bị giặt sấy", icon: "🧺", slug: "laundry" },
    { id: 9, name: "Gia dụng thông minh", icon: "🏠", slug: "smart-home" },
    { id: 10, name: "Nội thất & trang trí", icon: "🪑", slug: "furniture" },
  ];

  // Mock data (FE-only)
  const mockData = [
    {
      id: 1,
      name: "Combo 12 viên vệ sinh lồng máy giặt, diệt khuẩn tiện lợi",
      price: 99000,
      rating: 4.5,
      reviews: 7,
      image: "/images/maygiat.jpg",
      category: "cleaning",
    },
    {
      id: 2,
      name: "Túi đựng quần áo, chăn ga, đồ dùng cỡ lớn có thể gấp gọn",
      price: 89000,
      rating: 4.6,
      reviews: 7,
      image: "/images/tuigap.jpg",
      category: "furniture",
    },
    {
      id: 3,
      name: "Bộ chuyển đổi máy mài thành máy cưa xích tiện dụng",
      price: 278000,
      rating: 4.9,
      reviews: 8,
      image: "/images/maycua.jpg",
      category: "small-appliances",
    },
    {
      id: 4,
      name: "Bình giữ nhiệt lọc trà thông minh dung tích 520ml",
      price: 168000,
      rating: 4.8,
      reviews: 7,
      image: "/images/binhgiu.jpg",
      category: "kitchen",
    },
    {
      id: 5,
      name: "Dụng cụ thông tắc bồn cầu, bồn rửa thế hệ mới",
      price: 303000,
      rating: 4.3,
      reviews: 6,
      image: "/images/thongtac.jpg",
      category: "cleaning",
    },
    {
      id: 6,
      name: "Dụng cụ mồi lửa bếp gas bằng tia điện cầm tay",
      price: 119000,
      rating: 4.4,
      reviews: 6,
      image: "/images/moi-lua.jpg",
      category: "kitchen",
    },
  ];

  useEffect(() => {
    const filtered = mockData.filter((p) => p.category === slug);
    setProducts(filtered);
  }, [slug]);

  const currentCategory =
    categories.find((c) => c.slug === slug)?.name || "Danh mục sản phẩm";

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
                    className={`category-link ${slug === cat.slug ? "active" : ""}`}
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

            <select className="form-select form-select-sm w-auto sort-select">
              <option>Mặc định</option>
              <option>Giá thấp → cao</option>
              <option>Giá cao → thấp</option>
            </select>
          </div>

          <div className="category-grid">
            {products.length > 0 ? (
              products.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`} // ✅ dẫn đến trang chi tiết
                  className="product-card-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="product-card">
                    <div className="product-img-wrapper">
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <div className="product-rating">
                        {"⭐".repeat(Math.round(p.rating))}
                        <span className="text-muted small">
                          ({p.reviews} đánh giá)
                        </span>
                      </div>
                      <p className="product-price">
                        {p.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                </Link>
              ))
              ) : (
                <p className="text-center text-muted py-5">
                  Không có sản phẩm nào trong danh mục này.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

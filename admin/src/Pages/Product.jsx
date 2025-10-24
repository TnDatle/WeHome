import React, { useState } from "react";
import "../Style/Product.css";
import AddProduct from "../Components/AddProduct";

const Product = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Nồi chiên không dầu Lock&Lock 5.5L",
      category: "Thiết bị nhà bếp",
      price: 1790000,
      stock: 10,
      image: "/images/noichien.jpg",
      description:
        "Dung tích 5.5L, công nghệ Rapid Air giảm dầu tới 85%, dễ vệ sinh.",
    },
    {
      id: 2,
      name: "Máy lọc không khí Sharp FP-J40E-W",
      category: "Máy lọc không khí",
      price: 2990000,
      stock: 8,
      image: "/images/mayloc.jpg",
      description:
        "Phù hợp phòng 30m², công nghệ Plasmacluster Ion khử mùi, lọc bụi PM2.5.",
    },
    {
      id: 3,
      name: "Đèn bàn học chống cận Rạng Đông RD-RL-38",
      category: "Đèn & chiếu sáng",
      price: 350000,
      stock: 25,
      image: "/images/denban.jpg",
      description: "Đèn LED ánh sáng trung tính, bảo vệ thị lực, cổ linh hoạt.",
    },
    {
      id: 4,
      name: "Cây lau nhà 360 độ Lock&Lock",
      category: "Dụng cụ vệ sinh",
      price: 490000,
      stock: 15,
      image: "/images/caulaunha.jpg",
      description:
        "Thiết kế xoay 360°, vắt nước nhanh, đầu lau microfiber siêu thấm.",
    },
    {
      id: 5,
      name: "Vòi sen tăng áp Luva VS3",
      category: "Đồ dùng phòng tắm",
      price: 189000,
      stock: 30,
      image: "/images/voisen.jpg",
      description: "Tăng áp 200%, tiết kiệm nước, 3 chế độ phun mạnh nhẹ.",
    },
    {
      id: 6,
      name: "Bàn ủi hơi nước Philips GC1740",
      category: "Đồ điện gia dụng nhỏ",
      price: 790000,
      stock: 18,
      image: "/images/banui.jpg",
      description: "Công suất 2000W, phun hơi 25g/phút, chống dính Teflon.",
    },
    {
      id: 7,
      name: "Máy sấy tóc Panasonic EH-ND21",
      category: "Chăm sóc cá nhân",
      price: 420000,
      stock: 22,
      image: "/images/maysaytoc.jpg",
      description: "Công suất 1200W, 3 tốc độ sấy, gấp gọn tiện mang đi.",
    },
    {
      id: 8,
      name: "Máy giặt Samsung Inverter 8.5kg",
      category: "Thiết bị giặt sấy",
      price: 6490000,
      stock: 5,
      image: "/images/maygiat.jpg",
      description:
        "Công nghệ Inverter tiết kiệm điện, giặt nhanh 15 phút, lồng đứng.",
    },
    {
      id: 9,
      name: "Robot hút bụi Ecovacs DEEBOT N8 Pro",
      category: "Gia dụng thông minh",
      price: 8490000,
      stock: 7,
      image: "/images/robot.jpg",
      description: "Hút mạnh 2300Pa, tự động đổ rác, bản đồ 3D thông minh.",
    },
    {
      id: 10,
      name: "Đèn trang trí phòng khách Nordic Style",
      category: "Nội thất & trang trí",
      price: 1290000,
      stock: 12,
      image: "/images/dentrangtri.jpg",
      description:
        "Thiết kế Bắc Âu hiện đại, ánh sáng vàng ấm, khung kim loại sơn tĩnh điện.",
    },
  ]);

  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");

  // ✅ Lọc sản phẩm
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) &&
      (categoryFilter === "Tất cả" || p.category === categoryFilter)
  );

  // ✅ Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // ✅ Lưu sản phẩm (thêm / sửa)
  const handleSaveProduct = (newData) => {
    if (editingProduct) {
      // cập nhật
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...newData, id: p.id } : p))
      );
    } else {
      // thêm mới
      const newId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;
      setProducts([...products, { ...newData, id: newId }]);
    }
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h4>Quản lý sản phẩm</h4>
        <div className="product-actions">
          <button
            className="btn-add"
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="product-filter">
        <input
          type="text"
          placeholder="🔍 Tìm sản phẩm..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>Tất cả</option>
          <option>Thiết bị nhà bếp</option>
          <option>Máy lọc không khí</option>
          <option>Đèn & chiếu sáng</option>
          <option>Dụng cụ vệ sinh</option>
          <option>Đồ dùng phòng tắm</option>
          <option>Đồ điện gia dụng nhỏ</option>
          <option>Chăm sóc cá nhân</option>
          <option>Thiết bị giặt sấy</option>
          <option>Gia dụng thông minh</option>
          <option>Nội thất & trang trí</option>
        </select>
      </div>

      {/* Bảng sản phẩm */}
      {filteredProducts.length === 0 ? (
        <p className="no-data">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} className="product-img" />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price.toLocaleString()} ₫</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => setSelectedProduct(p)}>👁 Xem</button>
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setShowAddModal(true);
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button className="danger" onClick={() => handleDelete(p.id)}>
                    🗑 Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal chi tiết */}
      {selectedProduct && (
        <div className="product-modal">
          <div className="product-modal-content">
            <h5>Chi tiết sản phẩm</h5>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="product-modal-img"
            />
            <p>
              <strong>Tên:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Danh mục:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              {selectedProduct.price.toLocaleString()} ₫
            </p>
            <p>
              <strong>Tồn kho:</strong> {selectedProduct.stock}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedProduct.description}
            </p>
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal Thêm / Sửa */}
      {showAddModal && (
        <AddProduct
          onSave={handleSaveProduct}
          onClose={() => setShowAddModal(false)}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default Product;

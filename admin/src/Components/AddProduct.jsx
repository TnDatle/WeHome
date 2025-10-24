import React, { useState, useEffect } from "react";
import "../Style/AddProduct.css";

const AddProduct = ({ onSave, onClose, product }) => {
  const isEdit = !!product; // true nếu đang sửa

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  // 🔹 Nếu đang sửa, load dữ liệu cũ vào form
  useEffect(() => {
    if (product) setFormData(product);
  }, [product]);

  const categories = [
    "Thiết bị nhà bếp",
    "Máy lọc không khí",
    "Đèn & chiếu sáng",
    "Dụng cụ vệ sinh",
    "Đồ dùng phòng tắm",
    "Đồ điện gia dụng nhỏ",
    "Chăm sóc cá nhân",
    "Thiết bị giặt sấy",
    "Gia dụng thông minh",
    "Nội thất & trang trí",
  ];

  // ✅ Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setFormData({ ...formData, image: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="add-product-modal">
      <div className="add-product-content">
        <h4>{isEdit ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h4>

        <form onSubmit={handleSubmit}>
          <label>Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm..."
          />

          <label>Danh mục</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Giá (₫)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Nhập giá sản phẩm"
          />

          <label>Tồn kho</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Số lượng tồn"
          />

          <label>Mô tả</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả ngắn..."
          />

          <label>Ảnh sản phẩm</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />

          {formData.image && (
            <img src={formData.image} alt="preview" className="preview-img" />
          )}

          <div className="btn-group">
            <button type="submit" className="btn-save">
              💾 {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

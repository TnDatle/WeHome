import React, { useState, useEffect } from "react";
import "../Style/AddProduct.css";

const AddProduct = ({ onSave, onClose, product }) => {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    category: "",
    price: "",
    description: "",
    images: [], // mix: URL string hoặc { file }
  });

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.id || "",
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        description: product.description || "",
        images: product.images || [],
      });
      const previewArray = (product.images || []).map((img) =>
        typeof img === "string" ? img : URL.createObjectURL(img.file)
      );
      setPreviews(previewArray);
    } else {
      setFormData({
        productId: "",
        name: "",
        category: "",
        price: "",
        description: "",
        images: [],
      });
      setPreviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const newFiles = Array.from(files).map((f) => ({ file: f }));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images.filter((i) => typeof i === "string"), ...newFiles],
      }));
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f.file));
      setPreviews((prev) => [...prev.filter((p) => typeof p === "string"), ...newPreviews]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, category, price } = formData;
    if (!name || !category || !price) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    // Trả về object (images giữ nguyên: URL hoặc {file})
    if (onSave) onSave(formData);
    if (onClose) onClose();
  };

  return (
    <div className="add-product-modal">
      <div className="add-product-content">
        <h4>{isEdit ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h4>
        <form onSubmit={handleSubmit}>
          <label>Tên sản phẩm</label>
          <input name="name" value={formData.name} onChange={handleChange} />

          <label>Danh mục</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label>Giá (₫)</label>
          <input name="price" type="number" value={formData.price} onChange={handleChange} />

          <label>Mô tả</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleChange} />

          <label>Ảnh</label>
          <input type="file" name="images" accept="image/*" multiple onChange={handleChange} />

          {previews.length > 0 && (
            <div className="preview-list">
              {previews.map((p, i) => p ? <img key={i} src={p} alt="preview" className="preview-img" /> : null)}
            </div>
          )}

          <div className="btn-group">
            <button type="submit" className="btn-save">💾 {isEdit ? "Cập nhật" : "Thêm mới"}</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

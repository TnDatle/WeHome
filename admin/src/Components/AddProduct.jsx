import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../Style/AddProduct.css";

const AddProduct = ({ onSave, onClose, product }) => {
  const isEdit = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    description: "",
    color: "",
    material: "",
    size: "",
    images: [],
  });

  // Khi chỉnh sửa hoặc thêm mới
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        id: product.id || "",
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        description: product.description || "",
        color: product.color || "",
        material: product.material || "",
        size: product.size || "",
        images: product.images || [],
      });
    } else {
      setFormData({
        id: "",
        name: "",
        category: "",
        price: "",
        description: "",
        color: "",
        material: "",
        size: "",
        images: [],
      });
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({ ...prev, images: fileData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await onSave?.(formData);
      toast.success(isEdit ? " Cập nhật sản phẩm thành công" : " Thêm sản phẩm thành công");
      setTimeout(() => onClose?.(), 500);
    } catch (error) {
      toast.error(" Lưu thất bại, vui lòng thử lại");
      console.error(" Lỗi khi lưu sản phẩm:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <h2>{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit}>
           <div className="form-left">
          {/* Firestore ID */}
          <label>Mã sản phẩm (ID Firestore)</label>
          <input
            type="text"
            name="id"
            value={formData.id || "Sẽ được tạo sau khi lưu"}
            readOnly
            className="readonly-input"
          />

          {/* Tên sản phẩm */}
          <label>Tên sản phẩm</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          {/* Danh mục */}
          <label>Danh mục</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Giá */}
          <label>Giá (VNĐ)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />

          {/* 🔹 Màu sắc */}
          <label>Màu sắc</label>
          <input
            type="text"
            name="color"
            placeholder="VD: Trắng, Đen, Xám..."
            value={formData.color}
            onChange={handleChange}
          />

          {/* 🔹 Chất liệu */}
          <label>Chất liệu</label>
          <input
            type="text"
            name="material"
            placeholder="VD: Inox, Nhựa ABS, Gỗ, ..."
            value={formData.material}
            onChange={handleChange}
          />

          {/* 🔹 Kích thước */}
          <label>Kích thước</label>
          <input
            type="text"
            name="size"
            placeholder="VD: 30x40cm, 15x20x10cm..."
            value={formData.size}
            onChange={handleChange}
          />
        </div>

          <div className="form-right">
          {/* Mô tả */}
          <label>Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />

          {/* Hình ảnh */}
          <label>Hình ảnh</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className="preview-images">
            {(formData.images || []).map((img, index) => {
              const src = typeof img === "string" ? img : img.preview;
              return <img key={index} src={src} alt={`preview-${index}`} />;
            })}
          </div>

          {/* Nút */}
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Đang xử lý..."
                : isEdit
                ? "Cập nhật"
                : "Thêm sản phẩm"}
            </button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

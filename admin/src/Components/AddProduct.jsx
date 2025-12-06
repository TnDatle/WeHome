import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../Style/AddProduct.css";

const AddProduct = ({ onClose, product, onSave }) => {
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
    images: [],       // string URL hoặc {file, preview}
    available: true,
  });

  // Khi chỉnh sửa hoặc thêm mới
  useEffect(() => {
    if (isEdit && product) {
      const availableValue =
        product.available === undefined
          ? true
          : product.available === true ||
            product.available === "true" ||
            product.available === 1;

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
        available: availableValue,
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
        available: true,
      });
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const fileData = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // giữ URL cũ + thêm ảnh mới
    setFormData((prev) => ({
      ...prev,
      images: [
        ...(prev.images || []).filter((img) => typeof img === "string"),
        ...fileData,
      ],
    }));
  };

  const handleToggleAvailable = () => {
    setFormData((prev) => ({ ...prev, available: !prev.available }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
      };

      console.log(" Submit AddProduct payload:", payload);

      if (onSave) {
        await onSave(payload); 
      }

      onClose?.();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm (AddProduct):", error);
      toast.error("Lưu thất bại, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <h2>{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit}>
          {/* ========== CỘT TRÁI ========== */}
          <div className="form-left">
            <label>Mã sản phẩm (ID Firestore)</label>
            <input
              type="text"
              name="id"
              value={formData.id || "Sẽ được tạo sau khi lưu"}
              readOnly
              className="readonly-input"
            />

            <label>Tên sản phẩm</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label>Giá (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />

            <label>Màu sắc</label>
            <input
              type="text"
              name="color"
              placeholder="VD: Trắng, Đen, Xám..."
              value={formData.color}
              onChange={handleChange}
            />

            <label>Chất liệu</label>
            <input
              type="text"
              name="material"
              placeholder="VD: Inox, Nhựa ABS, Gỗ..."
              value={formData.material}
              onChange={handleChange}
            />

            <label>Kích thước</label>
            <input
              type="text"
              name="size"
              placeholder="VD: 30x40cm..."
              value={formData.size}
              onChange={handleChange}
            />

            {/* Toggle Switch */}
            <label>Tình trạng sản phẩm</label>
            <div className="toggle-available">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={!!formData.available}
                  onChange={handleToggleAvailable}
                />
                <span className="slider"></span>
              </label>
              <span
                className="toggle-label-text"
                style={{ color: formData.available ? "#28a745" : "#dc3545" }}
              >
                {formData.available ? "Còn hàng " : "Hết hàng "}
              </span>
            </div>
          </div>

          {/* ========== CỘT PHẢI ========== */}
          <div className="form-right">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <label>Hình ảnh</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="preview-images">
              {(formData.images || []).map((img, index) => {
                const src = typeof img === "string" ? img : img.preview;
                return <img key={index} src={src} alt={`preview-${index}`} />;
              })}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang xử lý..."
                  : isEdit
                  ? "Cập nhật"
                  : "Thêm sản phẩm"}
              </button>
              <button type="button" onClick={onClose}>
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

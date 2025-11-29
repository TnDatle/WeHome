import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../Config/firebase-config";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import "../Style/AddProduct.css";

const AddProduct = ({ onClose, product }) => {
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
    available: true, // mặc định còn hàng
  });

  // Khi chỉnh sửa hoặc thêm mới
  useEffect(() => {
    if (isEdit && product) {
      const availableValue =
        product.available === undefined
          ? true // nếu chưa có field, coi như còn hàng
          : product.available === true ||
            product.available === "true" ||
            product.available === 1
          ? true
          : false;

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
        available: availableValue, // luôn boolean thật
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
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({ ...prev, images: fileData }));
  };

  const handleToggleAvailable = () => {
    setFormData((prev) => ({ ...prev, available: !prev.available }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (isEdit && formData.id) {
        // ✅ Cập nhật sản phẩm
        const ref = doc(db, "Products", formData.id);
        await setDoc(ref, formData, { merge: true });
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        //  Thêm sản phẩm mới
        await addDoc(collection(db, "Products"), formData);
        toast.success("Thêm sản phẩm thành công");
      }
      setTimeout(() => onClose?.(), 600);
    } catch (error) {
      toast.error("Lưu thất bại, vui lòng thử lại");
      console.error("Lỗi khi lưu sản phẩm:", error);
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
                  checked={!!formData.available} // ép về boolean
                  onChange={handleToggleAvailable}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label-text" style={{ color: formData.available ? "#28a745" : "#dc3545" }}>
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
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
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

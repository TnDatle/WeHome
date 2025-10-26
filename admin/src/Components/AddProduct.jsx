import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/AddProduct.css";

const AddProduct = ({ onSave, onClose, product }) => {
  const isEdit = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ tránh double submit

  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    category: "",
    price: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        productId: product.productId || "",
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        description: product.description || "",
        images: product.images || [],
      });
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, images: imageUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // ✅ ngăn double click
    setIsSubmitting(true);

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/products/${product._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/products", formData);
      }

      onSave?.(); // ✅ callback cập nhật danh sách 1 lần
      onClose?.();
    } catch (error) {
      console.error("❌ Lỗi khi lưu sản phẩm:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <h2>{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Mã sản phẩm</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          />

          <label>Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Danh mục</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <label>Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

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
            {formData.images.map((img, index) =>
              img ? (
                <img key={index} src={img} alt={`preview-${index}`} />
              ) : null
            )}
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
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

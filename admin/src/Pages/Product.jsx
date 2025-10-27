import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/Product.css";
import AddProduct from "../Components/AddProduct";

const Product = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/product");
      const formatted = res.data.map((p) => ({
        id: p.id,
        name: p.name || "",
        category: p.category || "",
        price: p.price || 0,
        stock: p.stock || 0,
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        description: p.description || "",
        images: p.images || [],
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("Lỗi load products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.name?.toLowerCase().includes(filter.toLowerCase()) &&
           (categoryFilter === "Tất cả" || p.category === categoryFilter)
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/product/${id}`);
      setProducts((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Xóa thất bại");
    }
  };

  // IMPORTANT: Product.jsx là nơi duy nhất gọi API
  const handleSaveProduct = async (formObj) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formObj.name);
      fd.append("category", formObj.category);
      fd.append("price", Number(formObj.price));
      fd.append("description", formObj.description);

      // ảnh mới: file objects
      (formObj.images || []).forEach((img) => {
        if (typeof img === "object" && img.file) fd.append("images", img.file);
      });

      // ảnh cũ: string URLs
      const existing = (formObj.images || []).filter((img) => typeof img === "string");
      fd.append("existingImages", JSON.stringify(existing));

      // Decide POST or PUT
      if (formObj.productId) {
        await axios.put(`http://localhost:5000/product/${formObj.productId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/product", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchProducts();
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Lỗi lưu:", err);
      alert("Lưu thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h4>Quản lý sản phẩm</h4>
        <div className="product-actions">
          <button onClick={() => { setEditingProduct(null); setShowAddModal(true); }}>➕ Thêm sản phẩm</button>
        </div>
      </div>

      <div className="product-filter">
        <input placeholder="🔍 Tìm sản phẩm..." value={filter} onChange={(e)=>setFilter(e.target.value)} />
        <select value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)}>
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

      {filteredProducts.length === 0 ? <p className="no-data">Không tìm thấy sản phẩm nào.</p> : (
        <table className="product-table">
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.image ? <img src={p.image} alt={p.name} className="product-img" /> : <div className="no-img">Không có ảnh</div>}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price?.toLocaleString()} ₫</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={()=>{ setSelectedProduct(p); }}>👁 Xem</button>
                  <button onClick={()=>{ setEditingProduct(p); setShowAddModal(true); }}>✏️ Sửa</button>
                  <button className="danger" onClick={()=>handleDelete(p.id)}>🗑 Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
  <div
    className="addproduct-backdrop"
    onClick={() => setShowAddModal(false)} // click nền ngoài để tắt
  >
    <div
      className="addproduct-wrapper"
      onClick={(e) => e.stopPropagation()} // chặn click bên trong
    >
      <AddProduct
        onSave={handleSaveProduct}
        onClose={() => setShowAddModal(false)}
        product={editingProduct}
      />
    </div>
  </div>
)}


      {selectedProduct && (
        <div className="product-modal">
          <div className="product-modal-content">
            <h5>Chi tiết sản phẩm</h5>
            {selectedProduct.image ? <img src={selectedProduct.image} alt={selectedProduct.name} className="product-modal-img" /> : <div className="no-img">Không có ảnh</div>}
            <p><strong>Tên:</strong> {selectedProduct.name}</p>
            <p><strong>Danh mục:</strong> {selectedProduct.category}</p>
            <p><strong>Giá:</strong> {selectedProduct.price?.toLocaleString()} ₫</p>
            <p><strong>Tồn kho:</strong> {selectedProduct.stock}</p>
            <p><strong>Mô tả:</strong> {selectedProduct.description}</p>
            <button className="close-btn" onClick={()=>setSelectedProduct(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../Style/Product.css";
import AddProduct from "../Components/AddProduct";

const Product = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = "http://localhost:5000/api/products";

  // Lấy danh sách sản phẩm
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
  try {
    const res = await axios.get(API_BASE);
    console.log(" Response data:", res.data);
    setProducts(
      Array.isArray(res.data)
        ? res.data.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            description: p.description,
            images: p.images || [],
          }))
        : []
    );
  } catch (err) {
    console.error(" AxiosError:", err.message);
    if (err.response) {
      console.error("➡️ Status:", err.response.status);
      console.error("➡️ Data:", err.response.data);
    } else if (err.request) {
      console.error("➡️ Request:", err.request);
    } else {
      console.error("➡️ Message:", err.message);
    }
  }
};

  const handleSaveProduct = async (formObj) => {
    if (isSaving) return;
    setIsSaving(true);

    //  Hiển thị tiến trình lưu
    toast.loading("Đang lưu sản phẩm...", { id: "saving" });

    //  Tạo sản phẩm tạm để hiển thị Optimistic UI
    const tempId = "temp-" + Date.now();
    const tempProduct = {
      ...formObj,
      id: tempId,
      images: formObj.images.map((img) =>
        typeof img === "string" ? img : img.preview
      ),
      isTemp: true,
    };
    setProducts((prev) => [...prev, tempProduct]);

    try {
      const fd = new FormData();
      fd.append("name", formObj.name);
      fd.append("category", formObj.category);
      fd.append("price", formObj.price);
      fd.append("description", formObj.description);
      fd.append("color", formObj.color || "");
      fd.append("material", formObj.material || "");
      fd.append("size", formObj.size || "");

      (formObj.images || []).forEach((img) => {
        if (typeof img === "object" && img.file) fd.append("images", img.file);
      });

      const existing = (formObj.images || []).filter((img) => typeof img === "string");
      fd.append("existingImages", JSON.stringify(existing));

      let res;
      if (formObj.id) {
        res = await axios.put(`${API_BASE}/${formObj.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(" Cập nhật sản phẩm thành công", { id: "saving" });
        setProducts((prev) =>
          prev.map((p) => (p.id === formObj.id ? res.data : p))
        );
      } else {
        res = await axios.post(API_BASE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(" Thêm sản phẩm thành công", { id: "saving" });
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? res.data : p))
        );
      }

      setShowAddModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(" Lỗi lưu:", err);
      toast.error("Không thể lưu sản phẩm", { id: "saving" });
      // Xóa sản phẩm tạm nếu lỗi
      setProducts((prev) => prev.filter((p) => p.id !== tempId));
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("🗑 Xóa sản phẩm thành công");
    } catch (err) {
      console.error("Lỗi xóa:", err);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) &&
      (categoryFilter === "Tất cả" || p.category === categoryFilter)
  );

  return (
    <div className="product-container">
      <div className="product-header">
        <h4>Quản lý sản phẩm</h4>
        <button onClick={() => { setEditingProduct(null); setShowAddModal(true); }}>
          ➕ Thêm sản phẩm
        </button>
      </div>

      <div className="product-filter">
        <input placeholder=" Tìm sản phẩm..." value={filter} onChange={(e) => setFilter(e.target.value)} />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option>Tất cả</option>
          {["Thiết bị nhà bếp","Máy lọc không khí","Đèn & chiếu sáng","Dụng cụ vệ sinh","Đồ dùng phòng tắm","Đồ điện gia dụng nhỏ","Chăm sóc cá nhân","Thiết bị giặt sấy","Gia dụng thông minh","Nội thất & trang trí"].map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-data">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <table className="product-table">
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="product-img" />
                  ) : (
                    <div className="no-img">Không có ảnh</div>
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price.toLocaleString()} ₫</td>
                <td>
                  <button onClick={() => { setEditingProduct(p); setShowAddModal(true); }}>✏️ Sửa</button>
                  <button className="danger" onClick={() => handleDelete(p.id)}>🗑 Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <div className="addproduct-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="addproduct-wrapper" onClick={(e) => e.stopPropagation()}>
            <AddProduct onSave={handleSaveProduct} onClose={() => setShowAddModal(false)} product={editingProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

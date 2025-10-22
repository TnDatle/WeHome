import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !image) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm sản phẩm thành công! ID: " + res.data.id);
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        {/* Input name, description, price, image */}
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh sản phẩm</label>
          <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </div>

        <button type="submit" className="btn btn-primary">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;

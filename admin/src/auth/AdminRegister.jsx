import React, { useState } from "react";
import { auth, db } from "../Config/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../Style/Auth.css";

export default function AdminRegister() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@wehome.vn")) {
      toast.error("Chỉ email công ty (@wehome.vn) mới được phép đăng ký admin.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(res.user, { displayName: form.fullname });

      await setDoc(doc(db, "Users", res.user.uid), {
        fullname: form.fullname,
        email: form.email,
        role: "Admin",
        createdAt: new Date(),
      });

      toast.success("Tạo tài khoản admin thành công!");
      setForm({ fullname: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Đăng ký quản trị viên</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="fullname"
            placeholder="Họ tên"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email công ty (ví dụ: dat.le@wehome.vn)"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Tạo tài khoản</button>
        </form>
        <div className="auth-footer">
          Đã có tài khoản?
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "../Style/Setting.css";

const Setting = () => {
  // ========== MOCK DATA BAN ĐẦU ==========
  const [shippingConfig, setShippingConfig] = useState({
    carrier: "Giao Hàng Nhanh",
    fee: 35000,
    autoUpdate: true,
    apiKey: "",
  });

  const [paymentMethods, setPaymentMethods] = useState({
    cod: true,
    bank: true,
    momo: false,
    zalopay: false,
  });

  const [themeConfig, setThemeConfig] = useState({
    color: "#dc3545",
    font: "Segoe UI",
    banner: "",
    favicon: "",
  });

  // ========== XỬ LÝ SỰ KIỆN ==========
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingConfig({
      ...shippingConfig,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePaymentChange = (e) => {
    const { name, checked } = e.target;
    setPaymentMethods({ ...paymentMethods, [name]: checked });
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    setThemeConfig({ ...themeConfig, [name]: value });
  };

  const handleSave = () => {
    alert("Đã lưu thay đổi cài đặt!");
    console.log({ shippingConfig, paymentMethods, themeConfig });
  };


  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn đặt lại toàn bộ cài đặt không?")) {
      setShippingConfig({
        carrier: "Giao Hàng Nhanh",
        fee: 35000,
        autoUpdate: true,
        apiKey: "",
      });
      setPaymentMethods({
        cod: true,
        bank: true,
        momo: false,
        zalopay: false,
      });
      setThemeConfig({
        color: "#dc3545",
        font: "Segoe UI",
        banner: "",
        favicon: "",
      });
    }
  };

  // ========== GIAO DIỆN ==========
  return (
    <div className="setting-container">
      <h4>Các cài đặt khác</h4>

      {/* ======Cấu hình giao hàng ====== */}
      <section>
        <h5>Cấu hình giao hàng</h5>

        <label>Đơn vị vận chuyển mặc định</label>
        <select
          name="carrier"
          value={shippingConfig.carrier}
          onChange={handleShippingChange}
        >
          <option>Giao Hàng Nhanh</option>
          <option>Giao Hàng Tiết Kiệm</option>
          <option>Viettel Post</option>
          <option>J&T Express</option>
        </select>

        <label>Phí giao hàng mặc định (₫)</label>
        <input
          type="number"
          name="fee"
          value={shippingConfig.fee}
          onChange={handleShippingChange}
        />

        <label>API Key (nếu có)</label>
        <input
          type="text"
          name="apiKey"
          value={shippingConfig.apiKey}
          onChange={handleShippingChange}
          placeholder="Nhập API key nếu có..."
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="autoUpdate"
            checked={shippingConfig.autoUpdate}
            onChange={handleShippingChange}
          />{" "}
          Tự động cập nhật trạng thái đơn hàng
        </label>
      </section>

      {/* ====== Cấu hình thanh toán ====== */}
      <section>
        <h5>Cấu hình thanh toán</h5>
        <label className="checkbox">
          <input
            type="checkbox"
            name="cod"
            checked={paymentMethods.cod}
            onChange={handlePaymentChange}
          />{" "}
          Thanh toán khi nhận hàng (COD)
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="bank"
            checked={paymentMethods.bank}
            onChange={handlePaymentChange}
          />{" "}
          Chuyển khoản ngân hàng
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="momo"
            checked={paymentMethods.momo}
            onChange={handlePaymentChange}
          />{" "}
          Ví Momo
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="zalopay"
            checked={paymentMethods.zalopay}
            onChange={handlePaymentChange}
          />{" "}
          Ví ZaloPay
        </label>
      </section>

      {/* ======Giao diện & thương hiệu ====== */}
      <section>
        <h5>Giao diện & thương hiệu</h5>

        <label>Màu chủ đạo</label>
        <input
          type="color"
          name="color"
          value={themeConfig.color}
          onChange={handleThemeChange}
        />

        <label>Font chữ</label>
        <select
          name="font"
          value={themeConfig.font}
          onChange={handleThemeChange}
        >
          <option>Segoe UI</option>
          <option>Roboto</option>
          <option>Arial</option>
          <option>Poppins</option>
        </select>

        <label>Banner trang chủ</label>
        <input
          type="text"
          name="banner"
          value={themeConfig.banner}
          onChange={handleThemeChange}
          placeholder="URL ảnh banner..."
        />

        <label>Favicon</label>
        <input
          type="text"
          name="favicon"
          value={themeConfig.favicon}
          onChange={handleThemeChange}
          placeholder="URL ảnh favicon..."
        />
      </section>

      {/* ======Sao lưu & bảo trì ====== */}
      <section>
        <h5> Sao lưu & bảo trì</h5>
        <div className="btn-group">
          <button onClick={handleSave}>Lưu thay đổi</button>
          <button className="danger" onClick={handleReset}>
             Đặt lại hệ thống
          </button>
        </div>
      </section>
    </div>
  );
};

export default Setting;

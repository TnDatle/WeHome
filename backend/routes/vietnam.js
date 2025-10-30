import express from "express";
import axios from "axios";

const router = express.Router();
const BASE_URL = "https://production.cas.so/address-kit/2025-07-01";

// 🔹 Lấy danh sách Tỉnh
router.get("/provinces", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/provinces`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Backend lỗi tải Tỉnh:", err.message);
    res.status(500).json({ error: "Lỗi tải dữ liệu tỉnh/thành" });
  }
});

// 🔹 Lấy danh sách Phường/Xã
router.get("/provinces/:provinceCode/communes", async (req, res) => {
  try {
    const { provinceCode } = req.params;
    const response = await axios.get(`${BASE_URL}/provinces/${provinceCode}/communes`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Backend lỗi tải Xã:", err.message);
    res.status(500).json({ error: "Lỗi tải dữ liệu phường/xã" });
  }
});

export default router;

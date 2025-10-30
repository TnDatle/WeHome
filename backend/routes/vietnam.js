import express from "express";
import axios from "axios";
const router = express.Router();

const BASE_URL = "https://production.cas.so/address-kit/2025-07-01";

// Lấy danh sách tỉnh
router.get("/provinces", async (req, res) => {
  try {
    const result = await axios.get(`${BASE_URL}/provinces`);
    res.json(result.data);
  } catch (err) {
    console.error("Lỗi proxy:", err.message);
    res.status(500).json({ error: "Lỗi tải dữ liệu tỉnh/thành" });
  }
});

// Lấy xã/phường
router.get("/provinces/:code/communes", async (req, res) => {
  try {
    const { code } = req.params;
    const result = await axios.get(`${BASE_URL}/provinces/${code}/communes`);
    res.json(result.data);
  } catch (err) {
    console.error("Lỗi proxy:", err.message);
    res.status(500).json({ error: "Lỗi tải dữ liệu phường/xã" });
  }
});

export default router;

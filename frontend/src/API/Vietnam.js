import axios from "axios";

const BASE_URL = "https://dacn-backend.vercel.app/api/vietnam";

export async function getProvinces() {
  try {
    const res = await axios.get(`${BASE_URL}/provinces`);
    return res.data.provinces || [];
  } catch (error) {
    console.error("❌ Lỗi tải Tỉnh/Thành:", error);
    return [];
  }
}

export async function getCommunes(provinceCode) {
  if (!provinceCode) return [];
  try {
    const res = await axios.get(`${BASE_URL}/provinces/${provinceCode}/communes`);
    return res.data.communes || [];
  } catch (error) {
    console.error("❌ Lỗi tải Phường/Xã:", error);
    return [];
  }
}

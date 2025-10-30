import axios from "axios";

const BASE_URL = "https://dacn-backend.vercel.app/api/vietnam"; 

export async function getProvinces() {
  const res = await axios.get(`${BASE_URL}/provinces`);
  return res.data.provinces || [];
}

export async function getCommunes(provinceCode) {
  if (!provinceCode) return [];
  const res = await axios.get(`${BASE_URL}/provinces/${provinceCode}/communes`);
  return res.data.communes || [];
}

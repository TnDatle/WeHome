// backend/routes/chat.js
import express from "express";
import client from "../utils/openai.js";
import { db } from "../config/Firebase.js";
import {
  collection,
  query,
  limit,
  getDocs,
} from "firebase/firestore";

const router = express.Router();

/**
 * Lấy sản phẩm từ Firestore và search theo từ khóa trong message.
 * Chỉ dùng khi thực sự cần gợi ý sản phẩm.
 */
const getProductsForChat = async (message) => {
  const productsRef = collection(db, "products");

  // Lấy tối đa 30 sản phẩm để search (tùy bạn chỉnh)
  const snap = await getDocs(query(productsRef, limit(30)));

  let products = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      name: d.name || "",
      description: d.description || "",
      category: d.category || "",
      price: d.price || 0,
      image: d.images?.[0] || "",
      slug: `/product/${doc.id}`,
    };
  });

  if (!message || !message.trim()) {
    return products.slice(0, 6);
  }

  const keyword = message.toLowerCase().trim();

  // Search theo name + description + category
  const filtered = products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const cate = (p.category || "").toLowerCase();

    return (
      name.includes(keyword) ||
      desc.includes(keyword) ||
      cate.includes(keyword)
    );
  });

  if (filtered.length > 0) {
    console.log("✅ Tìm thấy", filtered.length, "sản phẩm khớp từ khóa");
    return filtered.slice(0, 6);
  }

  console.log("ℹ️ Không tìm thấy sản phẩm khớp từ khóa:", keyword);
  return [];
};

/**
 * PROMPT: tư vấn đồ gia dụng nói chung, chỉ từ chối nếu hỏi ngoài lĩnh vực.
 * KHÔNG ép buộc phải nói "không có sản phẩm trong hệ thống".
 */
const systemPrompt = `
Bạn là trợ lý WeHome – chuyên tư vấn về ĐỒ GIA DỤNG.

PHẠM VI HỖ TRỢ:
- Chỉ trả lời về các chủ đề liên quan đến đồ gia dụng, thiết bị nhà bếp, vệ sinh nhà cửa, phòng tắm, đồ điện gia dụng, nội thất nhỏ, chăm sóc cá nhân trong gia đình,...
- Nếu người dùng hỏi về chủ đề KHÔNG LIÊN QUAN (bóng đá, xe cộ, chứng khoán, lập trình, sức khỏe y khoa, v.v.)
  → Hãy lịch sự trả lời: "Mình chỉ hỗ trợ tư vấn sản phẩm và kiến thức liên quan đến đồ gia dụng trên WeHome thôi bạn nhé 😊"

CÁCH TƯ VẤN:
- Trả lời thân thiện, ngắn gọn, dễ hiểu.
- Với câu hỏi chung (cách chọn, cách dùng, so sánh, kinh nghiệm,...) → cứ tư vấn bình thường trong phạm vi đồ gia dụng.
- Đôi khi hệ thống sẽ cung cấp THÊM danh sách một vài sản phẩm cụ thể từ kho WeHome (dạng JSON).
  Khi đó, nếu thấy phù hợp, bạn có thể gợi ý 1–3 sản phẩm trong số đó.
- Nếu không được cung cấp danh sách sản phẩm, bạn vẫn tư vấn được bình thường, nhưng đừng bịa tên model cụ thể của WeHome.
`;

// =============================
// ROUTE CHATBOT
// =============================
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    const userText = (message || "").toLowerCase();

    // ✅ Chỉ gọi DB khi có vẻ user đang MUỐN GỢI Ý SẢN PHẨM CỤ THỂ
    const needProductSearch = [
      "sản phẩm",
      "mẫu nào",
      "loại nào",
      "gợi ý",
      "đề xuất",
      "nên mua",
      "mua gì",
      "mua cái gì",
      "trong tầm",
      "phù hợp",
    ].some((kw) => userText.includes(kw));

    let products = [];
    let productsJSON = "";

    if (needProductSearch) {
      products = await getProductsForChat(message);
      if (products.length > 0) {
        productsJSON = JSON.stringify(products, null, 2);
      }
    }

    const messages = [
      {
        role: "system",
        content:
          systemPrompt +
          (productsJSON
            ? `\n\nDưới đây là một số sản phẩm thật trong kho WeHome (JSON). Nếu phù hợp với câu hỏi thì có thể gợi ý chúng:\n${productsJSON}`
            : ""),
      },
      ...(history || []),
      {
        role: "user",
        content: message,
      },
    ];

    const aiRes = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages,
      temperature: 0.4, // cho phép nói chuyện tự nhiên
    });

    const reply = aiRes.choices[0].message.content;

    // Trả lời + (có thể kèm products nếu có tìm)
    res.json({ reply, products });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chatbot lỗi" });
  }
});

export default router;

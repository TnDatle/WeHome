import db from "../config/Firebase.js";

// 🛒 Lấy giỏ hàng của user
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    const snapshot = await db.collection("cart").where("userId", "==", userId).get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    await db.collection("cart").add({ userId, productId, quantity });
    res.json({ message: "✅ Added to cart!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("cart").doc(id).delete();
    res.json({ message: "✅ Removed from cart!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

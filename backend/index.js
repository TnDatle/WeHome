import express from "express";
import cors from "cors";
import db from "./config/Firebase.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Kiểm tra kết nối Firebase
(async () => {
  try {
    await db.collection("TestConnection").limit(1).get();
    console.log("✅ Firebase connected successfully!");
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
  }
})();

// Route cơ bản
app.get("/", (req, res) => res.send("Server OK ✅"));

// Test đọc dữ liệu Firestore
app.get("/test-products", async (req, res) => {
  try {
    const snapshot = await db.collection("Products").get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.listen(5000, () => console.log("🔥 Backend running on port 5000"));

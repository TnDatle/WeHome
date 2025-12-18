import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import chatRoutes from "./routes/chat.js";

// Firebase
import { db } from "./config/Firebase.js";
import { collection, getDocs } from "firebase/firestore";

const app = express();

/* ===== CORS ===== */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://we-home-nine.vercel.app/",
    "https://we-home-admin.vercel.app/"
  ],
  credentials: true
}));

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(fileUpload());

/* ===== ROUTES ===== */
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("Server OK"));

/* ===== 404 ===== */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ===== TEST FIREBASE ===== */
const testFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    console.log(`Firebase connected. Products count: ${querySnapshot.size}`);
  } catch (err) {
    console.error("Firebase connection error:", err.message);
  }
};

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  await testFirebase();
});

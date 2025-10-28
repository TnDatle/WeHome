import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
// Firebase
import { db } from "./config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload()); // enable file upload

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => res.send("Server OK ✅"));

// Test Firebase connection
const testFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    console.log(`✅ Firebase connected. Products count: ${querySnapshot.size}`);
  } catch (err) {
    console.error("🔥 Firebase connection error:", err.message);
  }
};

// Run server
const PORT = 5000;
app.listen(PORT, async () => {
  console.log(`🔥 Backend running on port ${PORT}`);
  await testFirebase(); // test Firebase ngay khi server start
});

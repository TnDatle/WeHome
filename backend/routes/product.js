// routes/productRoutes.js
import express from "express";
import {
  addProduct,
  updateProduct,
  getProducts,
  deleteProduct,
} from "../controllers/productController.js"; // đổi path cho đúng

const router = express.Router();

// GET /api/products
router.get("/", getProducts);

// POST /api/products
router.post("/", addProduct);

// PUT /api/products/:id
router.put("/:id", updateProduct);

// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

export default router;

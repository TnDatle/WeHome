import db from "../config/Firebase.js";
import { uploadImageToFreeImage } from "../utils/uploadImage.js";

// Thêm sản phẩm
export const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageFile = req.files?.image;

    if (!name || !description || !price || !imageFile) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    console.log("Uploading image:", imageFile.name);

    const imageUrl = await uploadImageToFreeImage(imageFile.data, imageFile.name);

    const timestamp = new Date().toISOString();
    const newProduct = {
      name,
      description,
      image: imageUrl,
      price: Number(price),
      sold: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await db.collection("Products").add(newProduct);
    console.log("Product added with ID:", docRef.id);

    res.status(201).json({ message: "Product added", id: docRef.id, imageUrl });
  } catch (err) {
    console.error("Error in addProduct:", err);
    res.status(500).json({ message: "Server error" });
  }
};

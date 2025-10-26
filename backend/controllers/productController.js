import { db } from "../config/firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { uploadImageToFreeImage } from "../utils/uploadImage.js";

// 🟢 Thêm sản phẩm (CHỈ thêm mới)
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageFiles = req.files?.images;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    // Upload ảnh
    const uploadedUrls = [];
    if (imageFiles) {
      const imageArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      for (const file of imageArray) {
        const url = await uploadImageToFreeImage(file.data, file.name);
        uploadedUrls.push(url);
      }
    }

    const timestamp = new Date().toISOString();
    const newProduct = {
      name,
      description,
      category,
      images: uploadedUrls,
      price: Number(price),
      sold: 0,
      stock: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 🔥 Chỉ tạo mới, không merge
    const docRef = await addDoc(collection(db, "Products"), newProduct);
    res.status(201).json({ ...newProduct, id: docRef.id });
  } catch (err) {
    console.error("🔥 Error in addProduct:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟡 Cập nhật sản phẩm (PUT)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, existingImages } = req.body;
    const imageFiles = req.files?.images;

    const docRef = doc(db, "Products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Upload ảnh mới
    const uploadedUrls = [];
    if (imageFiles) {
      const imageArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      for (const file of imageArray) {
        const url = await uploadImageToFreeImage(file.data, file.name);
        uploadedUrls.push(url);
      }
    }

    // Gộp ảnh cũ + mới
    let mergedImages = uploadedUrls;
    if (existingImages) {
      const oldImages = JSON.parse(existingImages);
      mergedImages = [...oldImages, ...uploadedUrls];
    }

    const updatedData = {
      name,
      description,
      category,
      images: mergedImages,
      price: Number(price),
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updatedData);
    res.status(200).json({ ...updatedData, id });
  } catch (err) {
    console.error("🔥 Error in updateProduct:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟣 Lấy danh sách sản phẩm
export const getProducts = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "Products"));
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (err) {
    console.error("🔥 Error in getProducts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "Products", id));
    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error("🔥 Error in deleteProduct:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

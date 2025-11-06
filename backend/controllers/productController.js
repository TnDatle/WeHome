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

// THÊM SẢN PHẨM
export const addProduct = async (req, res) => {
  console.log(" === Nhận request thêm sản phẩm ===");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  try {
    const { name, description, price, category, color, material, size } = req.body;
    const imageFiles = req.files?.images;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const timestamp = new Date().toISOString();

    //  Upload ảnh song song
    let uploadedUrls = [];
    if (imageFiles) {
      const imageArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      const results = await Promise.all(
        imageArray.map(async (file) => {
          try {
            if (file?.data && file?.name) {
              const url = await uploadImageToFreeImage(file.data, file.name);
              return url;
            }
            return null;
          } catch (err) {
            console.error(" Upload error:", err.message);
            return null;
          }
        })
      );
      uploadedUrls = results.filter(Boolean);
    }

    // Xóa field undefined
    const clean = (obj) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

    const newProduct = clean({
      name: name?.trim() || "",
      description: description?.trim() || "",
      category,
      price: Number(price) || 0,
      color: color || "",
      material: material || "",
      size: size || "",
      images:
        uploadedUrls.length > 0
          ? uploadedUrls
          : ["https://via.placeholder.com/300x300?text=No+Image"],
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const docRef = await addDoc(collection(db, "Products"), newProduct);
    console.log("Product added:", docRef.id);

    res.status(201).json({ ...newProduct, id: docRef.id });
  } catch (err) {
    console.error(" Error in addProduct:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// CẬP NHẬT SẢN PHẨM
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      existingImages,
      color,
      material,
      size,
    } = req.body;
    const imageFiles = req.files?.images;

    const docRef = doc(db, "Products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    //  Upload ảnh mới (nếu có)
    const uploadedUrls = [];
    if (imageFiles) {
      const imageArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      for (const file of imageArray) {
        try {
          if (file?.data && file?.name) {
            const url = await uploadImageToFreeImage(file.data, file.name);
            uploadedUrls.push(url);
          }
        } catch (err) {
          console.error(" Upload error:", err.message);
        }
      }
    }

    // Gộp ảnh cũ + mới
    let mergedImages = uploadedUrls;
    if (existingImages) {
      try {
        const oldImages = JSON.parse(existingImages);
        mergedImages = [...oldImages, ...uploadedUrls];
      } catch (parseErr) {
        console.warn(" Parse existingImages lỗi:", parseErr.message);
      }
    }

    const updatedData = {
      name,
      description,
      category,
      price: Number(price) || 0,
      color: color || "",
      material: material || "",
      size: size || "",
      images: mergedImages,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updatedData);
    console.log(" Product updated:", id);
    res.status(200).json({ ...updatedData, id });
  } catch (err) {
    console.error(" Error in updateProduct:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//  LẤY DANH SÁCH
export const getProducts = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "Products"));
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in getProducts:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//  XÓA
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "Products", id));
    console.log("🗑 Deleted product:", id);
    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error(" Error in deleteProduct:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

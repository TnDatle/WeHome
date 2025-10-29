// Import SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkgRbC3BiSoH8ZXbIn-XuxR5ByleVW96Y",
  authDomain: "nhom8tttn-f624a.firebaseapp.com",
  projectId: "nhom8tttn-f624a",
  storageBucket: "nhom8tttn-f624a.appspot.com", 
  messagingSenderId: "278658913475",
  appId: "1:278658913475:web:e538d98207e1d481a13e76"
};

// Khởi tạo Firebase trước
const app = initializeApp(firebaseConfig);

// Sau đó mới gọi các service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Xuất ra để dùng trong toàn app
export { app, auth, db, storage };

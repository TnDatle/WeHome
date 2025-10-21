import admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";

// Đường dẫn tuyệt đối tới file key
const serviceAccount = JSON.parse(
  readFileSync(resolve("./config/firebase-key.json"))
);

// Khởi tạo Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;

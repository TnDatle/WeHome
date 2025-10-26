import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkgRbC3BiSoH8ZXbIn-XuxR5ByleVW96Y",
  authDomain: "nhom8tttn-f624a.firebaseapp.com",
  projectId: "nhom8tttn-f624a",
  storageBucket: "nhom8tttn-f624a.firebasestorage.app",
  messagingSenderId: "278658913475",
  appId: "1:278658913475:web:e538d98207e1d481a13e76"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
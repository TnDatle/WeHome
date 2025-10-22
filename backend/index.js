import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import productRoutes from "./routes/product.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload()); // enable file upload

// Routes
app.use("/product", productRoutes);

app.get("/", (req, res) => res.send("Server OK ✅"));

// Run server
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Backend running on port ${PORT}`));

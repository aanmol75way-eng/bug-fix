import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import webRoutes from "./webRoutes";
import { errorHandler } from "./app/common/errorMiddleware";
import { AdminModel, IAdmin } from "./app/adminAuth/adminModel";

dotenv.config();

const app = express();

// ===================== MIDDLEWARE =====================
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===================== ENV VARIABLES =====================
const PORT = Number(process.env.PORT) || 5003;
const DBNAME = process.env.DBNAME;

if (!DBNAME) {
  console.error("DBNAME is missing in .env file");
  process.exit(1);
}

// ===================== UPLOAD DIRECTORIES =====================
const uploadDir = path.join(__dirname, "upload");
const productUploadDir = path.join(uploadDir, "product");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created 'upload' directory");
}

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir);
  console.log("Created 'upload/product' directory");
}

// ===================== STATIC FILES =====================
app.use("/upload/product", express.static("upload/product"));
app.use("/upload/application", express.static("upload/application"));

// ===================== ROUTES =====================
app.use("/web", webRoutes);

// ===================== ERROR HANDLER =====================
app.use(errorHandler);

// ===================== DATABASE & SERVER =====================
mongoose
  .connect(DBNAME)
  .then(async () => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

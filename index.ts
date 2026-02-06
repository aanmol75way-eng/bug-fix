import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import * as bcrypt from "bcrypt";
import webRoutes from "./webRoutes";
import { errorHandler } from "./app/common/errorMiddleware";
import { AdminModel, IAdmin } from "./app/adminAuth/adminModel";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = Number(process.env.PORT) || 5003;
const DBNAME = process.env.DBNAME;

if (!DBNAME) {
  console.error("DBNAME is missing in .env file");
  process.exit(1);
}

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

app.use("/upload/product", express.static("upload/product"));
app.use("/upload/application", express.static("upload/application"));

app.use("/web", webRoutes);

app.use(errorHandler);

mongoose.connect(DBNAME).then(async () => {
  console.log("Database connected");
  const ADMIN_EMAIL = process.env.ADMINEMAIL;
  const ADMIN_PASSWORD = process.env.ADMINPASS;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
    process.exit(1);
  }
  const existingAdmin = await AdminModel.findOne({ adminEmail: ADMIN_EMAIL as string });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 10);
    await AdminModel.create({
      adminEmail: ADMIN_EMAIL as string,
      adminPassword: hashedPassword,
    });
    console.log("Default admin created");
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

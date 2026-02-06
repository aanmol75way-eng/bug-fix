import express from "express";
import { adminLogin, forgotPassword, verifyOtp, resetPassword } from "./adminController";

const adminRoutes = express.Router();

adminRoutes.post("/adminlogin", adminLogin);
adminRoutes.post("/forget-password", forgotPassword);
adminRoutes.post("/verify-otp", verifyOtp);
adminRoutes.post("/reset-password", resetPassword);

export default adminRoutes;

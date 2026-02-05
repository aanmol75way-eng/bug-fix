import express from "express";
import { adminLogin } from "./adminController";

const adminRoutes = express.Router();

adminRoutes.post("/adminlogin", adminLogin);

export default adminRoutes;

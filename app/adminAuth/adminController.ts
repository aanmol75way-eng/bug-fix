import { NextFunction, Request, Response } from "express";
import { AdminModel } from "./adminModel";
import { createError } from "../common/createError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { adminEmail, adminPassword } = req.body;

        const admin = await AdminModel.findOne({ adminEmail }).select("+adminPassword");

        if (!admin) {
            return next(createError("Invalid email or password", 401));
        }

        const isPasswordValid = await bcrypt.compare(adminPassword, admin.adminPassword);
        if (!isPasswordValid) {
            return next(createError("Invalid email or password", 401));
        }
        const token = jwt.sign(
            { id: admin._id.toString() },
            process.env.TOKENKEY as string,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                name: admin.adminEmail,
                email: admin.adminEmail,
                adminToken: token
            },
        });
    } catch (error) {
        next(error);
    }
};

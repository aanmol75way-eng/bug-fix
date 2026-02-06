import { NextFunction, Request, Response } from "express";
import { AdminModel } from "./adminModel";
import { createError } from "../common/createError";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import transporter from "../config/emailService";
// Map to store OTPs: email -> { otp, expiresAt }
let userOtp = new Map<string, { otp: number; expiresAt: number }>();

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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { adminEmail } = req.body;
        const admin = await AdminModel.findOne({ adminEmail });
        if (!admin) {
            return next(createError("Invalid email", 404));
        }
        // Generate 4 digit OTP
        let randomOtp = Math.floor(1000 + Math.random() * 9000);

        // Store OTP with 5 minutes expiry
        userOtp.set(adminEmail, {
            otp: randomOtp,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        await transporter.sendMail({
            from: '"Auth App" <aanmol.75way@gmail.com>', // consistent sender
            to: adminEmail,
            subject: "Admin Password Reset OTP",
            html: `<h3>Your OTP for password reset is: <b>${randomOtp}</b></h3><p>This OTP is valid for 5 minutes.</p>`,
        });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { adminEmail, otp } = req.body;

        const record = userOtp.get(adminEmail);

        if (!record) {
            return next(createError("OTP not found or expired", 400));
        }

        if (record.expiresAt < Date.now()) {
            userOtp.delete(adminEmail);
            return next(createError("OTP expired", 400));
        }

        if (record.otp !== Number(otp)) {
            return next(createError("Invalid OTP", 400));
        }

        // OTP verified, generate a reset token valid for 10 minutes
        const resetToken = jwt.sign(
            { adminEmail, purpose: 'password_reset' },
            process.env.TOKENKEY as string,
            { expiresIn: '10m' }
        );

        // Clear OTP after successful verification
        userOtp.delete(adminEmail);

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            resetToken
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Expect resetToken in Authorization header or body
        const token = req.headers.authorization?.split(' ')[1] || req.body.resetToken;
        const { newPassword } = req.body;

        if (!token) {
            return next(createError("Reset token missing", 401));
        }

        const decoded = jwt.verify(token, process.env.TOKENKEY as string) as any;

        if (decoded.purpose !== 'password_reset') {
            return next(createError("Invalid token purpose", 403));
        }

        const adminEmail = decoded.adminEmail;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await AdminModel.findOneAndUpdate(
            { adminEmail },
            { adminPassword: hashedPassword }
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        next(error);
    }
};

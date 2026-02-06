import { NextFunction, Request, Response } from "express";
import { registerInput, registerSchema } from "./userAuthSchema";
import { userAuthModel } from "./userAuthModel";
import { createError } from "../common/createError";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "../config/emailConfig";
import * as jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export let userRegister = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const data: registerInput = registerSchema.parse(req.body);
        const { userName, userEmail, userPassword } = data;
        console.log(data)
        const existingUser = await userAuthModel.findOne({ userEmail });
        if (existingUser) {
            return next(createError("Email already exists", 409));
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);

        const verifyToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
        console.log(hashedToken)
        await userAuthModel.create({
            userName,
            userEmail,
            userPassword: hashedPassword,
            emailVerifyToken: hashedToken,
            emailVerifyExpire: new Date(Date.now() + 10 * 60 * 1000),
        });

        if (!process.env.FRONTEND_URL) {
            throw new Error("FRONTEND_URL missing");
        }
        console.log(process.env.FRONTEND_URL)
        const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
        await sendVerificationEmail(userEmail, verifyLink);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
        });
    }
    catch (error) {
        next(error);
    }
}

export let verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token as string;
        console.log(token)
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await userAuthModel.findOne({ emailVerifyToken: hashedToken, emailVerifyExpire: { $gt: Date.now() }, });

        if (!user) {
            return next(createError("Invalid or expired verification token", 400));
        }
        user.isEmailVarified = true;
        user.emailVerifyToken = undefined;
        user.emailVerifyExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userEmail, userPassword } = req.body;
        console.log("Res", req.body)
        const checkUser = await userAuthModel.findOne({ userEmail });
        console.log("CheckUser", checkUser?.userPassword)
        if (!checkUser) {
            return next(createError("Invalid email or password", 401));
        }

        if (!checkUser.isEmailVarified) {
            return next(createError("Please verify your email first", 403));
        }

        const isPasswordValid = await bcrypt.compare(
            userPassword,
            checkUser.userPassword
        );

        if (!isPasswordValid) {
            return next(createError("Invalid email or password", 401));
        }

        if (!process.env.TOKENKEY) {
            return next(createError("JWT secret missing", 500));
        }

        const token = jwt.sign(
            { id: checkUser._id.toString() },
            process.env.TOKENKEY as string,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                name: checkUser.userName,
                email: checkUser.userEmail,
                token: token
            },
        });
    } catch (error) {
        next(error);
    }
};

export let forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userEmail } = req.body;
        const checkUser = await userAuthModel.findOne({ userEmail });
        if (!checkUser) {
            return next(createError("Invalid email ", 401));
        }
        await userAuthModel.updateOne({ _id: checkUser._id }, { $set: { userPassword: req.body.userPassword } })
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        next(error);
    }
}
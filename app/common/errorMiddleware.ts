import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { MulterError } from "multer";

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (err instanceof MulterError) {
        statusCode = 400;
        message = err.message;
    }

    if ((err as any).name === "ValidationError") {
        statusCode = 400;
        message = Object.values((err as any).errors)
            .map((val: any) => val.message)
            .join(", ");
    }

    if ((err as any).code === 11000) {
        statusCode = 409;
        message = "Duplicate field value entered";
    }

    if ((err as any).name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if ((err as any).name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

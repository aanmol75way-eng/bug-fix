import { AppError } from "./AppError";

export const createError = (message: string, statusCode = 500) => {
    return new AppError(message, statusCode);
};

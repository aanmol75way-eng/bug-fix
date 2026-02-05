import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    userName: string;
    userEmail: string;
    userPassword: string;
    isEmailVarified: boolean; // Note: matches your schema
    emailVerifyExpire?: Date;
    emailVerifyToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        userName: { type: String, required: true },
        userEmail: { type: String, required: true, unique: true, trim: true, lowercase: true },
        userPassword: { type: String, required: true, minlength: 6, select: true },
        isEmailVarified: { type: Boolean, default: false },
        emailVerifyToken: String,
        emailVerifyExpire: Date,
    },
    { timestamps: true }
);

export const userAuthModel = mongoose.model<IUser>("UserAuth", userSchema);

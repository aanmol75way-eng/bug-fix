import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  adminEmail: string;
  adminPassword: string;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    adminEmail: { type: String, required: true, unique: true },
    adminPassword: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);

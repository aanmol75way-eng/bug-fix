import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    productImage: string,
    productName: string,
    productPrice: number,
    productDescription: string,
    productCategory: string,
    productStock: number,
}

const productSchema = new Schema<IProduct>(
    {
        productImage: { type: String, required: true },
        productName: { type: String, required: true },
        productPrice: { type: Number, required: true },
        productDescription: { type: String, required: true },
        productCategory: { type: String, required: true },
        productStock: { type: Number, required: true },
    },
    { timestamps: true }
)

export const productModel = mongoose.model<IProduct>("Product", productSchema)



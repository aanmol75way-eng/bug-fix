import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
    serviceType: string,
    serviceName: string,
    serviceDescription: string,

}

const serviceSchema = new Schema<IService>(
    {
        serviceType: { type: String, required: true },
        serviceName: { type: String, required: true },
        serviceDescription: { type: String, required: true },
    },
    { timestamps: true }
)

export const serviceModel = mongoose.model<IService>("Service", serviceSchema)



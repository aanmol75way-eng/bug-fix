import mongoose, { Schema, Document, Types } from "mongoose";

export interface ApplicationBugDocument extends Document {
    userId: Types.ObjectId;
    serviceId: Types.ObjectId;
    userName: string;
    userEmail: string;
    bugStatus: "pending" | "in-progress" | "resolved";
}

const applicationBugSchema = new Schema<ApplicationBugDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    bugStatus: {
        type: String,
        enum: ["pending", "in-progress", "resolved"],
        default: "pending",
    },
},
    {
        timestamps: true,
    }
);

export const ApplicationBugModel = mongoose.model<ApplicationBugDocument>("ApplicationBug", applicationBugSchema);

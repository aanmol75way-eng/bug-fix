import mongoose from "mongoose";

let applicationBugSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth"
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    bugStatus: {
        type: String,
        enum: ["pending", "in-progress", "resolved"],
        default: "pending"
    }
})

export const applicationBugModel = mongoose.model("ApplicationBug", applicationBugSchema)


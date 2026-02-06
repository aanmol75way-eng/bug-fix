import { NextFunction, Request, Response } from "express";
import { ApplicationBugModel } from "./applicationModel";

export let createApplicationBug = async (req: Request, res: Response, next: NextFunction) => {


    try {
        let { userName, userEmail, serviceId } = req.body;
        let userId = req.body.id;

        const product = await ApplicationBugModel.create({ userName, userEmail, serviceId, userId });
        console.log(product)
        res.status(201).json({
            status: true,
            message: "Application bug created successfully",
            data: product,
        });
    } catch (error) {
        next(error);
    }
}

export let viewApplicationBug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = req.body.id
        console.log(userId)
        const applicationBug = await ApplicationBugModel.find({ userId }).populate("userId").populate("serviceId");
        res.status(200).json({
            status: true,
            message: "Application bug fetched successfully",
            data: applicationBug
        });
    } catch (error) {
        next(error);
    }
}

export let updateApplicationBugStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id } = req.body;
        const applicationBug = await ApplicationBugModel.findOneAndUpdate({ _id: id });
        if (applicationBug?.bugStatus === 'pending') {
            applicationBug.bugStatus = 'in-progress';
            await applicationBug.save();
        }
        else if (applicationBug?.bugStatus === 'in-progress') {
            applicationBug.bugStatus = 'resolved';
            await applicationBug.save();
        }
        res.status(200).json({
            status: true,
            message: "Application bug status updated successfully",
            data: applicationBug
        });
    } catch (error) {
        next(error);
    }
}

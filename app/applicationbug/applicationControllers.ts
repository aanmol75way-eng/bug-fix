import { NextFunction, Request, Response } from "express";
import { applicationBugModel } from "./applicationModel";

export let createApplicationBug = async (req: Request, res: Response, next: NextFunction) => {


    try {
        let { userName, userEmail, serviceId } = req.body;
        let userId = req.body.id;

        const product = await applicationBugModel.create({ userName, userEmail, serviceId, userId });
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
        const applicationBug = await applicationBugModel.find({ userId }).populate("userId").populate("serviceId");
        res.status(200).json({
            status: true,
            message: "Application bug fetched successfully",
            data: applicationBug
        });
    } catch (error) {
        next(error);
    }
}


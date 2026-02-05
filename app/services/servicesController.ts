import { NextFunction, Request, Response } from "express";
import { serviceModel } from "./serviceModel";

export let createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const service = await serviceModel.create(req.body);
        res.status(201).json({
            status: true,
            message: "Service created successfully",
            data: service,
        });
    } catch (error) {
        next(error);
    }
}

export let viewService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await serviceModel.find();
        res.status(200).json({
            status: true,
            message: "Service fetched successfully",
            data: service,
        });
    } catch (error) {
        next(error);
    }
}
export let serviceName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await serviceModel.find().select('serviceName');
        res.status(200).json({
            status: true,
            message: "Service fetched successfully",
            data: service,
        });
    } catch (error) {
        next(error);
    }
}   
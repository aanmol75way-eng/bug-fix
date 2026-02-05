import { NextFunction, Request, Response } from "express";
import { productModel } from "./productModel";
import { productType } from "./productType";
import { MulterRequest } from "../common/multerRequest";

export let createProduct = async (req: MulterRequest, res: Response, next: NextFunction) => {
  console.log({ file: req.file, body: req.body })
  try {
    if (!req.file) {
      res.status(400).json({ status: 0, msg: "Product Image is required" });
      return;
    }

    let insertObj: productType = { ...req.body };

    if (req.file && req.file.filename) {
      insertObj.productImage = req.file.filename;
    }

    const product = await productModel.create(insertObj);

    res.status(201).json({
      status: 1,
      msg: "Product created successfully",
      data: product,
      imagePath: process.env.PRODUCTIMAGEPATH as string
    });
  } catch (error) {
    next(error);
  }
};

export let viewProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.find();
    res.status(200).json({
      status: 1,
      msg: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export let viewProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.status(200).json({
      status: 1,
      msg: "Product fetched successfully",
      data: product,
      imagePath: process.env.PRODUCTIMAGEPATH as string
    });
  } catch (error) {
    next(error);
  }
};
export let updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.status(200).json({
      status: 1,
      msg: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
export let deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 1,
      msg: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

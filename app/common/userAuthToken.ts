import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { createError } from "./createError";

export let checkToken: any = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1]
    if (token) {
        let decoded = jwt.verify(token, process.env.TOKENKEY as string) as JwtPayload
        if (decoded) {
            let { id } = decoded
            req.body.id = id
            return next()
        }
        else {
            return next(createError("please fill the correct token", 401));
        }
    }
    else {
        return next(createError("please fill the  token", 401));
    }
}

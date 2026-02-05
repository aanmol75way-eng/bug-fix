import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
export let checkToken: any = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1]
    let resObj: any
    if (token) {
        let decoded = jwt.verify(token, process.env.TOKENKEY as string) as JwtPayload
        if (decoded) {
            let { id } = decoded
            req.body.id = id

            // { id:checkemail._id }

            return next()
        }
        else {
            resObj = {
                status: 0,
                msg: 'please fill the correct token'
            }
        }
    }
    else {
        resObj = {
            status: 0,
            msg: 'please fill the  token'
        }
    }

    res.send(resObj)
}

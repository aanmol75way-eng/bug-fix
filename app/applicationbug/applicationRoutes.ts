import express from "express";
import { createApplicationBug, viewApplicationBug } from "./applicationControllers";
import { checkToken } from "../common/userAuthToken";

let applicationRoutes = express.Router()

applicationRoutes.post('/create', checkToken, createApplicationBug)
applicationRoutes.post('/view', checkToken, viewApplicationBug)

export default applicationRoutes    
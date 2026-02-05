import express from 'express'
import { forgetPassword, userLogin, userRegister, verifyEmail } from './userAuthControllers'

let userRoutes = express.Router()

userRoutes.post('/register', userRegister)
userRoutes.get('/verify-email/:token', verifyEmail)
userRoutes.post('/login', userLogin)
userRoutes.put('/forget-password/:id', forgetPassword)

export default userRoutes
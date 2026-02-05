import express from 'express'
import userRoutes from './app/userAuth/userAuthRoutes'
import productRoutes from './app/product/productRoutes'
import serviceRoutes from './app/services/serviceRoutes'
import applicationRoutes from './app/applicationbug/applicationRoutes'
import adminRoutes from './app/adminAuth/adminRoutes'
let webRoutes = express.Router()

webRoutes.use('/userauth', userRoutes)
webRoutes.use('/product', productRoutes)
webRoutes.use('/service', serviceRoutes)
webRoutes.use('/application', applicationRoutes)
webRoutes.use('/admin', adminRoutes)
export default webRoutes    

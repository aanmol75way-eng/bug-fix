import express from 'express'
import multer from 'multer'
import { createProduct, deleteProduct, updateProduct, viewProduct, viewProductById } from './productController'
let productRoutes = express.Router()

import path from 'path'

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'upload', 'product'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
let upload = multer({ storage: storage })

productRoutes.post('/create', upload.single('productImage'), createProduct)
productRoutes.get('/view', viewProduct)
productRoutes.get('/view/:id', viewProductById)
productRoutes.put('/update/:id', updateProduct)
productRoutes.delete('/delete/:id', deleteProduct)

export default productRoutes    
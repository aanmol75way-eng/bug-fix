import express from 'express'
import { createService, serviceName, viewService } from './servicesController'
let serviceRoutes = express.Router()

serviceRoutes.post('/create', createService)
serviceRoutes.get('/view', viewService)
serviceRoutes.get('/servicename', serviceName)
export default serviceRoutes    
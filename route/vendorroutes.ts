import express, { Request, Response, NextFunction } from 'express';
import { getVendorProfile, updateVendorProfile, updateVendorService, vendorLogin } from '../controller/vendorcontroller';
import { Authenticate } from './../middlewares/commonauth';
const router = express.Router()
router.get('/', (req, res) => {
    res.json({
        message: "halo vendor"
    })
})
router.post('/login', vendorLogin)
router.get('/profile', Authenticate, getVendorProfile)
router.patch('/profile',Authenticate,updateVendorProfile)
router.patch('/service',Authenticate,updateVendorService)
export { router as vendorroutes }
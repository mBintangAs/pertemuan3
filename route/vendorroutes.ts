import express, { Request, Response, NextFunction } from 'express';
import { addCoverVendor, getFood, getVendorAndFood, getVendorProfile, updatePhotoFood, updateVendorProfile, updateVendorService, vendorLogin } from '../controller/vendorcontroller';
import { Authenticate } from './../middlewares/commonauth';
import { addFood } from './../controller/vendorcontroller';
import multer from 'multer';
import randomstring from 'randomstring';
const router = express.Router()


const foodImageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './images/makanan'),
    filename: (req, file, cb) => cb(null, randomstring.generate(7) + ' ' + file.originalname)
})
const gambarMakanan = multer({ storage: foodImageStorage }).array('myimages', 10)
router.get('/', (req, res) => {
    res.json({
        message: "halo vendor"
    })
})
const coverImageVendorStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './images/cover-vendor'),
    filename: (req, file, cb) => cb(null, randomstring.generate(7) + ' ' + file.originalname)
})
const gambarCoverVendor = multer({ storage: coverImageVendorStorage }).array('myimages', 10)
router.get('/', (req, res) => {
    res.json({
        message: "halo vendor"
    })
})
router.post('/login', vendorLogin)
router.get('/vendor-food/:_id',getVendorAndFood)
router.use(Authenticate)
router.get('/profile', getVendorProfile)
router.patch('/profile', updateVendorProfile)
router.patch('/service', updateVendorService)
router.get('/food', getFood)
router.post('/food-photo',gambarMakanan, updatePhotoFood)
router.post('/food', gambarMakanan, addFood)
router.post('/cover-vendor', gambarCoverVendor, addCoverVendor)

export { router as vendorroutes }
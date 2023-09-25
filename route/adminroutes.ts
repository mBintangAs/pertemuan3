import express ,{Request,Response,NextFunction} from 'express';
import { createVendor, getVendor, getVendorById } from './../controller/admincontroller';
const  router= express.Router()
router.get('/',(req,res)=>{
    res.json({
        message:"halo admin"
    })
})
router.get('/vendors',getVendor)
router.get('/vendors/:id',getVendorById)
router.post('/vendors',createVendor)
export { router as adminrouter}
import express ,{Request,Response,NextFunction} from 'express';
const  router= express.Router()
router.get('/',(req,res)=>{
    res.json({
        message:"halo vendor"
    })
})
export { router as vendorroutes}
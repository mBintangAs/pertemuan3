import {Request,Response,NextFunction} from 'express';
import { createVendorInput } from './../dto/vendor.dto';
import { Vendor } from './../models/Vendor';
import { generatePassword, generateSalt } from './../utility/passwordUtility';
export const createVendor =async (req:Request,res:Response,next:NextFunction) => {
    const {name,address,pincode,foodType,email,password,ownerName,phone} = <createVendorInput> req.body
    const existVendor = await Vendor.findOne({email})
    if(existVendor!==null){
        return res.json({"message":"Vendor Sudah Ada!"})
    }
    const salt = await generateSalt()
    const userpassword = await generatePassword(password,salt)

    const createVendor = await Vendor.create({
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password:userpassword,
        salt,
        serviceAvailable:false,
        coverImage:[],
        rating:0
    })
    return res.json(createVendor)
}
export const getVendor =async (req:Request,res:Response,next:NextFunction) => {
    
}
export const getVendorById =async (req:Request,res:Response,next:NextFunction) => {
    
}
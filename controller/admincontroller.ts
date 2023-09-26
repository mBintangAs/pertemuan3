import {Request,Response,NextFunction} from 'express';
import { createVendorInput } from './../dto/vendor.dto';
import { Vendor } from './../models/Vendor';
import { generatePassword, generateSalt } from './../utility/passwordUtility';
export const createVendor =async (req:Request,res:Response,next:NextFunction) => {
    const {name,address,pincode,foodType,email,password,ownerName,phone} = <createVendorInput> req.body
    const existVendor = await findVendor('',email)
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
    let all:undefined
    const vendor = await findVendor(all) 
   if (!vendor){
    return res.json({"message":"data tidak ditemukan"})
   }
   return res.json(vendor)
}
export const getVendorById =async (req:Request,res:Response,next:NextFunction) => {
    try {
        const vendor = await findVendor(req.params.id) 
        if (!vendor){
         return res.json({"message":"data tidak ditemukan"})
        }
        return res.json(vendor)
    } catch (e) {
        return res.status(400).send(e)
    }
}
export const findVendor = async (id:string|undefined , email?:string)=>{
    if(email){
        return await Vendor.findOne({email}).select('+password +salt') 
    }else{
        if (typeof id == 'undefined'){
            return await Vendor.find().select('+password +salt')
        }
        return await Vendor.findById(id).select('+password +salt')
    }
}
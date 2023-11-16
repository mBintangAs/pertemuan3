import { Request, Response, NextFunction } from 'express';
import { editVendorInputs, findIdString, vendorLoginInput, vendorPayload, vendorRet } from '../dto/vendor.dto';
import { findVendor } from "./admincontroller";
import { generateSign, validatePassword } from '../utility/passwordUtility';
import { Vendor, VendorDoc } from '../models/Vendor';
import { PhotoFoodUpdate, createFoodInput } from '../dto';
import { Food } from './../models/Food';
import { unlink } from "fs/promises";
import mongoose from "mongoose";
import * as path from 'path';
export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <vendorLoginInput>req.body
    const vendorExist = await findVendor('', email)
    if (vendorExist && !Array.isArray(vendorExist)) {
        const isPasswordTrue = await validatePassword(password, vendorExist.password, vendorExist.salt)
        if (isPasswordTrue) {
            const { _id, name, email, foodType } = vendorExist
            const payload: vendorPayload = { _id, name, email, foodType }
            return res.json(generateSign(payload))
        }
    }
    return res.json({ "message": "login gagal" })
}

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vendor = await findVendor(user._id);
        return res.json(vendor);
    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { foodType, name, address, phone } = <editVendorInputs>req.body
    const user = req.user;
    if (user) {
        const vendor = await findVendor(user._id)
        if (vendor !== null && typeof vendor === 'object') {
            const m_vendor: VendorDoc = vendor as VendorDoc
            m_vendor.name = name
            m_vendor.address = address
            m_vendor.phone = phone
            m_vendor.foodType = foodType
            const retval = await m_vendor.save()
            return res.json(m_vendor)
        } else {
            return res.json(vendor)
        }
    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vendor = await findVendor(user._id)
        if (vendor !== null && typeof vendor === 'object') {
            const m_vendor: VendorDoc = vendor as VendorDoc
            m_vendor.serviceAvailable = !m_vendor.serviceAvailable
            const retval = await m_vendor.save()
            return res.json(m_vendor)
        } else {
            return res.json(vendor)
        }
    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const addFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const { name, description, category, foodType, readyTime, price } = <createFoodInput>req.body
        console.log(name)
        const vendor = await findVendor(user._id)
        if (vendor !== null) {
            const m_vendor: VendorDoc = vendor as VendorDoc
            const files = req.files as [Express.Multer.File];
            const images = files.map((files: Express.Multer.File) => files.filename)
            console.log(files);
            console.log(images);
            const menu = await Food.create({
                vendorId: m_vendor._id,
                name, description, category, foodType, readyTime, price,
                rating: 0,
                images,
            })
            m_vendor.foods.push(menu)
            const result = await m_vendor.save()
            return res.json(result)
        } else {
            return res.json(vendor)
        }
    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const addCoverVendor = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const vendor = await findVendor(user._id)
        if (vendor !== null) {
            const m_vendor: VendorDoc = vendor as VendorDoc
            const files = req.files as [Express.Multer.File];
            const images = files.map((files: Express.Multer.File) => files.filename)
            m_vendor.coverImage.push(images.join())
            const result = await m_vendor.save()
            return res.json(result)
        } else {
            return res.json(vendor)
        }
    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const getFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const food = await Food.find({ vendorId: user._id })
        return res.json(food)

    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const updatePhotoFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const { foodId, hapus } = <PhotoFoodUpdate>req.body
        if (hapus === 'true') {
            const fotofood = await Food.findById(foodId)
            if (!fotofood) {
                return res.json({ "message": "Makanan tidak di temukan" });
            }
            try {
                const images: string[] = fotofood.images
                const imagesDir = path.join(__dirname, '..', 'images', 'makanan');
                images.map(async (e) => {
                    await unlink(`${imagesDir}/${e}`,)
                })
                await Food.updateOne({ _id: foodId }, { $unset: { images: 1 } })
                return res.json({ "message": "data berhasil di hapus" })
            } catch (err) {
                return res.json(err);
            }
        } else {
            const myimages = req.files as [Express.Multer.File];
            const images = myimages.map((file: Express.Multer.File) => file.filename);
            const food = await Food.updateOne({ _id: foodId }, { $push: { images } })
            return res.json(food)
        }
    } else {
        return res.json({ "message": "vendor not found" });
    }
}
export const getVendorAndFood = async (req: Request<findIdString>, res: Response, next: NextFunction) => {

    const {_id} = req.params
    const vendorAndFood = await Vendor.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(_id) }
    }, {
        $lookup:
        {
            from: 'foods',
            localField: 'foods', // Assuming 'foods' is an array of ObjectId references
            foreignField: '_id',
            as: 'foodsData'
        }
    }])
    
    return res.json(vendorAndFood)
}
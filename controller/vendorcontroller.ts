import { Request, Response, NextFunction } from 'express';
import { editVendorInputs, vendorLoginInput, vendorPayload } from '../dto/vendor.dto';
import { findVendor } from "./admincontroller";
import { generateSign, validatePassword } from '../utility/passwordUtility';
import { VendorDoc } from '../models/Vendor';
import { createFoodInput } from '../dto';
import { Food } from './../models/Food';
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
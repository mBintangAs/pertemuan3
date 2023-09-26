import { Request, Response, NextFunction } from 'express';
import { vendorLoginInput, vendorPayload } from '../dto/vendor.dto';
import { findVendor } from "./admincontroller";
import { generateSign, validatePassword } from '../utility/passwordUtility';
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
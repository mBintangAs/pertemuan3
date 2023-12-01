import bcrypt from 'bcrypt';
import { Request,Response } from 'express';
import { APP_SECRET } from '../config';
import { vendorPayload } from '../dto/vendor.dto';
import jwt from 'jsonwebtoken';
import { authPayload } from '../dto';

export const generateSalt = async () => {
    return await bcrypt.genSalt();
}
export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}
export const validatePassword = async (enterpass: string, savedpass: string, salt: string) => {
    return await generatePassword(enterpass, salt) === savedpass
}
export const generateSign = (payload: authPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' })
}

export const validateSign = async (req: Request) => {
    try {
        
        const sign = req.get('Authorization');
        if (sign) {
            const payload = jwt.verify(sign, APP_SECRET) as authPayload
            req.user = payload
            return true
        }
        return false
    } catch (e) {
        return false
    }
}

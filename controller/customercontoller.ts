import { Request, Response, NextFunction } from 'express';
import { CreateCustomerInput, loginCustomerInput } from '../dto/costumer.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { generatePassword, generateSalt, generateSign, validatePassword } from '../utility';
import { generateOtp, onRequestOtp } from '../utility/notificationUtility';
import { Customer, CustomerDoc } from '../models/Customer';
import { authPayload } from '../dto';

export const customerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const customerInput = plainToClass(CreateCustomerInput, req.body)
        const inputError = await validate(customerInput, { validationError: { target: true } })
        if (inputError.length > 0) return res.status(400).json(inputError);

        const { email, phone, password } = customerInput
        const salt = await generateSalt()
        const userPassword = await generatePassword(password, salt)
        const { otp, expiry } = generateOtp()
        const result = await Customer.create(
            {
                email, password: userPassword,
                salt, phone, verified: false,
                otp, otp_expiry: expiry, lat: 0, lng: 0
            })
        if (result) {
            // await onRequestOtp(otp, phone);
            const result_pros: CustomerDoc = result as CustomerDoc
            const signature = generateSign({
                _id: result_pros._id,
                email: result_pros.email,
                verified: result_pros.verified
            })
            return res.status(201).json({ signature, verified: result_pros.verified, email: result_pros.email })
        } else {
            return res.status(400).json({ message: "sign up gagal" })
        }
    } catch (e) {
        if ((e as any).code === 11000) {
            return res.json({ "message": "Customer Exist" })
        }
        else if (typeof e === "string") {
            return res.json(e.toUpperCase())
        } else if (e instanceof Error) {
            return res.json(e.message)
        }
    }
}

export const verifOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body
    const customer = req.user
    if (customer) {
        const data = await Customer.findById(customer._id)
        if (data && parseInt(data.otp) === parseInt(otp) && new Date(data.otp_expiry) >= new Date()) {
            data.verified = true
            const { _id, email, verified } = await data.save()
            const signature = generateSign({ _id, email, verified })
            return res.status(201).json({ signature, verified, email })
        }
    }
    return res.status(400).json({ "message": "Verifikasi otp gagal" })

}
export const loginCustomer = async (req: Request, res: Response, next: NextFunction) => {

    const customerInput = plainToClass(loginCustomerInput, req.body)
    const inputError = await validate(customerInput, { validationError: { target: true } })
    if (inputError.length > 0) return res.status(400).json(inputError);

    const customer = await Customer.findOne({ email: customerInput.email })
    if (customer !== null) {
        const m_customer: CustomerDoc = customer as CustomerDoc
        if (await validatePassword(customerInput.password, m_customer.password, m_customer.password)) {
            const payload: authPayload = {_id:m_customer._id,email:m_customer.email,verified:m_customer.verified}
            return res.json({ signature: generateSign(payload), verified: m_customer.verified, email: m_customer.email })
        }
    }
    return res.status(404).json({ "message": "login gagal" })
}
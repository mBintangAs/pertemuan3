import express from 'express';
import { customerSignUp, loginCustomer, verifOtp } from '../controller/customercontoller';
import { Authenticate } from '../middlewares';

const router = express.Router()
router.post('/login', loginCustomer)
router.post('/signup', customerSignUp)
router.use(Authenticate)
router.patch('/verifotp',verifOtp)
export { router as customerRoute }

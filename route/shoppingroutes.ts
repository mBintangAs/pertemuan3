import express, { Request, Response, NextFunction } from 'express';
const router = express.Router()
import { findFood, get30MinFoods, getFoodTersedia, getTopWarteg } from './../controller/shoppingcontroller';

router.get('/warteg-food/:_id',getFoodTersedia)
router.get('/top-warteg',getTopWarteg)
router.get('/food-in-30min/:_id',get30MinFoods)
// router.get('/find-makanan/:name',findFood)
router.post('/find-food',findFood)
export { router as shoppingroutes }
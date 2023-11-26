import { Request, Response, NextFunction } from 'express';
import { Vendor } from '../models/Vendor';
import { findIdString } from '../dto/vendor.dto';
import { Food } from './../models';
import { foodNameFind } from '../dto';

export const getFoodTersedia = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params
    try {
        const result = await Vendor.find({ _id, serviceAvailable: true }).sort({ rating: "descending" }).populate("foods")
        if (result.length > 0) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({ message: "Not Found or not available" })
        }
    } catch (e) {
        if (typeof e === "string") {
            console.log(e.toUpperCase());
        }
        if (e instanceof Error) {
            console.log(e.message);
        }

        return res.status(400).json({ message: "Not Found or not available" })
    }
}
export const get30MinFoods = async (req: Request<findIdString>, res: Response, next: NextFunction) => {
    const { _id } = req.params
    try {
        const result = await Food.aggregate([{ $match: { vendorId: _id, readyTime: { $lt: 30 }, } }])
        if (result.length > 0) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({ message: "Not Found or not available" })
        }

    } catch (e) {
        if (typeof e === "string") {
            console.log(e.toUpperCase());
        }
        if (e instanceof Error) {
            console.log(e.message);
        }

        return res.status(400).json({ message: "Not Found or not available" })
    }
}
export const getTopWarteg = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Vendor.aggregate([{ $sort: { rating: -1 } }]).limit(3)
        if (result.length > 0) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({ message: "Not Found or not available" })
        }

    } catch (e) {
        if (typeof e === "string") {
            console.log(e.toUpperCase());
        }
        if (e instanceof Error) {
            console.log(e.message);
        }

        return res.status(400).json({ message: "Not Found or not available" })
    }
}
export const findFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = <foodNameFind>req.body
        const food = await Food.aggregate([{
            $match: { name: new RegExp(name, 'i') },
        },
        {
            $lookup:
            {
                from: 'vendors',
                localField: '_id', // Assuming 'foods' is an array of ObjectId references
                foreignField: 'foods',
                as: 'vendors'
            }
        },
        {
            $match: { 'vendors.serviceAvailable': true }
        }])
        if (food.length == 0) {
            return res.status(404).json({ message: "Not Found or not available" })
        }
        return res.json(food)
    } catch (e) {
        if (typeof e === "string") {
            console.log(e.toUpperCase());
        }
        if (e instanceof Error) {
            console.log(e.message);
        }

        return res.status(400).json({ message: "Not Found or not available" })
    }
}
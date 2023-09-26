import { authPayload } from "../dto";
import { Request, Response, NextFunction } from "express";
import { validateSign } from "../utility";
declare global {
    namespace Express {
        interface Request {
            user?: authPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await validateSign(req);
    if (validate) {
        next();
    } else {
        return res.json({ "message": 'Not authorized' });
    }
}


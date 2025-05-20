import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../model/User';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
            req.user = await User.findOne({ _id: decoded.id });

            if (!req.user) {
                res.status(401);
                throw new Error(`Not authorized`);
            }

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error(`Not authorized`);
        }
    }

    if (!token) {
        res.status(401);
        throw new Error(`Not authorized`);
    }
});
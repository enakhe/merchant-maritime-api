// errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
	err: { message: any; stack: any },
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode === 200 ? 400 : res.statusCode;
	res.status(statusCode).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
		statusCode,
	});
};
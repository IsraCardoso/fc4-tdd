import { Request, Response, NextFunction } from 'express';
import { AppError, InternalServerError } from '../errors/app_error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  const internalError = new InternalServerError();
  return res.status(internalError.statusCode).json({
    message: internalError.message,
  });
}

export function asyncHandler(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

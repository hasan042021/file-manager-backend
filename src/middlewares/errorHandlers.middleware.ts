import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError, ValidationError } from '@utils/errors';
import logger from '@logger';

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: any;
  stack?: string;
}

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`${err.message} - ${err.stack}`);

  // Log all errors, including non-AppError instances
  if (!(err instanceof AppError)) {
    logger.error(`${err.message} - ${err.stack}`);
  }

  // Default error
  let statusCode = 500;
  const response: ErrorResponse = {
    success: false,
    message: 'Internal Server Error',
  };

  // Handle operational errors
  if (err instanceof AppError) {
    err.logStackTrace();
    statusCode = err.statusCode;
    response.message = err.message;
    if (err.errors) {
      response.errors = err.errors;
    }
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    switch (err.code) {
      case 'P2002':
        response.message = 'Duplicate field value entered';
        break;
      case 'P2014':
        response.message = 'Invalid ID';
        break;
      case 'P2003':
        response.message = 'Foreign key constraint failed';
        break;
      default:
        response.message = 'Database error occurred';
    }
  }

  // Handle validation errors (e.g., from express-validator)
  if (Array.isArray(err) && err.length > 0 && 'msg' in err[0]) {
    statusCode = 400;
    response.message = err.length === 1 ? err[0].msg : 'Validation error';

    response.errors = err.map((e) => ({
      field: e.param,
      message: e.msg,
    }));
  }

  res.status(statusCode).json(response);
};

export const fileUploadErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: 'File upload validation failed',
      details: err.errors,
    });
  }
  next(err);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const errorMsg = `Route ${req.originalUrl} not found`;
  res.status(404).json({ success: false, message: errorMsg });
};

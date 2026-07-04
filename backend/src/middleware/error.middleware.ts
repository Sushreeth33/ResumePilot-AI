import { ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ApiError } from '../utils/ApiError.js';
import type { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed.',
      errorCode: 'VALIDATION_ERROR',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error.',
    errorCode: 'INTERNAL_SERVER_ERROR',
  });
};

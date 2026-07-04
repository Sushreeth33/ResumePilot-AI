import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ApiError } from '../utils/ApiError.js';
import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'Validation failed.',
        'VALIDATION_ERROR',
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      );
    }

    request.body = result.data;
    next();
  };
}

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { UserModel } from '../modules/users/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { JwtPayload } from '../types/jwt.types.js';

export const authMiddleware = asyncHandler(async (request, _response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Authentication token is required.',
      'TOKEN_MISSING',
    );
  }

  const token = authHeader.split(' ')[1];

  if (!env.JWT_SECRET) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'JWT secret is not configured.',
      'JWT_SECRET_MISSING',
    );
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token.', 'TOKEN_INVALID');
  }

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Authenticated user no longer exists.',
      'USER_NOT_FOUND',
    );
  }

  request.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  next();
});

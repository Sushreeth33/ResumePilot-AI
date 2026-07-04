import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authService } from './auth.service.js';

export const register = asyncHandler(async (request, response) => {
  const result = await authService.register(request.body);

  response.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User registered successfully.',
    data: result,
  });
});

export const login = asyncHandler(async (request, response) => {
  const result = await authService.login(request.body);

  response.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User logged in successfully.',
    data: result,
  });
});

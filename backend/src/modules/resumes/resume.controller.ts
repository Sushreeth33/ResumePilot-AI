import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { resumeService } from './resume.service.js';

export const uploadResume = asyncHandler(async (request, response) => {
  if (!request.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication is required.', 'AUTH_REQUIRED');
  }

  if (!request.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Resume file is required.', 'RESUME_FILE_REQUIRED');
  }

  const resume = await resumeService.createUploadedResume({
    userId: request.user.id,
    file: request.file,
  });

  response.status(HTTP_STATUS.CREATED).json({
    success: true,
    resumeId: resume._id.toString(),
    message: 'Resume uploaded successfully.',
  });
});

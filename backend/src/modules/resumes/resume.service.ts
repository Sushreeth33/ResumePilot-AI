import { Types } from 'mongoose';
import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { ApiError } from '../../utils/ApiError.js';
import { ResumeModel } from './resume.model.js';

type CreateUploadedResumeInput = {
  userId: string;
  file: Express.Multer.File;
};

async function createUploadedResume({ userId, file }: CreateUploadedResumeInput) {
  try {
    return await ResumeModel.create({
      userId: new Types.ObjectId(userId),
      originalFileName: file.originalname,
      storedFileName: file.filename,
      storagePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
    });
  } catch {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to save resume metadata.',
      'RESUME_METADATA_SAVE_FAILED',
    );
  }
}

export const resumeService = {
  createUploadedResume,
};

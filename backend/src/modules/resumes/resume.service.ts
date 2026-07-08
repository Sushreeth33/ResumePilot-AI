import { Types } from 'mongoose';
import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { parsingService } from '../../services/pdf/parsing.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { RESUME_STATUS, ResumeModel } from './resume.model.js';

type CreateUploadedResumeInput = {
  userId: string;
  file: Express.Multer.File;
};

async function createUploadedResume({ userId, file }: CreateUploadedResumeInput) {
  try {
    const resume = await ResumeModel.create({
      userId: new Types.ObjectId(userId),
      originalFileName: file.originalname,
      storedFileName: file.filename,
      storagePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
    });

    return await parseUploadedResume(resume._id.toString(), file.path);
  } catch {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to save resume metadata.',
      'RESUME_METADATA_SAVE_FAILED',
    );
  }
}

async function parseUploadedResume(resumeId: string, filePath: string) {
  await ResumeModel.findByIdAndUpdate(resumeId, {
    status: RESUME_STATUS.PARSING,
  });

  try {
    const parseResult = await parsingService.parsePdf(filePath);
    const parsedResume = await ResumeModel.findByIdAndUpdate(
      resumeId,
      {
        parsedText: parseResult.parsedText,
        parserMetadata: parseResult.parserMetadata,
        status: RESUME_STATUS.PARSED,
      },
      { new: true },
    );

    if (!parsedResume) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Resume not found.',
        'RESUME_NOT_FOUND',
      );
    }

    return parsedResume;
  } catch (error) {
    const failedResume = await ResumeModel.findByIdAndUpdate(
      resumeId,
      {
        parserMetadata: parsingService.createFailedMetadata(error),
        status: RESUME_STATUS.PARSE_FAILED,
      },
      { new: true },
    );

    if (!failedResume) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Resume not found.',
        'RESUME_NOT_FOUND',
      );
    }

    return failedResume;
  }
}

export const resumeService = {
  createUploadedResume,
};

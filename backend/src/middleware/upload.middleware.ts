import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ApiError } from '../utils/ApiError.js';
import type { Request } from 'express';

const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024;
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const backendRoot = path.resolve(currentDirectory, '../..');

export const resumeUploadDirectory = path.join(backendRoot, 'uploads', 'resumes');

fs.mkdirSync(resumeUploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(_request, _file, callback) {
    callback(null, resumeUploadDirectory);
  },
  filename(_request, file, callback) {
    const safeExtension = path.extname(file.originalname).toLowerCase() || '.pdf';
    const uniqueName = `resume-${Date.now()}-${randomUUID()}${safeExtension}`;

    callback(null, uniqueName);
  },
});

function pdfFileFilter(
  _request: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) {
  const hasPdfMimeType = file.mimetype === 'application/pdf';
  const hasPdfExtension = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (!hasPdfMimeType || !hasPdfExtension) {
    callback(
      new ApiError(
        HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
        'Only PDF resume files are supported.',
        'INVALID_FILE_TYPE',
      ),
    );
    return;
  }

  callback(null, true);
}

const resumeUploader = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: MAX_RESUME_FILE_SIZE,
    files: 1,
  },
});

export const uploadResumeFile = resumeUploader.single('resume');

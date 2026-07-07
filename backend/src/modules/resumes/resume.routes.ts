import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { uploadResumeFile } from '../../middleware/upload.middleware.js';
import { uploadResume } from './resume.controller.js';

export const resumeRoutes = Router();

resumeRoutes.post('/upload', authMiddleware, uploadResumeFile, uploadResume);

import { api } from './api';
import type { ResumeUploadResponse } from '../types/resume.types';

export async function uploadResumeRequest(file: File) {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post<ResumeUploadResponse>('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export type ResumeUploadResponse = {
  success: true;
  resumeId: string;
  message: string;
};

export type UploadedResume = {
  id: string;
  name: string;
  status: 'UPLOADED';
};

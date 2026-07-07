import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { uploadResumeRequest } from '../services/resumeService';
import type { UploadedResume } from '../types/resume.types';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function getUploadErrorMessage(rejections: FileRejection[]) {
  const firstError = rejections[0]?.errors[0];

  if (!firstError) {
    return 'Unable to select this file. Please try again.';
  }

  if (firstError.code === 'file-invalid-type') {
    return 'Please upload a PDF file only.';
  }

  if (firstError.code === 'file-too-large') {
    return 'Resume file must be 5 MB or smaller.';
  }

  return 'Unable to select this file. Please choose another PDF.';
}

function getFriendlyUploadError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 413) {
      return 'Resume file must be 5 MB or smaller.';
    }

    if (error.response?.status === 415) {
      return 'Please upload a PDF file only.';
    }

    if (!error.response) {
      return 'Network error. Please check that the backend is running and try again.';
    }
  }

  if (error instanceof TypeError) {
    return 'Network error. Please check that the backend is running and try again.';
  }

  return 'Upload failed. Please try again.';
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setUploadedResume(null);

    if (fileRejections.length > 0) {
      setSelectedFile(null);
      setErrorMessage(getUploadErrorMessage(fileRejections));
      return;
    }

    const file = acceptedFiles[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setErrorMessage('');
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: MAX_RESUME_SIZE,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const canUpload = useMemo(
    () => Boolean(selectedFile && !isUploading),
    [isUploading, selectedFile],
  );

  async function handleUpload() {
    if (!selectedFile || isUploading) {
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage('');

      const result = await uploadResumeRequest(selectedFile);

      setUploadedResume({
        id: result.resumeId,
        name: selectedFile.name,
        status: 'UPLOADED',
      });
      setSelectedFile(null);
    } catch (error) {
      setErrorMessage(getFriendlyUploadError(error));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">
                Welcome, <span className="text-cyan-700">{user?.name}</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Your resume workspace will appear here as the next features are added.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Resume Upload
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Upload your resume</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add your latest PDF resume. Analysis features will unlock in the next milestone.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`flex min-h-56 flex-col items-center justify-center rounded-lg border-2 border-dashed px-5 py-8 text-center transition ${
              isDragActive
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-slate-300 bg-slate-50 hover:border-cyan-400 hover:bg-cyan-50/40'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-lg font-bold text-cyan-700">
              PDF
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-950">Drag & Drop your Resume</p>
            <button
              type="button"
              onClick={open}
              className="mt-2 text-sm font-semibold text-cyan-700 underline-offset-4 hover:text-cyan-800 hover:underline"
            >
              or Click to Browse
            </button>
            <p className="mt-4 text-sm text-slate-500">Only PDF · Max 5 MB</p>
          </div>

          {selectedFile ? (
            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-950">Selected File</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="break-all text-sm font-medium text-slate-800">
                    {selectedFile.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {uploadedResume ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-emerald-800">✓ Resume Uploaded</p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">
                    {uploadedResume.name}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-emerald-700">
                      Status {uploadedResume.status}
                    </span>
                    <span className="text-slate-600">Uploaded just now</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="rounded-md bg-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Analyze Resume
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

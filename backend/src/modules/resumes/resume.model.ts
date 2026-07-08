import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export const RESUME_STATUS = {
  UPLOADED: 'UPLOADED',
  PARSING: 'PARSING',
  PARSED: 'PARSED',
  PARSE_FAILED: 'PARSE_FAILED',
  ANALYZED: 'ANALYZED',
} as const;

export type ResumeStatus = (typeof RESUME_STATUS)[keyof typeof RESUME_STATUS];

export type ParserMetadata = {
  parser: 'pdf-parse';
  pageCount: number | null;
  wordCount: number;
  characterCount: number;
  parsedAt: Date;
  success: boolean;
  error: string | null;
};

export type Resume = {
  userId: Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  storagePath: string;
  mimeType: string;
  size: number;
  status: ResumeStatus;
  parsedText: string | null;
  atsScore: number | null;
  analysis: unknown | null;
  parserMetadata: ParserMetadata | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ResumeDocument = HydratedDocument<Resume>;

const resumeSchema = new Schema<Resume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RESUME_STATUS),
      default: RESUME_STATUS.UPLOADED,
      required: true,
    },
    parsedText: {
      type: String,
      default: null,
    },
    atsScore: {
      type: Number,
      default: null,
    },
    analysis: {
      type: Schema.Types.Mixed,
      default: null,
    },
    parserMetadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const ResumeModel = model<Resume>('Resume', resumeSchema);

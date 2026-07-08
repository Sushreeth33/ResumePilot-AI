import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import type { ParserMetadata } from '../../modules/resumes/resume.model.js';

type ParsePdfResult = {
  parsedText: string;
  parserMetadata: ParserMetadata;
};

function countWords(text: string) {
  const words = text.trim().match(/\S+/g);
  return words?.length ?? 0;
}

async function parsePdf(filePath: string): Promise<ParsePdfResult> {
  const fileBuffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: fileBuffer });

  try {
    const parsedPdf = await parser.getText();
    const parsedText = parsedPdf.text.trim();

    return {
      parsedText,
      parserMetadata: {
        parser: 'pdf-parse',
        pageCount: parsedPdf.total,
        wordCount: countWords(parsedText),
        characterCount: parsedText.length,
        parsedAt: new Date(),
        success: true,
        error: null,
      },
    };
  } finally {
    await parser.destroy();
  }
}

function createFailedMetadata(error: unknown): ParserMetadata {
  const message = error instanceof Error ? error.message : 'PDF parsing failed.';

  return {
    parser: 'pdf-parse',
    pageCount: null,
    wordCount: 0,
    characterCount: 0,
    parsedAt: new Date(),
    success: false,
    error: message,
  };
}

export const parsingService = {
  parsePdf,
  createFailedMetadata,
};

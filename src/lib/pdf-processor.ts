/**
 * PDF Processing Library
 * Extracts text and images from PDF documents for OCR processing
 */

import * as pdfjsLib from 'pdfjs-dist';
import { createCanvas } from 'canvas';

// Set up worker (required for pdfjs)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFPage {
  pageNumber: number;
  text: string;
  imageBuffer?: Buffer;
}

/**
 * Extract text and images from PDF document
 */
export async function extractFromPDF(
  pdfBuffer: Buffer,
  options: { extractImages?: boolean } = { extractImages: true }
): Promise<PDFPage[]> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    const pages: PDFPage[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .filter((item): item is pdfjsLib.TextItem => 'str' in item)
        .map((item) => item.str)
        .join(' ');

      let imageBuffer: Buffer | undefined;

      if (options.extractImages) {
        try {
          const viewport = page.getViewport({ scale: 2 });
          const canvas = createCanvas(viewport.width, viewport.height);
          const context = canvas.getContext('2d');

          await page.render({
            canvasContext: context as any,
            viewport,
          }).promise;

          imageBuffer = canvas.toBuffer('image/png');
        } catch (err) {
          console.warn(`Failed to extract image from page ${pageNum}:`, err);
        }
      }

      pages.push({
        pageNumber: pageNum,
        text,
        imageBuffer,
      });
    }

    return pages;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert PDF buffer to base64 string
 */
export function pdfToBase64(pdfBuffer: Buffer): string {
  return pdfBuffer.toString('base64');
}

/**
 * Convert base64 PDF string to Buffer
 */
export function base64ToPdf(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

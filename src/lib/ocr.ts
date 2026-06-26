/**
 * OCR Processing Library - Server-side implementation
 * Uses Tesseract.js for robust document text extraction
 */

import Tesseract from 'tesseract.js';
import { createCanvas } from 'canvas';

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: Tesseract.Block[];
}

/**
 * Extract text from image using Tesseract.js with optimized settings for invoices
 */
export async function extractTextFromImage(
  base64Image: string,
  languages: string[] = ['spa', 'eng']
): Promise<OCRResult> {
  try {
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const result = await Tesseract.recognize(imageBuffer, languages, {
      logger: (m) => {
        if (m.status === 'recognizing') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = result.data.text;
    const confidence = result.data.confidence;
    const blocks = result.data.blocks || [];

    await Tesseract.terminate();

    return {
      text,
      confidence,
      blocks,
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert PDF page to image buffer using canvas
 * (PDF is processed on backend via pdfjs-dist)
 */
export function canvasToPNG(canvas: any): Buffer {
  try {
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Canvas to PNG conversion error:', error);
    throw new Error('Failed to convert canvas to image');
  }
}

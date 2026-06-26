import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromImage } from './src/lib/ocr';
import { parseInvoiceText, formatInvoiceData, validateInvoiceData } from './src/lib/invoice-parser';
import { extractFromPDF, base64ToPdf } from './src/lib/pdf-processor';
import { ApiExtractRequest, ApiExtractResponse, ExtractedInvoiceData } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist/public')));

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Main extraction endpoint
 * POST /api/extract
 * Accepts: PDF or image file in base64
 * Returns: Extracted invoice data
 */
app.post('/api/extract', async (req: Request, res: Response) => {
  try {
    const { fileName, fileBase64, fileType } = req.body as ApiExtractRequest;

    if (!fileName || !fileBase64 || !fileType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fileName, fileBase64, fileType',
      } as ApiExtractResponse);
    }

    let ocrText = '';

    // Handle PDF files
    if (fileType === 'pdf') {
      try {
        const pdfBuffer = base64ToPdf(fileBase64);
        const pages = await extractFromPDF(pdfBuffer, { extractImages: true });

        // Extract text from all pages
        for (const page of pages) {
          ocrText += page.text + ' ';

          // If page has no text content but has image, apply OCR to image
          if (!page.text.trim() && page.imageBuffer) {
            try {
              const pageOCRResult = await extractTextFromImage(page.imageBuffer.toString('base64'));
              ocrText += pageOCRResult.text + ' ';
            } catch (err) {
              console.warn(`Failed to OCR page ${page.pageNumber}:`, err);
            }
          }
        }
      } catch (pdfError) {
        console.error('PDF extraction failed:', pdfError);
        return res.status(400).json({
          success: false,
          error: `Failed to process PDF: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`,
        } as ApiExtractResponse);
      }
    }

    // Handle image files (PNG, JPG, JPEG)
    else if (fileType === 'image') {
      try {
        const ocrResult = await extractTextFromImage(fileBase64);
        ocrText = ocrResult.text;
        console.log(`OCR Confidence: ${ocrResult.confidence}%`);
      } catch (imageError) {
        console.error('Image OCR failed:', imageError);
        return res.status(400).json({
          success: false,
          error: `Failed to process image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`,
        } as ApiExtractResponse);
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid fileType. Must be "pdf" or "image"',
      } as ApiExtractResponse);
    }

    // Parse extracted text into structured invoice data
    if (!ocrText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'No text could be extracted from the document',
      } as ApiExtractResponse);
    }

    const parsedData = parseInvoiceText(ocrText) as ExtractedInvoiceData;

    // Validate extracted data
    if (!validateInvoiceData(parsedData)) {
      console.warn('Extracted data failed validation, but returning partial results');
    }

    // Format numeric values
    const formattedData = formatInvoiceData(parsedData);

    return res.json({
      success: true,
      data: formattedData,
    } as ApiExtractResponse);
  } catch (error) {
    console.error('Extraction endpoint error:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    } as ApiExtractResponse);
  }
});

/**
 * Serve React app for all other routes
 */
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
});

// Start server
app.listen(PORT, HOST as any, () => {
  console.log(`\n🚀 Express Extractor Server Running`);
  console.log(`📍 http://${HOST}:${PORT}`);
  console.log(`🔧 API endpoint: http://${HOST}:${PORT}/api/extract`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;

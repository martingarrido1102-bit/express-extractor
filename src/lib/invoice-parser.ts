/**
 * Invoice Parser - Extract structured financial data from OCR text
 * Parses AFIP-compliant Argentine invoices and financial documents
 */

import { ExtractedInvoiceData } from '@types';

/**
 * Parse OCR-extracted text into structured invoice data
 */
export function parseInvoiceText(ocrText: string): Partial<ExtractedInvoiceData> {
  const data: Partial<ExtractedInvoiceData> = {};

  // Normalize text
  const normalizedText = ocrText.toUpperCase();

  // 1. Extract Comprobante Type (cod01)
  const comprobantePatterns = [
    /FACTURA\s+([AB])/,
    /NOTA\s+DE\s+CR[ÉE]DITO/,
    /TICKET/,
    /RECIBO/,
  ];

  for (const pattern of comprobantePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      data.cod01 = match[0].replace(/\s+/g, ' ').trim();
      break;
    }
  }

  // 2. Extract Punto Venta and Comprobante Number (e.g., "0001-00000123")
  const compNumberMatch = normalizedText.match(/(\d{4})[- ](\d{8})/);
  if (compNumberMatch) {
    data.puntoVenta = compNumberMatch[1];
    data.compNro = compNumberMatch[2];
  }

  // 3. Extract Emission Date (DD/MM/AAAA or DD-MM-AAAA)
  const dateMatch = normalizedText.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if (dateMatch) {
    data.fechaEmision = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
  }

  // 4. Extract CUIT Emisor (11 digits, format: XX-XXXXXXXX-X)
  const cuitEmitterMatch = normalizedText.match(/CUIT[:\s]+(\d{2})[- ](\d{8})[- ](\d{1})/);
  if (cuitEmitterMatch) {
    data.cuitEmisor = `${cuitEmitterMatch[1]}${cuitEmitterMatch[2]}${cuitEmitterMatch[3]}`;
  }

  // 5. Extract Razón Social Emisor
  const razonSocialMatch = normalizedText.match(
    /(?:RAZÓN SOCIAL|EMPRESA|EMISOR)[:\s]+([A-ZÁÉÍÓÚÑ\s\d.,&()]+?)(?:\n|CUIT|$)/i
  );
  if (razonSocialMatch) {
    data.razonSocialEmisor = razonSocialMatch[1].trim();
  }

  // 6. Extract CUIT Receptor
  const cuitReceptorMatch = normalizedText.match(/R\.?I\.?C\.?I\.?\s+(\d{2})[- ](\d{8})[- ](\d{1})/);
  if (cuitReceptorMatch) {
    data.cuitReceptor = `${cuitReceptorMatch[1]}${cuitReceptorMatch[2]}${cuitReceptorMatch[3]}`;
  }

  // 7. Extract Currency
  const currencyMatch = normalizedText.match(/(?:MONEDA|CURRENCY)[:\s]+([A-Z]{3})/);
  data.moneda = currencyMatch ? currencyMatch[1] : 'ARS';

  // 8. Extract Exchange Rate
  const tipoCambioMatch = normalizedText.match(/(?:TIPO DE CAMBIO|EXCHANGE RATE)[:\s]+([0-9.,]+)/);
  data.tipoCambio = tipoCambioMatch ? parseFloat(tipoCambioMatch[1].replace(',', '.')) : 1;

  // 9. Extract Monetary Amounts (Neto Gravado, IVAs, Otros, Total)
  const amountPatterns = {
    netoGravado: /(?:NETO|SUBTOTAL|SUB.TOTAL)[:\s]*\$?\s*([0-9.,]+)/i,
    iva21: /IVA\s+21\s*%?[:\s]*\$?\s*([0-9.,]+)/i,
    iva105: /IVA\s+10[.,]?5\s*%?[:\s]*\$?\s*([0-9.,]+)/i,
    otrosImpuestos: /(?:OTROS|PERCEPCIONES|OTROS IMPUESTOS)[:\s]*\$?\s*([0-9.,]+)/i,
    total: /(?:TOTAL|MONTO TOTAL|AMOUNT TOTAL)[:\s]*\$?\s*([0-9.,]+)/i,
  };

  for (const [key, pattern] of Object.entries(amountPatterns)) {
    const match = normalizedText.match(pattern);
    if (match) {
      (data as any)[key] = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    }
  }

  // Ensure numeric defaults
  data.tipoCambio = data.tipoCambio || 1;
  data.netoGravado = data.netoGravado || 0;
  data.iva21 = data.iva21 || 0;
  data.iva105 = data.iva105 || 0;
  data.otrosImpuestos = data.otrosImpuestos || 0;
  data.total = data.total || 0;

  // 10. Extract Concepto (first meaningful line after identification)
  const conceptMatch = normalizedText.match(/(?:CONCEPTO|DESCRIPCIÓN|DETALLE)[:\s]+([^\n]+)/i);
  data.concepto = conceptMatch ? conceptMatch[1].trim() : '';

  return data;
}

/**
 * Validate extracted invoice data completeness
 */
export function validateInvoiceData(data: Partial<ExtractedInvoiceData>): boolean {
  const requiredFields: (keyof ExtractedInvoiceData)[] = [
    'cod01',
    'puntoVenta',
    'compNro',
    'fechaEmision',
    'cuitEmisor',
    'total',
  ];

  return requiredFields.every((field) => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Format invoice data for display
 */
export function formatInvoiceData(data: ExtractedInvoiceData): ExtractedInvoiceData {
  return {
    ...data,
    netoGravado: Math.round(data.netoGravado * 100) / 100,
    iva21: Math.round(data.iva21 * 100) / 100,
    iva105: Math.round(data.iva105 * 100) / 100,
    otrosImpuestos: Math.round(data.otrosImpuestos * 100) / 100,
    total: Math.round(data.total * 100) / 100,
    tipoCambio: Math.round(data.tipoCambio * 10000) / 10000,
  };
}

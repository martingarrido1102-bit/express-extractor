/**
 * Esquema de datos extraídos de comprobantes fiscales
 */
export interface ExtractedInvoiceData {
  cod01: string; // Tipo de Comprobante (FACTURA A, FACTURA B, TICKET, NOTA DE CRÉDITO)
  puntoVenta: string; // 4 dígitos
  compNro: string; // 8 dígitos
  fechaEmision: string; // DD/MM/AAAA
  cuitEmisor: string; // 11 dígitos
  razonSocialEmisor: string;
  cuitReceptor: string; // 11 dígitos
  moneda: string; // ARS, USD, EUR, etc.
  tipoCambio: number;
  netoGravado: number;
  iva21: number;
  iva105: number;
  otrosImpuestos: number;
  total: number;
  concepto: string;
}

export interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  progress: number;
  error?: string;
  data?: ExtractedInvoiceData;
  createdAt: Date;
  completedAt?: Date;
}

export interface ApiExtractRequest {
  fileName: string;
  fileBase64: string;
  fileType: 'pdf' | 'image';
}

export interface ApiExtractResponse {
  success: boolean;
  data?: ExtractedInvoiceData;
  error?: string;
}

export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: string;
}

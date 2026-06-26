import { Language, Translations } from '@types';

const translations: Record<Language, Translations> = {
  es: {
    // Navbar
    'app.title': 'Express Extractor',
    'app.subtitle': 'IA Extractor Pro',
    'lang.toggle': 'ES | EN',
    'credits': 'Créditos',
    'quota': 'Cuota',

    // Upload Section
    'upload.title': 'Cargar Documentos',
    'upload.dragDrop': 'Arrastra archivos aquí o haz clic para seleccionar',
    'upload.supportedFormats': 'Formatos soportados: PDF, PNG, JPG, JPEG',
    'upload.button': 'Seleccionar Archivo',
    'upload.integrations': 'Integraciones en la Nube',
    'upload.googleDrive': 'Google Drive',
    'upload.oneDrive': 'OneDrive',
    'upload.dropbox': 'Dropbox',

    // Processing Queue
    'queue.title': 'Cola de Procesamiento',
    'queue.status.queued': 'EN COLA',
    'queue.status.processing': 'EXTRAYENDO...',
    'queue.status.completed': 'COMPLETADO',
    'queue.status.error': 'ERROR',

    // Table/Grid
    'table.title': 'Grilla Financiera',
    'table.comprobante': 'Comprobante',
    'table.fecha': 'Fecha',
    'table.emisor': 'Razón Social',
    'table.neto': 'Neto Gravado',
    'table.iva21': 'IVA 21%',
    'table.iva105': 'IVA 10.5%',
    'table.otros': 'Otros Impuestos',
    'table.total': 'Total',
    'table.concepto': 'Concepto',
    'table.search': 'Buscar...',
    'table.selectAll': 'Seleccionar todo',
    'table.delete': 'Eliminar',
    'table.deleteSelected': 'Eliminar seleccionados',

    // Footer/Totals
    'footer.totalNeto': 'Total Neto Gravado',
    'footer.totalIva': 'Total IVAs',
    'footer.totalOtros': 'Total Otros Impuestos',
    'footer.totalGeneral': 'Total General',

    // Export
    'export.title': 'Exportación',
    'export.excel': 'Descargar Excel (.xlsx)',
    'export.csv': 'Descargar CSV',
    'export.drive': 'Exportar a Google Drive',

    // Messages
    'msg.success': 'Procesado exitosamente',
    'msg.error': 'Error al procesar el archivo',
    'msg.loading': 'Cargando...',
  },
  en: {
    // Navbar
    'app.title': 'Express Extractor',
    'app.subtitle': 'IA Extractor Pro',
    'lang.toggle': 'ES | EN',
    'credits': 'Credits',
    'quota': 'Quota',

    // Upload Section
    'upload.title': 'Upload Documents',
    'upload.dragDrop': 'Drag files here or click to select',
    'upload.supportedFormats': 'Supported formats: PDF, PNG, JPG, JPEG',
    'upload.button': 'Select File',
    'upload.integrations': 'Cloud Integrations',
    'upload.googleDrive': 'Google Drive',
    'upload.oneDrive': 'OneDrive',
    'upload.dropbox': 'Dropbox',

    // Processing Queue
    'queue.title': 'Processing Queue',
    'queue.status.queued': 'QUEUED',
    'queue.status.processing': 'EXTRACTING...',
    'queue.status.completed': 'COMPLETED',
    'queue.status.error': 'ERROR',

    // Table/Grid
    'table.title': 'Financial Grid',
    'table.comprobante': 'Voucher',
    'table.fecha': 'Date',
    'table.emisor': 'Company Name',
    'table.neto': 'Net Taxable',
    'table.iva21': 'VAT 21%',
    'table.iva105': 'VAT 10.5%',
    'table.otros': 'Other Taxes',
    'table.total': 'Total',
    'table.concepto': 'Concept',
    'table.search': 'Search...',
    'table.selectAll': 'Select all',
    'table.delete': 'Delete',
    'table.deleteSelected': 'Delete selected',

    // Footer/Totals
    'footer.totalNeto': 'Total Net Taxable',
    'footer.totalIva': 'Total VATs',
    'footer.totalOtros': 'Total Other Taxes',
    'footer.totalGeneral': 'Grand Total',

    // Export
    'export.title': 'Export',
    'export.excel': 'Download Excel (.xlsx)',
    'export.csv': 'Download CSV',
    'export.drive': 'Export to Google Drive',

    // Messages
    'msg.success': 'Processed successfully',
    'msg.error': 'Error processing file',
    'msg.loading': 'Loading...',
  },
};

export const t = (key: string, language: Language = 'es'): string => {
  return translations[language]?.[key] ?? key;
};

export const getAvailableLanguages = (): Language[] => ['es', 'en'];

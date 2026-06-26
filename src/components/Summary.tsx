import React from 'react';
import { ExtractedInvoiceData } from '@types';

interface SummaryProps {
  data: ExtractedInvoiceData[];
}

export const Summary: React.FC<SummaryProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const totals = React.useMemo(() => {
    return {
      neto: data.reduce((sum, row) => sum + row.netoGravado, 0),
      iva21: data.reduce((sum, row) => sum + row.iva21, 0),
      iva105: data.reduce((sum, row) => sum + row.iva105, 0),
      otros: data.reduce((sum, row) => sum + row.otrosImpuestos, 0),
      total: data.reduce((sum, row) => sum + row.total, 0),
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-gradient-to-br from-slate-soft to-gray-100 rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Neto</p>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.neto)}</p>
        <p className="text-xs text-gray-500 mt-2">{data.length} comprobantes</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">IVA 21%</p>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(totals.iva21)}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <p className="text-xs text-purple-700 uppercase tracking-wide mb-1">IVA 10.5%</p>
        <p className="text-2xl font-bold text-purple-900">{formatCurrency(totals.iva105)}</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
        <p className="text-xs text-orange-700 uppercase tracking-wide mb-1">Otros</p>
        <p className="text-2xl font-bold text-orange-900">{formatCurrency(totals.otros)}</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
        <p className="text-xs text-red-700 uppercase tracking-wide font-semibold mb-1">Total General</p>
        <p className="text-2xl font-bold text-red-900">{formatCurrency(totals.total)}</p>
      </div>
    </div>
  );
};

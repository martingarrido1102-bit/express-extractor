import React from 'react';
import { ExtractedInvoiceData } from '@types';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface DataGridProps {
  data: ExtractedInvoiceData[];
  onDelete: (index: number) => void;
  onSelectAll: (selected: boolean) => void;
  onSelectRow: (index: number, selected: boolean) => void;
  selectedRows: Set<number>;
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  onDelete,
  onSelectAll,
  onSelectRow,
  selectedRows,
}) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof ExtractedInvoiceData;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof ExtractedInvoiceData) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const SortIcon = ({ isActive, direction }: { isActive: boolean; direction: 'asc' | 'desc' }) => {
    if (!isActive) return <div className="w-4 h-4" />;
    return direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary-red" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary-red" />
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 flex items-center gap-2"
              onClick={() => handleSort('compNro')}
            >
              Comprobante
              <SortIcon isActive={sortConfig?.key === 'compNro'} direction={sortConfig?.direction || 'asc'} />
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 flex items-center gap-2"
              onClick={() => handleSort('fechaEmision')}
            >
              Fecha
              <SortIcon isActive={sortConfig?.key === 'fechaEmision'} direction={sortConfig?.direction || 'asc'} />
            </th>
            <th className="px-4 py-3 text-left">Razón Social</th>
            <th
              className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200 flex items-center justify-end gap-2"
              onClick={() => handleSort('netoGravado')}
            >
              Neto
              <SortIcon isActive={sortConfig?.key === 'netoGravado'} direction={sortConfig?.direction || 'asc'} />
            </th>
            <th
              className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200 flex items-center justify-end gap-2"
              onClick={() => handleSort('iva21')}
            >
              IVA 21%
              <SortIcon isActive={sortConfig?.key === 'iva21'} direction={sortConfig?.direction || 'asc'} />
            </th>
            <th className="px-4 py-3 text-right">IVA 10.5%</th>
            <th className="px-4 py-3 text-right">Otros</th>
            <th
              className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200 flex items-center justify-end gap-2"
              onClick={() => handleSort('total')}
            >
              Total
              <SortIcon isActive={sortConfig?.key === 'total'} direction={sortConfig?.direction || 'asc'} />
            </th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.has(idx)}
                  onChange={(e) => onSelectRow(idx, e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                {row.puntoVenta}-{row.compNro}
              </td>
              <td className="px-4 py-3 text-gray-600">{row.fechaEmision}</td>
              <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.razonSocialEmisor}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.netoGravado)}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.iva21)}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.iva105)}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.otrosImpuestos)}</td>
              <td className="px-4 py-3 text-right font-semibold text-primary-red">{formatCurrency(row.total)}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDelete(idx)}
                  className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="w-full py-12 text-center text-gray-500">
          <p>No hay datos para mostrar. Carga un documento para comenzar.</p>
        </div>
      )}
    </div>
  );
};

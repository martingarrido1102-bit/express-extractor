import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const supportedFormats = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!supportedFormats.includes(file.type)) {
      setError('Formato de archivo no soportado. Usa PDF, PNG o JPG');
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 50MB');
      return false;
    }
    setError('');
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-red bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-primary-red hover:bg-red-50'
        }`}
      >
        <input
          type="file"
          multiple={false}
          onChange={handleChange}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          id="file-input"
          disabled={isLoading}
        />

        <label htmlFor="file-input" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            {dragActive ? (
              <>
                <Upload className="w-12 h-12 text-primary-red animate-bounce" />
                <p className="text-lg font-semibold text-primary-red">Suelta el archivo aquí</p>
              </>
            ) : (
              <>
                <div className="flex gap-4 justify-center mb-2">
                  <FileText className="w-10 h-10 text-gray-400" />
                  <Image className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500">PDF, PNG, JPG (máx. 50MB)</p>
              </>
            )}
          </div>
        </label>

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

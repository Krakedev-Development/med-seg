import { useState } from 'react';
import Button from '@shared/ui/atoms/Button';

// Iconos simples SVG
const Upload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);
const File = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FileUpload = ({ onFileUpload, acceptedFileTypes = '.pdf' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile, previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      // Reset input
      const input = document.getElementById('file-input');
      if (input) input.value = '';
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    const input = document.getElementById('file-input');
    if (input) input.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          id="file-input"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            {selectedFile ? selectedFile.name : 'Haz clic para seleccionar archivo PDF'}
          </span>
        </label>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <File className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </span>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <Button
            onClick={handleUpload}
            variant="primary"
            className="w-full"
          >
            Subir Archivo
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;


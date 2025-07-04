// src/components/verification/DocumentUploader.tsx

import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface DocumentUploaderProps {
  label: string;
  onFileSelect: (file: File | null) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ label, onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-texto-normal mb-2">{label}</label>
      <div
        onClick={() => !preview && inputRef.current?.click()}
        className={`relative w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors
          ${preview ? 'border-realce/50' : 'border-[#1E1E1E] hover:border-realce/50 cursor-pointer'}`
        }
      >
        {preview ? (
          <>
            <img src={preview} alt="Pré-visualização" className="w-full h-full object-contain rounded-lg p-2" />
            <button
              onClick={handleRemove}
              className="absolute -top-3 -right-3 w-8 h-8 bg-fundo-card border-2 border-[#1E1E1E] rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center text-texto-normal/70">
            <UploadCloud size={32} className="mx-auto" />
            <p className="mt-2">Clique para enviar</p>
            <p className="text-xs">PNG, JPG ou PDF</p>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, application/pdf"
        />
      </div>
    </div>
  );
};
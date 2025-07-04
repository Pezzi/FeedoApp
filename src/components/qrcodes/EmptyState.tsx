// src/components/qrcodes/EmptyState.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Plus } from 'lucide-react';

// A interface agora define as props que podemos passar
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon = QrCode, // Usa QrCode como ícone padrão se nenhum for passado
  title, 
  message, 
  buttonText, 
  buttonLink 
}) => {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-[#1E1E1E] rounded-2xl">
      <Icon className="mx-auto h-12 w-12 text-texto-normal/30" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-texto-normal/70 max-w-sm mx-auto">
        {message}
      </p>
      {buttonText && buttonLink && (
        <div className="mt-6">
          <Link
            to={buttonLink}
            className="inline-flex items-center gap-2 bg-realce text-fundo-card font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            {buttonText}
          </Link>
        </div>
      )}
    </div>
  );
};
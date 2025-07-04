// src/components/forms/StyledSelect.tsx

import React from 'react';
import { ChevronDown } from 'lucide-react';

// Usamos 'Omit' para poder passar todas as props de um <select> normal, exceto 'className'
// Também incluímos 'children' para que as tags <option> funcionem
type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> & {
  children: React.ReactNode;
};

export const StyledSelect: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <div className="relative w-full">
      <select
        {...props}
        // A classe 'appearance-none' remove a seta padrão do navegador
        className="w-full appearance-none bg-fundo-card border border-[#1E1E1E] text-texto-normal rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-realce/50 transition-all disabled:opacity-50"
      >
        {children}
      </select>
      {/* Adicionamos nossa própria seta customizada para consistência visual */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
        <ChevronDown className="h-5 w-5 text-texto-normal/70" />
      </div>
    </div>
  );
};
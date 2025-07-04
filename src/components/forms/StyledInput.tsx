// src/components/forms/StyledInput.tsx

import React from 'react';

// 1. Alteramos o tipo para aceitar a prop 'className'
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const StyledInput: React.FC<InputProps> = ({ className, ...props }) => {
  
  // 2. Definimos os estilos base do nosso input
  const baseStyles = "w-full bg-fundo-card border border-[#1E1E1E] text-texto-normal rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-realce/50 transition-all";

  // 3. Juntamos os estilos base com qualquer classe extra que for passada (como o padding 'pl-12')
  const combinedStyles = `${baseStyles} ${className || ''}`;

  return (
    <input
      {...props}
      className={combinedStyles}
    />
  );
};
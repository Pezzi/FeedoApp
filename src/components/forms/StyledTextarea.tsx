// src/components/forms/StyledTextarea.tsx
import React from 'react';

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

export const StyledTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      {...props}
      rows={4}
      className="w-full bg-fundo-card border border-[#1E1E1E] text-texto-normal rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-realce/50 transition-all"
    />
  );
};
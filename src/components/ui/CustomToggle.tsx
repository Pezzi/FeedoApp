// src/components/ui/CustomToggle.tsx

import React from 'react';

interface CustomToggleProps {
  isOn: boolean;
  handleToggle: () => void;
  isLoading?: boolean;
}

export const CustomToggle: React.FC<CustomToggleProps> = ({ isOn, handleToggle, isLoading = false }) => {
  return (
    <label htmlFor="custom-toggle" className="flex items-center cursor-pointer">
      <div className="relative">
        {/* O input real do tipo checkbox fica escondido, mas garante a acessibilidade */}
        <input 
          id="custom-toggle" 
          type="checkbox" 
          className="sr-only" 
          checked={isOn} 
          onChange={handleToggle}
          disabled={isLoading}
        />
        {/* O fundo do toggle */}
        <div className={`block w-14 h-8 rounded-full transition-colors ${
          isOn ? 'bg-realce' : 'bg-notificacao'
        } ${isLoading ? 'opacity-50' : ''}`}></div>
        {/* A bolinha (thumb) do toggle */}
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          isOn ? 'transform translate-x-6' : ''
        }`}></div>
      </div>
    </label>
  );
};
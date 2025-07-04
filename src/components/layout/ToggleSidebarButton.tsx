// src/components/layout/ToggleSidebarButton.tsx

import React from 'react';
import { ChevronsLeft } from 'lucide-react';

interface ToggleSidebarButtonProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const ToggleSidebarButton: React.FC<ToggleSidebarButtonProps> = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="hidden md:flex absolute top-5 z-50 w-8 h-8 items-center justify-center
                 bg-fundo-card border border-[#1E1E1E] rounded-full
                 text-texto-normal/70 hover:text-realce hover:border-realce/50
                 transition-all duration-300 ease-in-out"
      // A posição 'left' muda com base no estado da sidebar
      style={{ left: isCollapsed ? '68px' : '244px' }}
      title={isCollapsed ? "Expandir menu" : "Recolher menu"}
    >
      <ChevronsLeft 
        size={18} 
        className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} 
      />
    </button>
  );
};
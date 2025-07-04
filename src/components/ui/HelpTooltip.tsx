// src/components/ui/HelpTooltip.tsx

import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Mantém os estilos base para posicionamento
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ content }) => {
  return (
    <Tippy 
      // A mágica acontece aqui: passamos um componente React completo como conteúdo
      content={
        <div className="rounded-xl border border-[#1E1E1E] bg-fundo-card/60 p-3 text-left text-sm font-medium text-texto-normal/90 shadow-lg backdrop-blur-lg max-w-[250px]">
          {content}
        </div>
      }
      // As props abaixo controlam o comportamento do Tippy
      placement="top"
      animation="fade"
      duration={200}
      // appendTo={() => document.body} // Descomente se tiver problemas de sobreposição
    >
      <button type="button" className="cursor-pointer text-texto-normal/50 hover:text-realce transition-colors">
        <HelpCircle size={16} />
      </button>
    </Tippy>
  );
};
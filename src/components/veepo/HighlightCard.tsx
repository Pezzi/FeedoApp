// src/components/veepo/HighlightCard.tsx

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface HighlightCardProps {
  rank: number;
  avatarUrl: string;
  name: string;
  score: number | string;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({ rank, avatarUrl, name, score }) => {
  return (
    <div className="text-center group">
      <div className="relative w-24 h-24 mx-auto">
        <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover border-2 border-[#1E1E1E] group-hover:border-realce transition-colors" />
        <div className="absolute -top-1 -left-1 w-8 h-8 bg-fundo-card rounded-full flex items-center justify-center font-bold text-white border-2 border-[#1E1E1E]">
          {rank}
        </div>
      </div>
      <div className="mt-3">
        <h5 className="font-semibold text-white truncate group-hover:text-realce transition-colors">{name}</h5>
        <h6 className="text-sm text-texto-normal/80 flex items-center justify-center gap-1">
          <TrendingUp size={14} className="text-realce" /> {score} NPS
        </h6>
      </div>
    </div>
  );
};
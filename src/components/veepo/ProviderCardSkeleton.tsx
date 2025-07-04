// src/components/veepo/ProviderCardSkeleton.tsx

import React from 'react';

export const ProviderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-fundo-card rounded-2xl shadow-lg border border-[#1E1E1E] animate-pulse">
      <div className="h-32 bg-white/5 rounded-t-2xl"></div>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-16 h-16 mt-[-48px] rounded-full bg-white/5 border-4 border-fundo-card flex-shrink-0"></div>
          <div className="flex-1 space-y-2 pt-2">
            <div className="h-5 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-white/10 rounded"></div>
            <div className="h-3 bg-white/10 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="h-10 bg-white/5 rounded-lg"></div>
            <div className="h-10 bg-white/5 rounded-lg"></div>
        </div>
        <div className="pt-4 mt-auto border-t border-[#1E1E1E]">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
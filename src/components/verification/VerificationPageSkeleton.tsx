// src/components/verification/VerificationPageSkeleton.tsx

import React from 'react';

export const VerificationPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
      <div className="bg-fundo-card p-8 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/5"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-white/10 rounded w-1/4"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="bg-fundo-card p-8 rounded-2xl space-y-6">
        <div className="h-5 bg-white/10 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-white/5 rounded-lg"></div>
          <div className="h-32 bg-white/5 rounded-lg"></div>
        </div>
        <div className="h-12 bg-realce/20 rounded-lg w-48 ml-auto"></div>
      </div>
    </div>
  );
};
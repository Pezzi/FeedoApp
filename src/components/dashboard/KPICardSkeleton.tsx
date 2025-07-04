import React from 'react';

export const KPICardSkeleton: React.FC = () => {
  return (
    <div className="bg-fundo-card p-6 rounded-2xl shadow-lg animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
      <div className="h-8 bg-white/10 rounded w-1/2"></div>
    </div>
  );
};
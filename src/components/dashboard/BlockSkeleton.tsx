// src/components/dashboard/BlockSkeleton.tsx

import React from 'react';

interface BlockSkeletonProps {
  className?: string;
}

export const BlockSkeleton: React.FC<BlockSkeletonProps> = ({ className }) => {
  return (
    <div className={`p-6 rounded-2xl bg-fundo-card shadow-lg animate-pulse flex flex-col ${className}`}>
      {/* CORRIGIDO: Substituído 'bg-gray-700/50' por 'bg-white/10' */}
      <div className="h-5 bg-white/10 rounded w-1/3 mb-5"></div>
      <div className="h-full bg-white/10 rounded"></div>
    </div>
  );
};
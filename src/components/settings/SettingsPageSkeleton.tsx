// src/components/settings/SettingsPageSkeleton.tsx

import React from 'react';

export const SettingsPageSkeleton: React.FC = () => {
  const SkeletonCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-fundo-card p-8 rounded-2xl shadow-lg space-y-6 animate-pulse">
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Skeleton para Header */}
      <div>
        <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
      {/* Skeleton para o card de Imagens */}
      <SkeletonCard>
        <div className="h-5 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="relative h-40 rounded-lg bg-white/5 mb-[-60px]"></div>
        <div className="relative w-32 h-32 rounded-full border-4 border-fundo-card bg-white/5 mx-auto"></div>
      </SkeletonCard>
      {/* Skeleton para o card de Informações */}
      <SkeletonCard>
        <div className="h-5 bg-white/10 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><div className="h-4 w-1/4 bg-white/10 rounded"></div><div className="h-12 bg-white/5 rounded-lg"></div></div>
          <div className="space-y-2"><div className="h-4 w-1/4 bg-white/10 rounded"></div><div className="h-12 bg-white/5 rounded-lg"></div></div>
          <div className="md:col-span-2 space-y-2"><div className="h-4 w-1/5 bg-white/10 rounded"></div><div className="h-24 bg-white/5 rounded-lg"></div></div>
        </div>
      </SkeletonCard>
    </div>
  );
};
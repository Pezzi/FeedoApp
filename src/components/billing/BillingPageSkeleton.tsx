// src/components/billing/BillingPageSkeleton.tsx

import React from 'react';

export const BillingPageSkeleton: React.FC = () => {
  const SkeletonCard = () => (
    <div className="bg-fundo-card p-8 rounded-2xl animate-pulse space-y-6">
      <div className="h-5 w-1/3 bg-white/10 rounded"></div>
      <div className="h-10 w-1/2 bg-white/10 rounded"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-white/10 rounded"></div>
        <div className="h-4 w-3/4 bg-white/10 rounded"></div>
        <div className="h-4 w-4/5 bg-white/10 rounded"></div>
      </div>
      <div className="h-12 w-full bg-white/10 rounded-lg mt-8"></div>
    </div>
  );
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
      <div className="h-12 w-64 bg-white/10 rounded-lg mx-auto"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};
// src/components/feedbacks/FeedbackCardSkeleton.tsx

import React from 'react';

export const FeedbackCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#1E1E1E] p-4 rounded-xl flex items-center justify-between animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-5 bg-white/10 rounded w-1/4"></div>
          <div className="h-5 bg-white/10 rounded-full w-20"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
      </div>
      <div className="h-10 w-10 bg-white/10 rounded-lg"></div>
    </div>
  );
};
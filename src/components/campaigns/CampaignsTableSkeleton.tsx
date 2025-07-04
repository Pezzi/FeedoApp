// src/components/campaigns/CampaignsTableSkeleton.tsx

import React from 'react';

const SkeletonRow: React.FC = () => (
  <tr className="border-b border-[#1E1E1E]">
    <td className="px-6 py-4">
      <div className="h-6 w-20 bg-white/10 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-white/10 rounded w-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex justify-end gap-2">
        <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
        <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
        <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
      </div>
    </td>
  </tr>
);

export const CampaignsTableSkeleton: React.FC = () => {
  return (
    <tbody className="animate-pulse">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </tbody>
  );
};
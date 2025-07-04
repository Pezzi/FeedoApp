import React from 'react';

export const QRCodeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-fundo-card p-6 rounded-2xl shadow-lg animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-5 bg-white/10 rounded w-32"></div>
            <div className="h-3 bg-white/10 rounded w-40"></div>
          </div>
          <div className="h-6 bg-white/10 rounded-full w-20"></div>
        </div>
        <div className="my-6 flex items-center justify-center">
          <div className="w-36 h-36 bg-white/10 rounded-lg"></div>
        </div>
        <div className="flex justify-around border-y border-[#1E1E1E] py-3">
          <div className="text-center w-1/3 space-y-2"><div className="h-7 bg-white/10 rounded w-12 mx-auto"></div><div className="h-3 bg-white/10 rounded w-10 mx-auto"></div></div>
          <div className="text-center w-1/3 space-y-2"><div className="h-7 bg-white/10 rounded w-12 mx-auto"></div><div className="h-3 bg-white/10 rounded w-10 mx-auto"></div></div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-1">
        <div className="w-8 h-8 bg-white/10 rounded-md"></div>
        <div className="w-8 h-8 bg-white/10 rounded-md"></div>
        <div className="w-8 h-8 bg-white/10 rounded-md"></div>
      </div>
    </div>
  );
};
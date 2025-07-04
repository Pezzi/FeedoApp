// src/components/dashboard/KPICard.tsx

import React from 'react';

export const KPICard = ({ title, value }: {
  title: string;
  value: string | number;
}) => {
  return (
    // 1. ANIMAÇÃO ADICIONADA: Adicionei as classes de transição e hover aqui.
    <div className="p-6 rounded-2xl bg-fundo-card shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl">
      <div>
        {/* O título já estava correto com a cor de realce */}
        <h3 className="text-sm font-semibold mb-2 text-realce">{title}</h3>
        
        {/* 2. AJUSTE DE COR: Mudei para 'text-white' para dar mais destaque ao número, como no seu print. */}
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};
// src/components/profile/ReviewCard.tsx

import React from 'react';
import { Star } from 'lucide-react';

// Tipo ajustado para corresponder à sua tabela
export type Feedback = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  customer_name?: string | null; // <-- CORRIGIDO AQUI
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};


export const ReviewCard: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  const formattedDate = new Date(feedback.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-fundo p-4 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        {/* Usando customer_name e um fallback */}
        <h4 className="font-bold text-white">{feedback.customer_name || 'Cliente Anônimo'}</h4>
        <StarRating rating={feedback.rating} />
      </div>
      <p className="text-gray-300 text-sm mb-3">
        {feedback.comment || 'Nenhum comentário fornecido.'}
      </p>
      <p className="text-xs text-gray-500 text-right">{formattedDate}</p>
    </div>
  );
};
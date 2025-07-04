// src/components/feedbacks/FeedbackCard.tsx

import React from 'react';
import { Archive, Star } from 'lucide-react';
// CORREÇÃO: O caminho do import foi ajustado para encontrar o componente na pasta do dashboard
import { SentimentBadge } from '../dashboard/feedbacks/SentimentBadge'; 
import type { Feedback } from '../../hooks/useFeedbacks';

interface FeedbackCardProps {
  feedback: Feedback;
  onArchiveToggle: () => void;
  isArchived: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onArchiveToggle, isArchived }) => {
  return (
    <div className="bg-[#1E1E1E] p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-realce/50 transition-colors">
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-3">
          <p className="font-bold text-white truncate">{feedback.customer_name || 'Anônimo'}</p>
          <SentimentBadge sentiment={feedback.sentiment} />
        </div>
        <p className="text-sm text-texto-normal/80 line-clamp-1 mt-1">{feedback.comment}</p>
      </div>
      <div className="flex items-center gap-4 pl-4">
        {feedback.rating && (
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <span>{feedback.rating}</span>
            <Star size={16} className="fill-amber-400" />
          </div>
        )}
        <button
          onClick={onArchiveToggle}
          className="p-2 text-texto-normal/70 hover:text-white rounded-lg transition-colors bg-fundo-card hover:bg-white/10"
          title={isArchived ? 'Desarquivar' : 'Arquivar'}
        >
          <Archive size={18} />
        </button>
      </div>
    </div>
  );
};
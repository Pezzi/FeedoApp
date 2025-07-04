import React from 'react';
import { Smile, Frown, Meh } from 'lucide-react';

// Define os tipos de sentimento que podemos receber
type Sentiment = 'positivo' | 'negativo' | 'neutro' | null | undefined;

// Objeto de configuração para facilitar a renderização
const sentimentConfig = {
  positivo: {
    text: 'Positivo',
    Icon: Smile,
    className: 'bg-green-500/10 text-green-400 border border-green-500/20',
  },
  negativo: {
    text: 'Negativo',
    Icon: Frown,
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  neutro: {
    text: 'Neutro',
    Icon: Meh,
    className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  },
};

interface SentimentBadgeProps {
  sentiment: Sentiment;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  // Se o sentimento ainda não foi analisado (é nulo ou indefinido), não renderiza nada.
  if (!sentiment) {
    return null;
  }

  const config = sentimentConfig[sentiment];
  if (!config) return null; // Segurança caso o valor seja inesperado

  return (
    <div
      className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${config.className}`}
    >
      <config.Icon className="h-3.5 w-3.5" />
      {config.text}
    </div>
  );
};
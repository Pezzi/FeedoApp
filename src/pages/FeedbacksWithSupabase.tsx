// src/pages/Feedbacks.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MessageSquare } from 'lucide-react';
import { useFeedbacks } from '../hooks/useFeedbacks';

// Nossos novos componentes
import { FeedbackCard } from '../components/feedbacks/FeedbackCard';
import { FeedbackCardSkeleton } from '../components/feedbacks/FeedbackCardSkeleton';
import { EmptyState } from '../components/qrcodes/EmptyState'; // Reutilizando

export const Feedbacks: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'active' | 'archived'>('active');
  
  const { 
    feedbacks, 
    loading, 
    error, 
    setFilters,
    archiveFeedback, 
    unarchiveFeedback,
    refetch
  } = useFeedbacks({ 
    status: activeFilter === 'active' ? ['pending', 'responded'] : ['archived']
  });

  const handleFilterClick = (filter: 'active' | 'archived') => {
    setActiveFilter(filter);
    // O hook já reage a mudança no 'status', então não precisamos chamar setFilters aqui.
    // A query no hook será refeita automaticamente.
  };

  if (error && !loading) {
    return <div className="p-6 text-red-400">Erro ao carregar feedbacks: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-realce">Sistema de Feedbacks</h1>
        <p className="text-texto-normal/70">Gerencie e responda aos feedbacks dos seus clientes.</p>
      </motion.div>

      {/* Container Principal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="p-6 rounded-2xl bg-fundo-card">
          <div className="flex items-center justify-between mb-6">
            {/* Filtros */}
            <div className="flex space-x-2 p-1 bg-[#1E1E1E] rounded-lg">
              <button 
                onClick={() => handleFilterClick('active')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'active' ? 'bg-realce text-fundo-card' : 'text-texto-normal/70 hover:bg-white/5'}`}
              >
                Ativos
              </button>
              <button 
                onClick={() => handleFilterClick('archived')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'archived' ? 'bg-realce text-fundo-card' : 'text-texto-normal/70 hover:bg-white/5'}`}
              >
                Arquivados
              </button>
            </div>
            {/* Botão de Atualizar */}
            <button onClick={() => refetch()} disabled={loading} className="p-2 rounded-lg hover:bg-white/10 text-texto-normal/80" title="Atualizar feedbacks">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Lista de Feedbacks ou Skeletons */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <FeedbackCardSkeleton key={index} />)
            ) : feedbacks.length === 0 ? (
              <EmptyState 
                icon={MessageSquare}
                title={`Nenhum feedback ${activeFilter === 'archived' ? 'arquivado' : 'ativo'}`}
                message="Quando novos feedbacks chegarem, eles aparecerão aqui."
              />
            ) : (
              feedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <FeedbackCard 
                    feedback={feedback}
                    isArchived={activeFilter === 'archived'}
                    onArchiveToggle={() => activeFilter === 'archived' ? unarchiveFeedback(feedback.id) : archiveFeedback(feedback.id)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
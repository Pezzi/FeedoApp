// src/components/veepo/ProviderCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Phone, User } from 'lucide-react';

// Ajuste o caminho do import se o seu tipo Provider estiver em outro lugar
import type { Provider } from '../../hooks/useProviders';

interface ProviderCardProps {
  provider: Provider;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    // 👇 O Link do react-router-dom envolve todo o card 👇
    <Link to={`/veeper/${provider.id}`} className="block group">
      <div className="bg-fundo-card rounded-2xl p-6 space-y-4 transition-all group-hover:ring-2 group-hover:ring-realce group-hover:shadow-lg">
        
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-fundo flex-shrink-0 flex items-center justify-center">
              {provider.avatar_url ? (
                <img src={provider.avatar_url} alt={provider.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-2xl font-bold text-realce">{provider.name?.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white">{provider.name}</h3>
              <p className="text-sm text-texto-normal/80">{provider.segment || 'Agências de Publicidade'}</p>
            </div>
          </div>
          {provider.is_available && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span className="text-xs text-green-400 font-medium">Disponível</span>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 !my-4"></div>

        {/* Métricas */}
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xs text-texto-normal/70">Avaliação</p>
            <p className="font-bold text-white flex items-center justify-center gap-1 mt-1"><Star size={16} className="text-yellow-400" /> -</p>
          </div>
          <div>
            <p className="text-xs text-texto-normal/70">NPS</p>
            <p className="font-bold text-white flex items-center justify-center gap-1 mt-1"><TrendingUp size={16} className="text-blue-400" /> -</p>
          </div>
        </div>

      </div>
    </Link>
  );
};
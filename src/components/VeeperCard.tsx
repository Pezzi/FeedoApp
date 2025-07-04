// src/components/VeeperCard.tsx

import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

type Profile = {
  id: string;
  name?: string | null;
  avatar_url?: string | null;
  latitude?: number | null;   // <-- Adicione esta linha
  longitude?: number | null;  // <-- Adicione esta linha
};

interface VeeperCardProps {
  veeper: Profile;
}

export const VeeperCard: React.FC<VeeperCardProps> = ({ veeper }) => {
  // O console.log deve estar AQUI, DENTRO da função do componente,
  // depois que a propriedade 'veeper' foi recebida.
  console.log("Dados recebidos pelo VeeperCard:", veeper);

  return (
    <Link to={`/veeper/${veeper.id}`} className="block w-full">
      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
        <div className="w-12 h-12 rounded-full bg-fundo flex-shrink-0">
          {veeper.avatar_url ? (
            <img src={veeper.avatar_url} alt={veeper.name || 'Avatar'} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-fundo-card">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-white truncate">{veeper.name || 'Veeper Anônimo'}</h3>
          <p className="text-sm text-gray-400 truncate">Especialidade a definir</p>
        </div>
      </div>
    </Link>
  );
};

export type { Profile };
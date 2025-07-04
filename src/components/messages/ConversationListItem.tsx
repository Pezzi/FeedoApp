// src/components/messages/ConversationListItem.tsx

import React from 'react';
import { User } from 'lucide-react';

export type Conversation = {
  conversation_id: string;
  other_participant_name: string | null;
  other_participant_avatar_url: string | null;
  // O other_participant_id não é mais necessário aqui, mas não faz mal se vier
};

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isSelected, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
        isSelected ? 'bg-realce/20' : 'hover:bg-white/5'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-fundo flex-shrink-0">
        {conversation.other_participant_avatar_url ? (
          <img src={conversation.other_participant_avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full flex items-center justify-center bg-fundo-card">
            <User className="h-6 w-6 text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {/* Agora mostramos o nome real, com um fallback para 'Usuário' */}
        <h3 className="font-bold text-white truncate">{conversation.other_participant_name || 'Usuário'}</h3>
        <p className="text-sm text-gray-400 truncate">Última mensagem...</p>
      </div>
    </button>
  );
};
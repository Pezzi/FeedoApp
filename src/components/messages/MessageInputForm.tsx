// src/components/messages/MessageInputForm.tsx

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputFormProps {
  onSubmit: (messageText: string) => void;
  isLoading: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText(''); // Limpa o campo após o envio
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full p-2.5 rounded-md bg-fundo text-white border border-white/10 focus:border-realce focus:ring-0 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-3 rounded-md bg-realce text-fundo-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};
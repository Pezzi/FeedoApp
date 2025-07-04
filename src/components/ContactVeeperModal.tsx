// src/components/ContactVeeperModal.tsx

import React, { useState } from 'react';

interface ContactVeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  veeperName: string;
}

export const ContactVeeperModal: React.FC<ContactVeeperModalProps> = ({ isOpen, onClose, onSubmit, veeperName }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);
    await onSubmit(message);
    // Não vamos fechar a modal aqui, para que o usuário veja a confirmação do alert.
    // O usuário fechará manualmente clicando em 'Cancelar' ou no fundo.
    setIsLoading(false);
  };

  return (
    // Fundo semi-transparente com blur
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose} // Permite fechar clicando no fundo
    >
      {/* Container principal da modal com as cores corretas */}
      <div 
        className="bg-fundo-card rounded-2xl shadow-xl p-6 w-full max-w-lg border border-white/10"
        onClick={(e) => e.stopPropagation()} // Impede que o clique na modal a feche
      >
        <h2 className="text-xl font-bold text-white mb-2">Enviar mensagem para</h2>
        <p className="text-realce font-semibold mb-6">{veeperName}</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva sua primeira mensagem..."
            // Estilo do campo de texto alinhado com o resto da app
            className="w-full h-32 p-3 rounded-md bg-fundo text-texto-normal border border-white/10 focus:border-realce focus:ring-1 focus:ring-realce focus:outline-none transition-colors"
            required
          />
          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-lg text-texto-normal hover:bg-white/10 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="px-5 py-2.5 rounded-lg bg-realce text-fundo-card font-bold disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// src/components/messages/ChatMessage.tsx

import React from 'react';

type MessageProps = {
  content: string;
  isSentByMe: boolean;
};

export const ChatMessage: React.FC<MessageProps> = ({ content, isSentByMe }) => {
  // Define as classes de estilo com base em quem enviou a mensagem
  const wrapperClasses = `flex ${isSentByMe ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
    isSentByMe 
      ? 'bg-realce text-fundo-card' 
      : 'bg-fundo-card'
  }`;

  return (
    <div className={wrapperClasses}>
      <div className={bubbleClasses}>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};
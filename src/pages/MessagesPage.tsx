// src/pages/MessagesPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import { ConversationListItem, type Conversation } from '../components/messages/ConversationListItem';
import { ChatMessage } from '../components/messages/ChatMessage';
import { MessageInputForm } from '../components/messages/MessageInputForm';
import { Loader2 } from 'lucide-react';

// Tipo para uma mensagem individual
type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  conversation_id: string;
};

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito para rolar para a mensagem mais recente
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Efeito para buscar a lista inicial de conversas
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const { data, error } = await supabase.rpc('get_my_conversations');
        if (error) throw error;
        setConversations(data || []);
      } catch (err) {
        console.error("Erro ao buscar conversas:", err);
      } finally {
        setLoadingConversations(false);
      }
    };
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Efeito para buscar as mensagens da conversa selecionada
  useEffect(() => {
    if (!selectedConversationId) return;
    
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedConversationId)
          .order('created_at', { ascending: true });
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedConversationId]);
  
  // Efeito para tempo real
  useEffect(() => {
    if (!selectedConversationId) return;
    const channel = supabase.channel(`public:messages:conversation_id=eq.${selectedConversationId}`);
    channel
      .on<Message>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversationId}` },
        (payload) => {
          // Adiciona a mensagem apenas se ela não for do próprio usuário (para evitar duplicatas)
          if (payload.new.sender_id !== user?.id) {
            setMessages(currentMessages => [...currentMessages, payload.new]);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedConversationId, user?.id]);
  
  // Função para enviar uma nova mensagem
  const handleSendMessage = async (messageText: string) => {
    if (!selectedConversationId || !user) return;
    setSendingMessage(true);
    const newMessage = {
      conversation_id: selectedConversationId,
      sender_id: user.id,
      content: messageText,
    };
    // Adiciona a mensagem à UI otimisticamente
    setMessages(currentMessages => [...currentMessages, { ...newMessage, id: 'temp-' + Date.now(), created_at: new Date().toISOString() }]);
    const { error } = await supabase.from('messages').insert(newMessage);
    if (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Sua mensagem não pôde ser enviada.");
      // Remove a mensagem otimista em caso de erro
      setMessages(currentMessages => currentMessages.filter(m => m.id !== 'temp-' + Date.now()));
    }
    setSendingMessage(false);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-fundo-card rounded-2xl overflow-hidden border border-white/10">
      {/* Painel da Esquerda: Lista de Conversas */}
      <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">Mensagens</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingConversations ? (
            <div className="flex justify-center items-center h-full text-gray-400"> <Loader2 className="animate-spin mr-2" /> Carregando...</div>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Nenhuma conversa encontrada.</p>
          ) : (
            conversations.map(convo => (
              <ConversationListItem
                key={convo.conversation_id}
                conversation={convo}
                isSelected={selectedConversationId === convo.conversation_id}
                onClick={() => setSelectedConversationId(convo.conversation_id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Painel da Direita: Chat Ativo */}
      <div className="hidden md:flex w-2/3 flex-col">
        {selectedConversationId ? (
          <>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full text-gray-400"> <Loader2 className="animate-spin mr-2" /> Carregando mensagens...</div>
              ) : (
                <>
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} content={msg.content} isSentByMe={msg.sender_id === user?.id} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <MessageInputForm onSubmit={handleSendMessage} isLoading={sendingMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-gray-500">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};
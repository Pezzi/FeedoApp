// src/hooks/useNotifications.ts (versão otimizada)

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import type { User } from '@supabase/supabase-js'; // Importando o tipo User

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  link_to?: string;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se não há usuário, limpa tudo e para a execução.
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    
    // A função de busca agora vive dentro do useEffect, garantindo que
    // ela sempre tem acesso à versão mais recente do 'user'.
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setNotifications(data || []);
      } catch (err: any) {
        console.error("Erro ao buscar notificações:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();

    // A lógica do canal de tempo real continua igual
    const channel = supabase
      .channel(`public:notifications:user_id=eq.${user.id}`)
      .on<Notification>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Nova notificação recebida!', payload.new);
          setNotifications(currentNotifications => [
            payload.new,
            ...currentNotifications,
          ]);
        }
      )
      .subscribe();
    
    // A função de limpeza do useEffect
    return () => {
      supabase.removeChannel(channel);
    };
    
  // O useEffect agora depende apenas do ID do usuário, que é um valor estável.
  }, [user?.id]);


  const markAsRead = async (notificationId: string) => {
    // ... sua função markAsRead continua igual
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { notifications, unreadCount, loading, error, markAsRead };
};
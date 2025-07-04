// src/hooks/useProfile.ts (versão final com useEffect simplificado)

import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import type { Provider } from './useProviders_OLD.ts';
import { toast } from 'react-toastify';

export const useProfile = () => {
  const { user, setUser } = useAuthStore();
  
  const [profile, setProfile] = useState<Partial<Provider> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 👇 A LÓGICA DE BUSCA FOI MOVIDA PARA DENTRO DO USEEFFECT 👇
  useEffect(() => {
    const fetchProfileData = async () => {
      // Usamos o ID do usuário diretamente da variável user
      const userId = user?.id;

      if (!userId) {
        setLoading(false); // Se não há usuário, não há o que carregar.
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        // Se der um erro que não seja "nenhuma linha encontrada", mostre o erro.
        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setProfile(data);

      } catch (err: any) {
        toast.error("Erro ao carregar seu perfil.");
        console.error("Erro em fetchProfileData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  // A dependência agora é APENAS o ID do usuário, que é uma string estável.
  }, [user?.id]);

  
  // As funções de upload e update continuam como estavam, pois a lógica de escrita está correta.
  const uploadProfileImage = async (file: File, type: 'avatar' | 'cover'): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado.');
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${type}-${Date.now()}.${fileExt}`;
    const bucketName = 'profiles';
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const updateProviderProfile = async (updates: Partial<Provider>) => {
    if (!user) throw new Error('Usuário não autenticado.');
    // ...lógica de update que já sabemos que funciona...
  };

  const changePassword = async (newPassword: string) => {
    // ...lógica de alterar senha...
  };

  return { profile, loading, refetch: () => {}, updateProviderProfile, changePassword, uploadProfileImage };
};
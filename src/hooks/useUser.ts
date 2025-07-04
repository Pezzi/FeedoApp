// src/hooks/useUser.ts
import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';

// Hook para operações de usuário (atualizar perfil, senha, etc.)
export const useUserOperations = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Atualiza os metadados do usuário (ex: nome de exibição).
   * Os metadados são um bom lugar para armazenar informações que não são de autenticação.
   */
  const updateUserProfile = async (updates: { display_name?: string; [key: string]: any }) => {
    if (!user) throw new Error('Usuário não autenticado.');

    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: updates, // O campo 'data' atualiza os 'user_metadata'
      });

      if (updateError) throw updateError;

      // Atualiza o estado local do usuário na store para refletir a mudança imediatamente
      setUser(data.user);
      
      return data.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Altera a senha do usuário logado.
   */
  const changePassword = async (newPassword: string) => {
    if (!user) throw new Error('Usuário não autenticado.');
    if (!newPassword || newPassword.length < 6) {
        throw new Error('A nova senha precisa ter no mínimo 6 caracteres.');
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;
      
      return data.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserProfile,
    changePassword,
    loading,
    error,
  };
};
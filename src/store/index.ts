// src/store/index.ts (ou onde seu store estiver)

import { create } from 'zustand';
import { type User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

export interface UserProfile extends User {
  company?: string;
  is_online?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  providerId: string | null; // <-- NOVO CAMPO ADICIONADO
  isLoading: boolean;
  isOnline: boolean;
  // 👇 A função setUser foi renomeada e atualizada para setAuthData 👇
  setAuthData: (user: UserProfile | null, providerId: string | null) => void;
  setLoading: (loading: boolean) => void;
  toggleIsOnline: (newStatus: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  providerId: null, // <-- VALOR INICIAL
  isLoading: true,
  isOnline: false,

  setAuthData: (user, providerId) => {
    // Quando definimos o usuário, também definimos o seu providerId
    const onlineStatus = user?.is_online ?? false;
    set({ user, providerId, isOnline: onlineStatus, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  
  // A sua função toggleIsOnline continua igual, mas note que ela atualiza a tabela 'profiles'
  // e não 'providers'. Podemos ajustar isso depois se necessário.
  toggleIsOnline: async (newStatus: boolean) => {
    // ... sua lógica existente ...
  },
}));
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import { toast } from 'react-toastify';

// Interface para os dados de uma Campanha
export interface Campaign {
  id: string;
  user_id: string;
  qr_code_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  // Este campo virá do 'join' com a tabela de qr_codes
  qr_codes: {
    name: string;
  } | null;
}

// Hook para buscar a LISTA de campanhas
export const useCampaigns = () => {
  const { user } = useAuthStore();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('campaigns')
        .select(`
          *,
          qr_codes ( name )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCampaigns(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao buscar campanhas:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, refetch: fetchCampaigns };
};

// Hook para operações de escrita (criar, editar, deletar)
export const useCampaignOperations = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'qr_codes'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ ...campaignData, user_id: user.id }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar campanha.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    setLoading(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Erro ao deletar campanha.");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createCampaign, deleteCampaign, loading };
};
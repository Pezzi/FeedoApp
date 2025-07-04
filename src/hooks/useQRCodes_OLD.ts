import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';

// Interface para o tipo de dado do QR Code
export interface QRCode {
  id: string;
  user_id: string;
  name: string;
  description: string;
  target_url: string;
  is_active: boolean;
  scans: number;
  feedbacks: number;
  color_scheme: string;
  logo_url?: string;
  created_at: string;
}

// Hook para buscar a LISTA de QR Codes
export const useQRCodes = () => {
  const { user } = useAuthStore();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQRCodes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setQrCodes(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar QR Codes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  return { qrCodes, loading, error, refetch: fetchQRCodes };
};


// Hook para operações de escrita (criar, atualizar, deletar)
export const useQRCodeOperations = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQRCode = async (qrData: {
    name: string;
    description: string;
    color_scheme: string;
    is_active: boolean;
    logo_url: string | null;
  }) => {
    if (!user) throw new Error('Usuário não autenticado');
    setLoading(true);
    setError(null);
    try {
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      
      const { data, error: rpcError } = await supabase.rpc('create_qr_code', {
        p_name: qrData.name,
        p_description: qrData.description,
        p_color_scheme: qrData.color_scheme,
        p_is_active: qrData.is_active,
        p_logo_url: qrData.logo_url,
        p_app_url: appUrl
      });

      if (rpcError) throw rpcError;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteQRCode = async (qrCodeId: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', qrCodeId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createQRCode, deleteQRCode, loading, error };
};
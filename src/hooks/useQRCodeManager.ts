// src/hooks/useQRCodeManager.ts

import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import type { QRCode } from './useQRCodes_OLD'; // Apontando para os tipos no arquivo antigo

interface CreateQRCodeParams {
  name: string;
  description: string;
  destination_url: string;
  color_scheme: string;
  is_active: boolean;
  logo_url: string | null;
}

export const useQRCodeManager = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQRCode = async (qrData: CreateQRCodeParams): Promise<QRCode> => {
    if (!user) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('create_qr_code', {
        p_name: qrData.name,
        p_description: qrData.description,
        p_destination_url: qrData.destination_url,
        p_color_scheme: qrData.color_scheme,
        p_is_active: qrData.is_active,
        p_logo_url: qrData.logo_url
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
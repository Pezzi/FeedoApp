// src/hooks/usePublicFeedback.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

// Tipos de dados que vamos usar
interface PublicQRCode {
  name: string;
  description: string;
  user_id: string;
}

interface FeedbackPayload {
  rating: number;
  comment: string;
  customer_name?: string;
  customer_email?: string;
  location?: string;
}

// Hook para buscar os dados PÚBLICOS de um QR Code
export const usePublicQRCode = (qrCodeId: string | undefined) => {
  const [qrCode, setQrCode] = useState<PublicQRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!qrCodeId) {
      setLoading(false);
      setError("ID do QR Code não encontrado.");
      return;
    }

    const fetchQRCode = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('qr_codes')
          .select('name, description, user_id') // Puxa apenas dados públicos
          .eq('id', qrCodeId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("QR Code não encontrado.");
        
        setQrCode(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [qrCodeId]);

  return { qrCode, loading, error };
};

// Hook com a função para ENVIAR um novo feedback
export const useSubmitFeedback = () => {
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async (ownerUserId: string, payload: FeedbackPayload) => {
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('feedbacks')
        .insert({
          user_id: ownerUserId, // O ID do dono do QR Code
          rating: payload.rating,
          comment: payload.comment,
          customer_name: payload.customer_name,
          customer_email: payload.customer_email,
          location: payload.location,
          source: 'qr_code',
          // O DB vai preencher status e sentiment automaticamente se tiver triggers,
          // ou podemos definir aqui se necessário.
        });
      
      if (insertError) throw insertError;

    } catch (err: any) {
      console.error("Erro ao enviar feedback:", err);
      throw err; // Re-throw para o componente poder tratar
    } finally {
      setSubmitting(false);
    }
  };

  return { submitFeedback, submitting };
};
// src/hooks/useProviders.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Provider, ProviderFilters } from './types';

export const useProviders = (filters: ProviderFilters) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // AGORA, EM VEZ DE MONTAR A QUERY, APENAS CHAMAMOS NOSSA FUNÇÃO RPC
      const { data, error: rpcError } = await supabase.rpc('search_providers', {
        p_search_query: filters.searchQuery || null,
        p_state: filters.state || null,
        p_city: filters.city || null,
        p_segment: filters.segment || null
      });

      if (rpcError) {
        throw rpcError;
      }

      setProviders(data || []);

    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao buscar prestadores via RPC:", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return { providers, loading, error, refetch: fetchProviders };
};
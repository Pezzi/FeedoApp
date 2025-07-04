// src/hooks/useNearbyProviders.ts

import { useState } from 'react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import type { Provider } from './useProviders_OLD.ts'; // Reutilizamos o tipo Provider

// O provider retornado terá a distância como um novo campo
export type NearbyProvider = Provider & {
  distance: number;
};

export const useNearbyProviders = () => {
  const [providers, setProviders] = useState<NearbyProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearby = (radiusInMeters: number = 5000) => { // Raio padrão de 5km
    setLoading(true);
    setError(null);
    toast.info("Obtendo sua localização...");

    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        toast.info("Buscando prestadores próximos...");
        
        const { data, error: rpcError } = await supabase.rpc('find_nearby_providers', {
          client_lat: latitude,
          client_lon: longitude,
          radius_meters: radiusInMeters
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }
        
        setProviders(data || []);
        setLoading(false);
        if (data.length === 0) {
          toast.info("Nenhum prestador encontrado no raio de busca.");
        }
      },
      (geoError) => {
        setError("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        toast.error("Não foi possível obter sua localização.");
        setLoading(false);
      }
    );
  };

  return { nearbyProviders: providers, loading, error, fetchNearby };
};
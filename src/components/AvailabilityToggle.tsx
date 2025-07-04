// src/components/AvailabilityToggle.tsx

import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import { CustomToggle } from './ui/CustomToggle';

export function AvailabilityToggle() {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    // Guarda o estado anterior para podermos reverter em caso de erro.
    const previousState = isAvailable;
    const newState = !previousState;

    // 1. ATUALIZAÇÃO OTIMISTA: Muda a UI imediatamente.
    setIsAvailable(newState);
    setError(null);
    setIsLoading(true);

    const performUpdate = async (location?: GeolocationCoordinates) => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      const updates = {
        is_available: newState,
        location: newState && location ? `POINT(${location.longitude} ${location.latitude})` : null,
      };

      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

      // 3. SE DER ERRO, desfaz a alteração na UI.
      if (error) {
        console.error("Erro ao atualizar disponibilidade:", error.message);
        setError("Erro ao atualizar status.");
        setIsAvailable(previousState); // Reverte para o estado anterior
      }

      setIsLoading(false);
    };

    // 2. Tenta fazer a alteração no servidor.
    if (newState) { // Se está a tentar ficar ONLINE
      navigator.geolocation.getCurrentPosition(
        (position) => {
          performUpdate(position.coords);
        },
        () => {
          setError("Permissão de localização negada.");
          setIsAvailable(previousState); // Reverte se não conseguir localização
          setIsLoading(false);
        }
      );
    } else { // Se está a tentar ficar OFFLINE
      performUpdate();
    }
  };

  // Efeito para carregar o estado inicial do usuário (sem alterações aqui)
  useEffect(() => {
    const fetchInitialStatus = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data } = await supabase.from('profiles').select('is_available').eq('id', user.id).single();
      if (data) {
        setIsAvailable(data.is_available);
      }
      setIsLoading(false);
    };
    fetchInitialStatus();
  }, [user]);

  return (
    <div className="flex items-center gap-3">
      <CustomToggle 
        isOn={isAvailable}
        handleToggle={handleToggle}
        isLoading={isLoading}
      />
      {isAvailable && !isLoading && (
          <div className="h-2 w-2 rounded-full bg-realce animate-pulse"></div>
        )}
      <span className={`font-semibold text-sm transition-colors w-24 text-left ${
        isAvailable ? 'text-realce' : 'text-notificacao'
      }`}>
        {isLoading ? 'Aguardando...' : (isAvailable ? 'Veeper ON' : 'Veeper OFF')}
      </span>
    </div>
  );
}
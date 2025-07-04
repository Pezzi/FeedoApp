// src/components/dashboard/AvailabilityCard.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Loader2 } from 'lucide-react';
import { StyledToggleSwitch } from '../forms/StyledToggleSwitch';
import { toast } from 'react-toastify';

// No futuro, este hook atualizará o status no Supabase
// import { useProfile } from '../../hooks/useProfile';

export const AvailabilityCard: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const { updateUserStatus } = useProfile(); // Exemplo de como usaríamos o hook

  const handleAvailabilityToggle = (checked: boolean) => {
    if (checked) {
      // Lógica para FICAR DISPONÍVEL
      setIsLoading(true);
      toast.info("Obtendo sua localização...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Localização obtida: ${latitude}, ${longitude}`);
          
          // AQUI CHAMARÍAMOS A FUNÇÃO PARA ATUALIZAR O SUPABASE
          // await updateUserStatus({ 
          //   availability_status: 'available',
          //   last_location: `POINT(${longitude} ${latitude})`,
          //   availability_expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000) // Expira em 2h
          // });
          
          toast.success("Você está online e visível no mapa!");
          setIsAvailable(true);
          setIsLoading(false);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          toast.error("Não foi possível obter sua localização. Verifique as permissões do navegador.");
          setIsLoading(false);
        }
      );
    } else {
      // Lógica para FICAR OFFLINE
      // await updateUserStatus({ availability_status: 'unavailable' });
      toast.info("Você não está mais visível no mapa.");
      setIsAvailable(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="bg-fundo-card p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isAvailable ? 'bg-realce/20 text-realce' : 'bg-white/10 text-texto-normal/70'}`}>
            <MapPin />
          </div>
          <div>
            <h3 className="font-bold text-white">Visibilidade "Estou por Perto"</h3>
            <p className="text-sm text-texto-normal/70">
              {isAvailable ? 'Você está visível para clientes próximos.' : 'Fique online para receber propostas.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoading && <Loader2 className="animate-spin text-realce" />}
          <StyledToggleSwitch checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
        </div>
      </div>
    </motion.div>
  );
};
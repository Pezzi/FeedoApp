// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { motion } from 'framer-motion';

// Hooks
import { useAuthStore } from '../store';
import { useDashboardStats, useNpsTrend } from '../hooks/useDashboard';
import { useAllFeedbacksForMap } from '../hooks/useFeedbacks';

// Componentes
// 1. A importação do AvailabilityCard foi REMOVIDA daqui.
import { RecentFeedbacksCard } from '../components/dashboard/RecentFeedbacksCard';
import { LocationMap } from '../components/maps/LocationMap';
import { NpsLineChart } from '../components/dashboard/NpsLineChart';
import { DateRangePicker } from '../components/dashboard/DateRangePicker';
import { KPICard } from '../components/dashboard/KPICard';
import { KPICardSkeleton } from '../components/dashboard/KPICardSkeleton';
import { BlockSkeleton } from '../components/dashboard/BlockSkeleton';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const { stats, loading: statsLoading, refetch: refetchStats } = useDashboardStats({ dateRange });
  const { trendData, loading: trendLoading, refetch: refetchTrend } = useNpsTrend({ dateRange });
  const { feedbacks: mapFeedbacks, loading: mapLoading, refetch: refetchMap } = useAllFeedbacksForMap({ dateRange });
  
  const handleRefresh = () => {
    refetchStats();
    refetchTrend();
    refetchMap();
  };
  
  const isRefreshing = statsLoading || trendLoading || mapLoading;

  return (
    <div className="space-y-8"> 
      
      <div className="flex items-center justify-between">
        <div>
          {user && ( <p className="text-md text-texto-normal mb-1">Olá, <span className="font-bold text-realce">{user.email}</span>!</p> )}
          <h1 className="text-2xl font-bold text-realce">Dashboard</h1>
          <p className="text-sm text-texto-normal/70">Visão geral dos seus feedbacks e métricas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 rounded-lg bg-fundo-card hover:opacity-80 transition-opacity disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 text-texto-normal ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. O <AvailabilityCard /> foi REMOVIDO daqui. */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <KPICard title="Total de Feedbacks" value={stats?.totalFeedbacks ?? 0} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <KPICard title="Avaliação Média" value={(stats?.averageRating?.toFixed(1) ?? 'N/A')} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <KPICard title="QR Codes Ativos" value={stats?.activeQrCodes ?? 0} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <KPICard title="Feedbacks Pendentes" value={stats?.pendingFeedbacks ?? 0} />
            </motion.div>
          </>
        )}
      </div>

      {mapLoading ? (
        <BlockSkeleton className="h-[500px]" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="p-6 rounded-2xl h-[500px] flex flex-col bg-fundo-card shadow-lg">
            <h3 className="text-lg font-semibold text-realce mb-4">Mapa de Feedbacks</h3>
            <LocationMap feedbacks={mapFeedbacks} />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trendLoading ? (
          <BlockSkeleton className="h-96" />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="p-6 rounded-2xl h-96 flex flex-col bg-fundo-card shadow-lg">
              <h3 className="text-lg font-semibold text-realce mb-4">Evolução do NPS</h3>
              {trendData && trendData.length > 0 ? (
                <NpsLineChart chartData={trendData} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-texto-normal/70">
                  Não há dados suficientes para exibir o gráfico.
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <RecentFeedbacksCard />
        </motion.div>
      </div>
    </div>
  );
};
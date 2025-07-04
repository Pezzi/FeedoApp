import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { type DateRange } from 'react-day-picker';

// --- Interfaces para Tipagem dos Dados ---

export interface DashboardStats {
  totalFeedbacks: number;
  averageRating: number;
  activeQrCodes: number;
  pendingFeedbacks: number;
}

export interface NpsTrendData {
  day: string;
  nps_score: number;
}

export interface BenchmarkData {
  average_rating: number | null;
  nps_score: number | null;
}

interface DateRangeHookProps {
  dateRange: DateRange | undefined;
}

// --- Hook para as estatísticas dos cards (Correto) ---
export const useDashboardStats = ({ dateRange }: DateRangeHookProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    setStats(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_dashboard_stats', {
        start_date: dateRange.from.toISOString().split('T')[0],
        end_date: dateRange.to.toISOString().split('T')[0],
      });
      if (rpcError) throw rpcError;
      setStats(data?.[0] || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// --- Hook para a tendência do NPS (Correto) ---
export const useNpsTrend = ({ dateRange }: DateRangeHookProps) => {
  const [trendData, setTrendData] = useState<NpsTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    setTrendData([]); 
    try {
      const { data: { user } } = await supabase.auth.getUser(); // Corrigido para pegar o usuário
      if(!user) { setLoading(false); return; }
      
      const { data, error: rpcError } = await supabase.rpc('get_nps_trend', {
        start_date: dateRange.from.toISOString().split('T')[0],
        end_date: dateRange.to.toISOString().split('T')[0]
      });
      if (rpcError) throw rpcError;
      
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        day: new Date(item.day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      }));
      setTrendData(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { trendData, loading, error, refetch: fetchTrend };
};

// --- Hook de Benchmark (COM A CORREÇÃO DE DEFESA) ---
export const useBenchmarkData = () => {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBenchmarkData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBenchmarkData(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cnae')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile?.cnae) {
        console.log('Nenhum CNAE encontrado para o usuário, não há benchmark para buscar.');
        setLoading(false);
        return;
      }

      const { data: benchmarkResult, error: rpcError } = await supabase.rpc('get_benchmark_for_cnae', {
        p_cnae_principal: profile.cnae
      });
      if (rpcError) throw rpcError;

      // AQUI ESTÁ A CORREÇÃO: Verificamos se 'benchmarkResult' é uma lista válida antes de usá-la.
      let processedData: BenchmarkData = { average_rating: null, nps_score: null };
      if (benchmarkResult && Array.isArray(benchmarkResult)) {
        processedData = {
          average_rating: benchmarkResult.find(m => m.metrica === 'average_rating')?.valor ?? null,
          nps_score: benchmarkResult.find(m => m.metrica === 'nps_score')?.valor ?? null,
        };
      }

      setBenchmarkData(processedData);

    } catch (err: any) {
      console.error("Erro ao buscar dados de benchmark:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenchmarkData();
  }, [fetchBenchmarkData]);

  return { benchmarkData, loading, error, refetch: fetchBenchmarkData };
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import { toast } from 'react-toastify';
import { type DateRange } from 'react-day-picker';

// --- Interfaces ---
export interface Feedback {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'responded' | 'archived';
  user_id: string;
  created_at: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  sentiment?: 'positive' | 'negative' | 'neutral' | null;
  sentiment_score?: number | null;
  topics?: string[] | null;
}

export interface FeedbackFilters {
  status?: Array<'pending' | 'responded' | 'archived'>;
}

interface MapFeedback {
  id: string;
  lat: number;
  lng: number;
}

interface DateRangeHookProps {
  dateRange: DateRange | undefined;
}

// --- Hook 1: Para a Página Principal de Feedbacks ---
export const useFeedbacks = (initialFilters: FeedbackFilters = {}) => {
  const { user } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFeedbacks = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      let feedbackQuery = supabase.from('feedbacks').select('*', { count: 'exact' }).eq('user_id', user.id);
      if (filters.status && filters.status.length > 0) {
        feedbackQuery = feedbackQuery.in('status', filters.status);
      }
      feedbackQuery = feedbackQuery.order('created_at', { ascending: false });
      
      const { data, error: fetchError, count } = await feedbackQuery;
      if (fetchError) throw fetchError;
      
      setFeedbacks(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, JSON.stringify(filters)]);

  useEffect(() => {
    fetchFeedbacks();
    const channel = supabase.channel(`realtime-feedbacks-list-${user?.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'feedbacks', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          setFeedbacks(currentFeedbacks =>
            currentFeedbacks.map(fb => fb.id === payload.new.id ? { ...fb, ...payload.new } as Feedback : fb)
          );
        }
      ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFeedbacks, user?.id]);

  const updateFeedbackStatus = async (feedbackId: string, status: 'pending' | 'responded' | 'archived') => { /* ...código... */ };
  const archiveFeedback = async (id: string) => { /* ...código... */ };
  const unarchiveFeedback = async (id: string) => { /* ...código... */ };

  return { feedbacks, loading, error, totalCount, setFilters, archiveFeedback, unarchiveFeedback, refetch: fetchFeedbacks };
};


// --- Hook 2: Para o Card de Feedbacks Recentes no Dashboard ---
export const useRecentFeedbacks = (limit: number = 5) => {
  const { user } = useAuthStore();
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      setRecentFeedbacks(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar feedbacks recentes:", err);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  return { recentFeedbacks, loading };
};


// --- Hook 3: Para o Mapa de Feedbacks no Dashboard ---
export const useAllFeedbacksForMap = ({ dateRange }: DateRangeHookProps) => {
  const [feedbacks, setFeedbacks] = useState<MapFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapData = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    setFeedbacks([]);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_feedbacks_for_map', {
        start_date: dateRange.from.toISOString().split('T')[0],
        end_date: dateRange.to.toISOString().split('T')[0],
      });
      if (rpcError) throw rpcError;
      setFeedbacks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  return { feedbacks, loading, error, refetch: fetchMapData };
};
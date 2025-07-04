// src/pages/PublicProfilePage.tsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { type Profile } from '../components/VeeperCard';
import { ContactVeeperModal } from '../components/ContactVeeperModal';
import { ReviewCard, type Feedback } from '../components/profile/ReviewCard';
import { User, Mail, Phone, Globe, MessageSquare, Star as StarIcon } from 'lucide-react';

export const PublicProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!profileId) return;
      setLoading(true);
      try {
        // 1. Primeiro, buscamos os dados do perfil do provider
        const { data: profileData, error: profileError } = await supabase
          .from('providers')
          .select('*, user_id') // Garantimos que o user_id venha
          .eq('id', profileId)
          .single();

        if (profileError) throw profileError;
        
        if (profileData) {
          setProfile(profileData);
          
          // 2. Depois, usamos o user_id do perfil para buscar os feedbacks
          const { data: feedbackData, error: feedbackError } = await supabase
              .from('feedbacks')
              .select('*')
              .eq('user_id', profileData.user_id) // <-- LÓGICA CORRIGIDA AQUI
              .order('created_at', { ascending: false });

          if (feedbackError) throw feedbackError;
          setFeedbacks(feedbackData || []);
        }

      } catch (err) {
        console.error("Erro ao buscar dados da página de perfil:", err);
        setProfile(null); // Limpa o perfil em caso de erro
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [profileId]);
  
  // ... sua função handleSendMessage continua igual ...
  const handleSendMessage = async (message: string) => { /* ... */ };

  // ... seu JSX continua igual ...
  if (loading) return <div className="text-center p-10 text-white animate-pulse">Carregando perfil...</div>;
  if (!profile) return <div className="text-center p-10 text-red-500">Perfil não encontrado ou inválido.</div>;
  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="bg-fundo-card rounded-2xl shadow-lg overflow-hidden">
          {/* ... Hero Section ... */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-fundo-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Sobre {profile.name}</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{profile.description || 'Nenhuma descrição fornecida.'}</p>
            </div>
            <div className="bg-fundo-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <StarIcon className="text-realce" size={22} />
                Avaliações de Clientes
              </h2>
              <div className="space-y-4">
                {feedbacks.length > 0 ? (
                  feedbacks.map(fb => <ReviewCard key={fb.id} feedback={fb} />)
                ) : (
                  <p className="text-gray-400">Este Veeper ainda não recebeu nenhuma avaliação.</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-fundo-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informações de Contato</h2>
              {/* ... sua lista de contatos ... */}
            </div>
          </div>
        </div>
      </div>
      <ContactVeeperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendMessage}
        veeperName={profile.name || 'este Veeper'}
      />
    </>
  );
};
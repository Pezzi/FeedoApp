import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ContactVeeperModal } from '../components/ContactVeeperModal';
import { ReviewCard, type Feedback } from '../components/profile/ReviewCard';
import { User, Mail, Phone, Globe, MessageSquare, Star as StarIcon } from 'lucide-react';

// O tipo Profile deve corresponder à sua tabela 'providers'
type Profile = {
  id: string;
  user_id: string;
  name?: string | null;
  business_name?: string | null;
  description?: string | null;
  city?: string | null;
  state?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  website_url?: string | null;
  avatar_url?: string | null;
  cover_image_url?: string | null;
  segment?: string | null;
};

export const PublicProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('get_provider_by_id', { p_id: profileId })
          .single();

        if (error) throw error;
        
        if (data) {
          setProfile(data);
          const { data: feedbackData, error: feedbackError } = await supabase
            .from('feedbacks')
            .select('*')
            .eq('user_id', data.user_id)
            .order('created_at', { ascending: false });

          if (feedbackError) throw feedbackError;
          setFeedbacks(feedbackData || []);
        } else {
          setProfile(null);
        }

      } catch (err) {
        console.error("Erro ao buscar dados da página de perfil:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [profileId]);

  const handleSendMessage = async (message: string) => {
    if (!profileId) return;
    try {
      const { error } = await supabase.rpc('create_conversation_and_send_message', {
        // 👇 CORREÇÃO: Usamos o user_id do perfil que já carregamos 👇
        receiver_id_input: profile.user_id, 
        message_content: message,
      });

      if (error) {
        // Lança o erro para ser apanhado pelo bloco catch
        throw error;
      }
      
      alert("Mensagem enviada com sucesso!");
      setIsModalOpen(false); // Fecha a modal após o sucesso

    } catch (err: any) {
      alert("Erro ao enviar mensagem. Por favor, tente novamente.");
      console.error("Erro RPC ao enviar mensagem:", err);
    }
  };

  if (loading) {
    return <div className="text-center p-10 text-white animate-pulse">Carregando perfil...</div>;
  }
  if (!profile) {
    return <div className="text-center p-10 text-red-500">Perfil não encontrado.</div>;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="bg-fundo-card rounded-2xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-800">
            {profile.cover_image_url && <img src={profile.cover_image_url} alt="Imagem de Capa" className="w-full h-full object-cover" />}
          </div>
          <div className="p-6 relative">
            <div className="absolute left-6 -mt-24 w-32 h-32 rounded-full border-4 border-fundo bg-gray-700 flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name || 'Avatar'} className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="text-right">
              <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 rounded-md bg-realce text-fundo-card font-bold hover:bg-realce/90 transition-all">
                <MessageSquare className="inline-block h-4 w-4 mr-2" />
                Entrar em Contato
              </button>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-md text-realce">{profile.segment || 'Especialidade a definir'}</p>
              <p className="text-sm text-gray-400 mt-1">{profile.city}, {profile.state}</p>
            </div>
          </div>
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
              <ul className="space-y-3">
                {profile.phone && <li className="flex items-center gap-3 text-gray-300"><Phone size={16} className="text-realce" /> {profile.phone}</li>}
                {profile.contact_email && <li className="flex items-center gap-3 text-gray-300"><Mail size={16} className="text-realce" /> {profile.contact_email}</li>}
                {profile.website_url && <li className="flex items-center gap-3 text-gray-300"><Globe size={16} className="text-realce" /><a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{profile.website_url}</a></li>}
              </ul>
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
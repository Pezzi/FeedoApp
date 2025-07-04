import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hooks, Serviços e Tipos
import { useAuthStore, type UserProfile } from './store'; 
import { supabase } from './services/supabase';

// Páginas e Componentes
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EmailConfirmation } from './pages/EmailConfirmation';
import { Dashboard } from './pages/Dashboard';
import { QRCodes } from './pages/QRCodes';
import { CreateQRCode } from './pages/CreateQRCode';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { PublicFeedbackPage } from './pages/PublicFeedbackPage';
import { Veepo } from './pages/Veepo';
import { Veepar } from './pages/Veepar';
import { Feedbacks } from './pages/FeedbacksWithSupabase';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { CampaignsPage } from './pages/CampaignsPage'; 
import { BillingPage } from './pages/BillingPage';
import { VerificationPage } from './pages/VerificationPage';
import { VeepersPage } from './pages/VeepersPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { MessagesPage } from './pages/MessagesPage';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { user, isLoading, setAuthData, setLoading } = useAuthStore();


  useEffect(() => {
    // Esta função agora busca tanto o usuário quanto o seu perfil de provider
    const fetchAuthAndProviderData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;

      if (currentUser) {
        // Se há um usuário, buscamos o ID do seu perfil na tabela 'providers'
        const { data: providerProfile, error: providerError } = await supabase
          .from('providers')
          .select('id, is_available') // Só precisamos do ID e do status online por agora
          .eq('user_id', currentUser.id)
          .single();

        if (providerError && providerError.code !== 'PGRST116') {
          console.error("Erro ao buscar perfil de provider:", providerError);
        }

        // Adicionamos o is_online ao objeto do usuário para o toggle funcionar
        const userWithStatus = {
            ...currentUser,
            is_online: providerProfile?.is_available || false
        };
        
        // Salvamos o usuário E o id do provider no nosso store
        setAuthData(userWithStatus, providerProfile?.id || null);
      } else {
        // Se não há usuário, limpamos tudo
        setAuthData(null, null);
      }
    };

    fetchAuthAndProviderData();

    // O listener agora também chama a função completa para manter tudo sincronizado
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchAuthAndProviderData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuthData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161616]">
        <h1 className="text-2xl font-bold text-white animate-pulse">Carregando...</h1>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* --- ROTAS SEM O LAYOUT PRINCIPAL (ex: login, etc.) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/f/:qrCodeId" element={<PublicFeedbackPage />} />


          {/* --- ROTAS QUE USAM O LAYOUT PRINCIPAL (com sidebar e header) --- */}
          <Route path="/" element={<Layout />}>
            {/* Rota inicial: se logado, vai para o dashboard, senão, vai para a página de perfil (exemplo) */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Perfil Público: acessível a todos, mas DENTRO do layout */}
            <Route path="veeper/:profileId" element={<PublicProfilePage />} />

            {/* Rotas Protegidas: SÓ para usuários logados */}
            {user && (
              <>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="qr-codes" element={<QRCodes />} />
                <Route path="qr-codes/create" element={<CreateQRCode />} />
                <Route path="settings" element={<AccountSettingsPage />} />
                <Route path="veepo" element={<Veepo />} />
                <Route path="veepar" element={<Veepar />} />
                <Route path="feedbacks" element={<Feedbacks />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="campaigns/create" element={<CreateCampaignPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="verification" element={<VerificationPage />} />
                <Route path="veepers" element={<VeepersPage />} />
                <Route path="messages" element={<MessagesPage />} /> {/* <-- ADICIONE ESTA ROTA */}
              </>
            )}
          </Route>

          {/* Rota "Catch-all" para páginas não encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </QueryClientProvider>
  );
}

export default App;
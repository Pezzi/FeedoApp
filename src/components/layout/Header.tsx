// src/components/layout/Header.tsx

import React, { useState } from 'react';
import { Search, Bell, User, Menu, Sun, LogOut, Settings, Eye, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { supabase } from '../../services/supabase';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { AvailabilityToggle } from '../AvailabilityToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const navigate = useNavigate();
  
  const { user, providerId, setAuthData } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthData(null, null); 
    navigate('/login');
  };

  const DropdownItem = ({ icon: Icon, children, onClick }: { icon: any; children: React.ReactNode; onClick?: () => void;}) => (
    <button onClick={onClick} className="w-full flex items-center space-x-3 px-4 py-2 text-texto-normal/80 hover:bg-white/5 hover:text-realce transition-colors rounded">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );

  return (
    <header className="px-6 py-4 mt-4">
      <div className="flex items-center justify-between">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg text-texto-normal/70 hover:bg-fundo-card">
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-texto-normal/50" />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-fundo-card text-texto-normal focus:ring-2 focus:ring-realce focus:outline-none" />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <AvailabilityToggle />
          
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg text-texto-normal/70 hover:opacity-80 transition-opacity" title="Modo escuro">
            <Sun className="h-5 w-5 text-realce" />
          </button>

          <Link to="/messages" className="relative p-2 rounded-lg text-texto-normal/70 hover:bg-fundo-card" title="Mensagens">
            <Mail className="h-5 w-5" />
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-texto-normal/70 hover:bg-fundo-card" 
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-notificacao rounded-full border-2 border-fundo-principal"></span>
              )}
            </button>
            {showNotifications && ( <NotificationPanel /* ... */ /> )}
          </div>
          
          {/* 👇 MENU DE USUÁRIO MINIMALISTA 👇 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center rounded-full" // Classes de espaçamento e de texto removidas
            >
              {/* O tamanho do avatar foi aumentado de h-8 w-8 para h-10 w-10 */}
              {user?.user_metadata.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-fundo-card">
                  <span className="font-bold text-realce text-lg">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {/* O nome/email e a seta de dropdown foram REMOVIDOS daqui */}
            </button>

            {/* O dropdown em si continua igual */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 backdrop-blur-md bg-fundo-card/90 border border-white/10">
                <div className="p-2">
                  {providerId && (<DropdownItem icon={Eye} onClick={() => { navigate(`/veeper/${providerId}`); setShowUserMenu(false); }}>Ver Meu Perfil Público</DropdownItem>)}
                  <DropdownItem icon={Settings} onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>Configurações</DropdownItem>
                  <hr className="my-1 border-white/10" />
                  <DropdownItem icon={LogOut} onClick={handleLogout}>Sair</DropdownItem>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
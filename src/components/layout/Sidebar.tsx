// src/components/layout/Sidebar.tsx

import React from 'react'; // Removido useState não utilizado
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { 
  Home, QrCode, MessageSquare, Send, CreditCard, Settings, TrendingUp, 
  HelpCircle, ShieldCheck, Zap, PlusCircle,  //
} from 'lucide-react';
import Logo from '/src/assets/logo.svg?react';
import VeepoLogo from '/src/assets/logo.svg?react'; // Importing VeepoLogo
<Logo />


interface SidebarProps {
  isSidebarOpen: boolean;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, isCollapsed }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Painel', icon: Home, path: '/dashboard' },
    { name: 'Meus QR Codes', icon: QrCode, path: '/qr-codes' },
    { name: 'Veepo', icon: VeepoLogo, path: '/veepo' }, // Usando o SVG como componente React
    { name: 'Explorar Veepers', icon: Zap, path: '/veepers' },
    { name: 'Feedbacks', icon: MessageSquare, path: '/feedbacks' },
    { name: 'Campanhas', icon: Send, path: '/campaigns' },
    { name: 'Planos e Faturamento', icon: CreditCard, path: '/billing' },
  ];
  const bottomNavItems = [
    { name: 'Verificação', icon: ShieldCheck, path: '/verification' },
    { name: 'Configurações', icon: Settings, path: '/settings' },
    { name: 'Veepar', icon: TrendingUp, path: '/veepar' },
    { name: 'Ajuda', icon: HelpCircle, path: '/help' },
  ];

  const NavItem: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <Tippy content={item.name} placement="right" disabled={!isCollapsed} animation="fade" duration={200} arrow={false}>
      <NavLink
        to={item.path}
        className={({ isActive }) => {
          const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all font-medium";
          const collapsedClasses = isCollapsed ? 'justify-center' : '';
          const isActuallyActive = isActive && (item.path !== '/dashboard' || location.hash !== '#availability-section');
          if (isActuallyActive) {
            if (isCollapsed) return `${baseClasses} ${collapsedClasses} bg-fundo-card text-realce`;
            return `${baseClasses} ${collapsedClasses} bg-realce text-fundo-card hover:bg-realce/90`;
          }
          return `${baseClasses} ${collapsedClasses} text-texto-normal/80 hover:text-white hover:bg-white/5`;
        }}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </NavLink>
    </Tippy>
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col bg-fundo-card border-r border-[#1E1E1E] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-full max-h-screen flex-col">
        {/* Bloco do Logo */}
        <div className={`flex items-center h-24 border-b border-[#1E1E1E] transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
          <Link to="/dashboard" className="flex items-center gap-2" title="Feedo">
            <img src="/logo-feedo.svg" alt="Feedo Logo" className={`transition-all duration-300 ${isCollapsed ? 'h-10' : 'h-8'}`} />
          </Link>
        </div>

        {/* 👇 O Bloco do botão "Criar QR Code" foi MOVIDO para cá 👇 */}
        <div className={`py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <Tippy content="Criar QR Code" placement="right" disabled={!isCollapsed} animation="fade" duration={200} arrow={false}>
            <Link 
              to="/qr-codes/create" 
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg bg-realce text-fundo-card font-bold hover:bg-realce/90 transition-colors text-sm"
            >
              <PlusCircle className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="whitespace-nowrap">
                    Criar QR Code
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </Tippy>
        </div>
        
        {/* Bloco de Navegação Principal */}
        <nav className={`flex-1 px-2 overflow-y-auto transition-all duration-300`}>
          <div className={`${isCollapsed ? 'space-y-3' : 'space-y-1'}`}>
            {!isCollapsed && <h3 className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-texto-normal/50">Principal</h3>}
            {navItems.map((item) => <NavItem key={item.name} item={item} />)}
          </div>
          
          <div className="pt-2">
            <hr className={`border-t border-[#1E1E1E] my-3 ${isCollapsed ? 'mx-2' : 'mx-3'}`} />
            {!isCollapsed && <h3 className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-texto-normal/50">Conta</h3>}
            <div className={`${isCollapsed ? 'space-y-3' : 'space-y-1'}`}>
              {bottomNavItems.map((item) => <NavItem key={item.name} item={item} />)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};
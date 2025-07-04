// src/components/layout/Layout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header'; 
import { ToggleSidebarButton } from './ToggleSidebarButton';
import { Footer } from './Footer'; 

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-fundo-principal text-white">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        isSidebarOpen={isMobileSidebarOpen}
        setSidebarOpen={setMobileSidebarOpen}
      />
      <div 
        className="flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        // O marginLeft é dinâmico com base no estado da sidebar
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
      >
        {/* 👇 AQUI ESTÁ O AJUSTE: Passando a propriedade 'onMenuClick' que o Header espera 👇 */}
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
        
        <Footer />
      </div>
      
      <ToggleSidebarButton 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
    </div>
  );
};
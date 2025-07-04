// src/components/veepo/RegionalHighlights.tsx

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { HighlightCard } from './HighlightCard';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Ícones para as setas
import type { Swiper as SwiperType } from 'swiper'; // Tipo para a instância do Swiper

// Importe os estilos do Swiper
import 'swiper/css';
import 'swiper/css/navigation';

// Dados de exemplo (mock data)
const mockData = [
  { id: 1, rank: 1, avatarUrl: 'https://i.pravatar.cc/150?img=1', name: 'Barbearia do Zé', score: 92 },
  { id: 2, rank: 2, avatarUrl: 'https://i.pravatar.cc/150?img=2', name: 'Café da Esquina', score: 90 },
  { id: 3, rank: 3, avatarUrl: 'https://i.pravatar.cc/150?img=3', name: 'Petshop Au Miau', score: 88 },
  { id: 4, rank: 4, avatarUrl: 'https://i.pravatar.cc/150?img=4', name: 'Manicure da Ana', score: 85 },
  { id: 5, rank: 5, avatarUrl: 'https://i.pravatar.cc/150?img=5', name: 'Restaurante Sabor Caseiro', score: 84 },
  { id: 6, rank: 6, avatarUrl: 'https://i.pravatar.cc/150?img=6', name: 'Oficina do Tonhão', score: 81 },
  { id: 7, rank: 7, avatarUrl: 'https://i.pravatar.cc/150?img=7', name: 'Estúdio de Pilates Corpo & Mente', score: 79 },
  { id: 8, rank: 8, avatarUrl: 'https://i.pravatar.cc/150?img=8', name: 'Lava Jato Brilho Total', score: 75 },
];

export const RegionalHighlights: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('24h');
  
  // Estados para controlar a visibilidade das setas
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Atualiza o estado das setas com base na posição do Swiper
  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  return (
    // Adicionamos 'relative' e 'group' para controlar a aparição das setas
    <div className="bg-fundo-card p-6 rounded-2xl relative group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Destaques na sua região
        </h2>
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as any)} className="bg-[#1E1E1E] text-texto-normal border border-[#1E1E1E] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-realce/50">
          <option value="24h">Últimas 24h</option>
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
        </select>
      </div>
      
      {/* O Swiper agora usa nossos botões customizados para navegação */}
      <Swiper
        modules={[Navigation]}
        onSlideChange={handleSlideChange}
        onReachBeginning={() => setIsBeginning(true)}
        onReachEnd={(swiper) => setIsEnd(swiper.isEnd)}
        navigation={{
          nextEl: '.highlight-swiper-button-next',
          prevEl: '.highlight-swiper-button-prev',
        }}
        spaceBetween={30}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 7 },
        }}
        className="!pr-4" // Adiciona um pequeno padding para o último item não cortar
      >
        {mockData.map(provider => (
          <SwiperSlide key={provider.id}>
            <HighlightCard 
              rank={provider.rank}
              avatarUrl={provider.avatarUrl}
              name={provider.name}
              score={provider.score}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- BOTÕES DE NAVEGAÇÃO CUSTOMIZADOS --- */}
      <button 
        className={`highlight-swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-5 z-10 w-10 h-10 bg-[#1E1E1E] border border-gray-700/50 rounded-full flex items-center justify-center text-realce cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:cursor-default`}
        disabled={isBeginning}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className={`highlight-swiper-button-next absolute top-1/2 -translate-y-1/2 -right-5 z-10 w-10 h-10 bg-[#1E1E1E] border border-gray-700/50 rounded-full flex items-center justify-center text-realce cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:cursor-default`}
        disabled={isEnd}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
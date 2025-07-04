// src/pages/Veepo.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

// Hooks
import { useProviders, type Provider, type ProviderFilters } from '../hooks/useProviders.ts';
import { useIBGE, type IBGEState, type IBGECity, type IBGECnaeClass } from '../hooks/useIBGE';
import { useNearbyProviders, type NearbyProvider } from '../hooks/useNearbyProviders';

// Componentes
import { ProviderCard } from '../components/veepo/ProviderCard';
import { ProviderCardSkeleton } from '../components/veepo/ProviderCardSkeleton';
import { EmptyState } from '../components/qrcodes/EmptyState';
import { VeepoBanner } from '../components/veepo/VeepoBanner';
import { RegionalHighlights } from '../components/veepo/RegionalHighlights';
import { StyledInput } from '../components/forms/StyledInput';
import { StyledSelect } from '../components/forms/StyledSelect';
// A importação do VeepoMap foi REMOVIDA

export const Veepo: React.FC = () => {
  const [filters, setFilters] = useState<ProviderFilters>({ sortBy: 'ranking' });
  const { providers, loading: loadingFilters, error: errorFilters } = useProviders(filters);
  const { nearbyProviders, loading: loadingNearby, error: errorNearby, fetchNearby } = useNearbyProviders();
  const [searchMode, setSearchMode] = useState<'filters' | 'nearby'>('filters');
  
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [cnaeClasses, setCnaeClasses] = useState<IBGECnaeClass[]>([]);
  const { fetchStates, fetchCitiesByState, fetchCNAEClasses, loadingCities } = useIBGE();

  useEffect(() => {
    const loadInitialData = async () => {
      setStates(await fetchStates());
      setCnaeClasses(await fetchCNAEClasses());
    };
    loadInitialData();
  }, [fetchStates, fetchCNAEClasses]);

  useEffect(() => {
    if (filters.state) {
      fetchCitiesByState(filters.state).then(setCities);
    } else {
      setCities([]); 
    }
  }, [filters.state, fetchCitiesByState]);

  const handleFilterChange = (key: keyof ProviderFilters, value: string) => {
    setSearchMode('filters');
    const newFilters = { ...filters, [key]: value };
    if (key === 'state') newFilters.city = '';
    setFilters(newFilters);
  };

  const handleNearbySearch = () => {
    setSearchMode('nearby');
    fetchNearby(10000);
  };

  const providersToShow = searchMode === 'nearby' ? nearbyProviders : providers;
  const isLoading = searchMode === 'nearby' ? loadingNearby : loadingFilters;
  const currentError = searchMode === 'nearby' ? errorNearby : errorFilters;

  const renderResults = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, index) => <ProviderCardSkeleton key={index} />);
    }
    if (currentError) {
      return <div className="md:col-span-2 xl:col-span-3 text-center text-red-400 p-4">Erro: {currentError}</div>;
    }
    if (providersToShow.length === 0) {
      return (
        <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
                title="Nenhum prestador encontrado"
                message="Tente ajustar seus filtros de busca ou procurar em outra região."
            />
        </div>
      );
    }
    return providersToShow.map((provider, index) => (
      <motion.div
        key={provider.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <ProviderCard provider={provider} />
      </motion.div>
    ));
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-realce">Veepo</h1>
        <p className="text-sm text-texto-normal/70">Encontre os melhores prestadores de serviços da sua região</p>
      </div>
      <VeepoBanner />
      <RegionalHighlights />

      {/* 👇 O layout de grid foi removido. Agora os filtros e resultados ficam num fluxo único. 👇 */}
      <div className="space-y-6">
        <div className="space-y-4 p-6 rounded-2xl bg-fundo-card">
          <h3 className="font-semibold text-white">Filtros de Busca</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative md:col-span-2 lg:col-span-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-texto-normal/50" />
                  <StyledInput type="text" value={filters.searchQuery || ''} onChange={(e) => handleFilterChange('searchQuery', e.target.value)} placeholder="Buscar por nome ou negócio..." className="pl-12" />
              </div>
              <StyledSelect value={filters.state || ''} onChange={(e) => handleFilterChange('state', e.target.value)}>
                <option value="">Todos os Estados</option>
                {states.map(state => (<option key={state.id} value={state.sigla}>{state.nome}</option>))}
              </StyledSelect>
              <StyledSelect value={filters.city || ''} onChange={(e) => handleFilterChange('city', e.target.value)} disabled={!filters.state || loadingCities}>
                <option value="">{loadingCities ? 'Carregando...' : 'Todas as Cidades'}</option>
                {cities.map(city => (<option key={city.id} value={city.nome}>{city.nome}</option>))}
              </StyledSelect>
              <StyledInput list="cnae-options" name="segment" value={filters.segment || ''} onChange={(e) => handleFilterChange('segment', e.target.value)} placeholder="Todos os Segmentos" />
              <datalist id="cnae-options">{cnaeClasses.map(cnae => (<option key={cnae.id} value={cnae.descricao} />))}</datalist>
          </div>
          <div className="pt-2">
            <button onClick={handleNearbySearch} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-realce text-fundo-card font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                <MapPin size={18} />
                <span>Buscar Perto de Mim</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {renderResults()}
          </div>
        </div>
      </div>

      {/* O mapa e sua coluna foram completamente REMOVIDOS daqui. */}
    </div>
  );
};
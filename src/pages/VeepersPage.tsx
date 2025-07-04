import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Filter, MapPin } from 'lucide-react';

// Componentes
import { VeeperCard, type Profile } from '../components/VeeperCard';
import { EmptyState } from '../components/qrcodes/EmptyState';
import { ProviderCardSkeleton } from '../components/veepo/ProviderCardSkeleton';
import { StyledInput } from '../components/forms/StyledInput';
import { StyledSelect } from '../components/forms/StyledSelect';
import { VeepoMap } from '../components/veepo/VeepoMap'; // <-- A LINHA QUE FALTAVA

// Tipos
type CnaeClasse = { id: number; descricao: string; };
type State = { id: number; sigla: string; nome: string; };
type City = { id: number; nome: string; };

export const VeepersPage: React.FC = () => {
  const [providers, setProviders] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({ state: '', city: '', segment: '', searchQuery: '' });
  const [cnaeClasses, setCnaeClasses] = useState<CnaeClasse[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchIBGEData = async (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setter(data);
      } catch (e) { console.error("Erro ao buscar dados do IBGE", e); }
    };
    fetchIBGEData('https://servicodados.ibge.gov.br/api/v2/cnae/classes?orderBy=descricao', setCnaeClasses);
    fetchIBGEData('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome', setStates);
  }, []);

  useEffect(() => {
    if (filters.state) {
      setLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${filters.state}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(setCities)
        .finally(() => setLoadingCities(false));
    } else {
      setCities([]);
    }
  }, [filters.state]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'state') newFilters.city = '';
    setFilters(newFilters);
  };

  const handleNearMeSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setProviders([]);
    const testCoords = { latitude: -28.2833, longitude: -52.7865 };
    try {
      const { data, error: rpcError } = await supabase.rpc('nearby_veepers', { lat: testCoords.latitude, long: testCoords.longitude, radius_meters: 50000 });
      if (rpcError) throw rpcError;
      setProviders(data as Profile[]);
    } catch (err: any) {
      setError("Ocorreu um erro inesperado na busca.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setProviders([]);
    try {
      const { data, error: rpcError } = await supabase.rpc('search_providers', {
        p_search_query: filters.searchQuery || null,
        p_state: filters.state || null,
        p_city: filters.city || null,
        p_segment: filters.segment || null
      });
      if (rpcError) throw rpcError;
      setProviders(data as Profile[]);
    } catch (err: any) {
      setError("Ocorreu um erro inesperado ao buscar com os filtros.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (isLoading) return Array.from({ length: 3 }).map((_, index) => <ProviderCardSkeleton key={index} />);
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (providers.length === 0 && hasSearched) return <EmptyState title="Nenhum Veeper encontrado" message="Tente usar outros filtros ou aumentar o raio de busca." />;
    if (providers.length > 0) return <div className="flex flex-col gap-2">{providers.map((provider) => <VeeperCard key={provider.id} veeper={provider} />)}</div>;
    return <div className="p-4 text-center text-gray-500">Use os filtros para iniciar uma busca.</div>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-4 p-6 rounded-2xl bg-fundo-card">
          <h3 className="font-semibold text-white">Filtros de Busca</h3>
          <StyledInput type="text" value={filters.searchQuery} onChange={(e) => handleFilterChange('searchQuery', e.target.value)} placeholder="Buscar por nome ou negócio..." />
          <StyledSelect value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)}>
            <option value="">Todos os Estados</option>
            {states.map(state => <option key={state.id} value={state.sigla}>{state.nome}</option>)}
          </StyledSelect>
          <StyledSelect value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} disabled={!filters.state || loadingCities}>
            <option value="">{loadingCities ? 'Carregando...' : 'Todas as Cidades'}</option>
            {cities.map(city => <option key={city.id} value={city.nome}>{city.nome}</option>)}
          </StyledSelect>
          <StyledInput list="cnae-options" name="segment" value={filters.segment} onChange={(e) => handleFilterChange('segment', e.target.value)} placeholder="Todos os Segmentos" />
          <datalist id="cnae-options">{cnaeClasses.map(cnae => <option key={cnae.id} value={cnae.descricao} />)}</datalist>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button onClick={handleNearMeSearch} className="w-full md:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-realce text-fundo-card font-bold hover:bg-realce/90 transition-colors">
              <MapPin className="h-5 w-5" />
              Perto de Mim
            </button>
            <button onClick={handleFilterSearch} className="w-full md:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-fundo text-realce border border-realce font-bold hover:bg-realce/10 transition-colors">
              <Filter className="h-5 w-5" />
              Buscar
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Resultados</h3>
          {renderResults()}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-2 h-[85vh] sticky top-8 rounded-2xl overflow-hidden bg-fundo-card">
        <VeepoMap providers={providers} />
      </div>
    </div>
  );
};
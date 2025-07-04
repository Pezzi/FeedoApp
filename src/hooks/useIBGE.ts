import { useState, useCallback } from 'react';

// Interfaces para os tipos de dados da API do IBGE
export interface IBGEState { id: number; sigla: string; nome: string; }
export interface IBGECity { id: number; nome: string; }
export interface IBGECnaeClass { id: number; descricao: string; }

export const useIBGE = () => {
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCNAE, setLoadingCNAE] = useState(false);

  const fetchStates = useCallback(async (): Promise<IBGEState[]> => {
    setLoadingStates(true);
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      if (!response.ok) throw new Error('Erro ao buscar estados.');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const fetchCitiesByState = useCallback(async (stateUF: string): Promise<IBGECity[]> => {
    if (!stateUF) return [];
    setLoadingCities(true);
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateUF}/municipios`);
      if (!response.ok) throw new Error('Erro ao buscar cidades.');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const fetchCNAEClasses = useCallback(async (): Promise<IBGECnaeClass[]> => {
    setLoadingCNAE(true);
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v2/cnae/classes');
      if (!response.ok) throw new Error('Erro ao buscar classes do CNAE.');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoadingCNAE(false);
    }
  }, []);

  return { 
    fetchStates, 
    fetchCitiesByState, 
    fetchCNAEClasses,
    loadingStates, 
    loadingCities, 
    loadingCNAE
  };
};
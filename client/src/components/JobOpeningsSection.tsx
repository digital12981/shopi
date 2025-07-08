import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import { apiUrl } from '@/lib/api-config';

interface Region {
  name: string;
  abbr: string;
  vacancies: number;
}

// Função para carregar dados do JSON estático
async function loadStaticRegions(): Promise<Region[]> {
  try {
    // Em desenvolvimento, tenta a API primeiro
    if (import.meta.env.DEV) {
      try {
        console.log("Tentando carregar regiões da API...");
        const apiResponse = await fetch('/api/regions');
        if (apiResponse.ok) {
          console.log("Regiões carregadas com sucesso da API");
          return apiResponse.json();
        }
      } catch (err) {
        console.warn("Não foi possível carregar da API, usando arquivo estático", err);
      }
    }

    // Em produção ou fallback, carrega do arquivo estático
    console.log("Carregando regiões do arquivo JSON estático...");
    const response = await fetch('/data/regions.json');
    if (!response.ok) {
      throw new Error(`Erro ao carregar regions.json: ${response.status}`);
    }
    const data = await response.json();
    console.log("Dados estáticos carregados com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Erro ao carregar regiões:", error);
    throw error;
  }
}

const JobOpeningsSection: React.FC = () => {
  const { cepData, userCheckedCep } = useAppContext();
  const [, navigate] = useLocation();
  
  // Usando React Query com nossa função personalizada
  const { data: regions, isLoading, isError } = useQuery<Region[]>({
    queryKey: ['regions'],
    queryFn: loadStaticRegions,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 3
  });

  // Processamos as regiões considerando o estado do usuário, se disponível
  const processedRegions = useMemo(() => {
    if (!regions) return [];
    
    return regions.map(region => {
      // Se o usuário verificou o CEP e o estado corresponde ao estado do CEP
      if (userCheckedCep && cepData && region.abbr === cepData.state) {
        console.log(`Encontrado estado do usuário: ${region.name} (${region.abbr}). Ajustando para 22 vagas.`);
        // Sempre mostrando 22 vagas para o estado do usuário, independente do valor original
        return {
          ...region,
          vacancies: 22, // Aqui garantimos que o estado do usuário sempre terá 22 vagas
          isUserState: true
        };
      }
      return { ...region, isUserState: false };
    });
  }, [regions, cepData, userCheckedCep]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Vagas para Motorista Parceiro</h1>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#EE4E2E] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando vagas disponíveis...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500">Erro ao carregar as vagas. Por favor, tente novamente mais tarde.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y-[5px] sm:divide-y-0 sm:divide-x-[5px] divide-gray-200">
              
              {processedRegions.map((region, index) => {
                const hasVacancies = region.vacancies > 0;
                const isUserState = 'isUserState' in region && region.isUserState;
                
                return (
                  <div 
                    key={index} 
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm sm:text-base font-medium text-gray-700">
                          {region.name} <span className="text-gray-500">({region.abbr})</span>
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-[3px] ${hasVacancies ? 'bg-[#EDCDC7] bg-opacity-50' : 'bg-gray-200'}`}>
                        <span className={`text-sm sm:text-base font-semibold ${hasVacancies ? 'text-[#EE4E2E]' : 'text-gray-500'}`}>
                          {hasVacancies ? (
                            <>
                              <span className="font-bold">{region.vacancies}</span> vagas
                            </>
                          ) : 'Sem vagas'}
                        </span>
                      </div>
                    </div>
                    <button 
                      className={`w-full ${
                        hasVacancies 
                          ? 'bg-[#ee6c4d] hover:bg-[#e85c3a] text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      } text-sm sm:text-base font-medium py-2 px-4 rounded-[3px] transition-colors duration-200 shadow-sm`}
                      disabled={!hasVacancies}
                      onClick={() => hasVacancies && navigate('/cadastro')}
                    >
                      {hasVacancies ? 'Cadastrar' : 'Indisponível'}
                    </button>
                  </div>
                );
              })}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpeningsSection;

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cepData: { cep: string, city: string, state: string }) => void;
}

interface CepApiResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

const CepModal: React.FC<CepModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [cep, setCep] = useState('');
  const [formattedCep, setFormattedCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<{city: string, state: string} | null>(null);

  // Formatar CEP no padrão 00000-000
  const formatCep = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= 5) {
      return numericValue;
    } else {
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    }
  }, []);

  // Manipular mudança no campo de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    
    if (numericInput.length <= 8) {
      setCep(numericInput);
      setFormattedCep(formatCep(numericInput));
      
      // Limpar dados quando o usuário edita o CEP
      if (locationData) {
        setLocationData(null);
      }
      
      // Limpar erro ao editar
      if (error) {
        setError(null);
      }
      
      // Se chegou a 8 dígitos, buscar automaticamente
      if (numericInput.length === 8) {
        fetchCepData(numericInput);
      }
    }
  };

  // Buscar dados do CEP na API ViaCEP
  const fetchCepData = async (cepValue: string) => {
    if (cepValue.length !== 8) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data: CepApiResponse = await response.json();
      
      if (data.erro) {
        setError('CEP não encontrado. Verifique e tente novamente.');
        setLocationData(null);
      } else {
        setLocationData({
          city: data.localidade,
          state: data.uf
        });
      }
    } catch (err) {
      setError('Erro ao buscar o CEP. Tente novamente.');
      setLocationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Resetar o formulário
  const handleReset = () => {
    setCep('');
    setFormattedCep('');
    setLocationData(null);
    setError(null);
  };

  // Confirmar os dados
  const handleConfirm = () => {
    if (locationData) {
      onConfirm({
        cep: formattedCep,
        city: locationData.city,
        state: locationData.state
      });
    }
  };

  // Limpar estado ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-20 backdrop-blur-lg">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative mx-auto max-w-md w-full bg-white rounded-lg p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Bem-vindo à Shopee</h2>
              <img 
                src="https://logospng.org/download/shopee/logo-shopee-icon-1024.png"
                alt="Shopee Logo" 
                className="h-10 w-10" 
              />
            </div>
            
            <div className="h-px w-full bg-gray-100"></div>
            
            <p className="text-gray-600">Para continuar, informe seu CEP para verificarmos a disponibilidade na sua região.</p>
            
            <div className="space-y-2">
              <label htmlFor="cep" className="font-medium text-gray-700">CEP</label>
              <div className="flex justify-center">
                <Input
                  id="cep"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formattedCep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  className="cep-input"
                  style={{ 
                    borderColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    height: '55px',
                    maxWidth: '200px'
                  }}
                  maxLength={9}
                  autoFocus
                />
              </div>
            </div>
            
            {isLoading && (
              <div className="flex justify-center py-2">
                <div className="h-6 w-6 rounded-full border-3 border-t-transparent border-[#E83D22] animate-spin"></div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm font-medium py-1 bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}
            
            {locationData && (
              <div className="bg-[#FFF8F6] p-4 rounded-md border border-[#FFE0D9]">
                <div className="flex items-center">
                  <div className="mr-3 text-[#E83D22]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Localização:</span> 
                      <span className="ml-1 font-semibold">{locationData.city}/{locationData.state}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Entregas disponíveis para sua região</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-3 pt-2">
              {locationData && (
                <Button
                  variant="secondary"
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                  onClick={handleReset}
                >
                  Buscar novo CEP
                </Button>
              )}
              
              <Button
                className="w-full bg-[#E83D22] hover:bg-[#d73920] text-white font-medium py-6 text-base rounded-md"
                onClick={handleConfirm}
                disabled={!locationData}
                style={{ height: '50px' }}
              >
                {locationData ? 'Confirmar' : 'Verificar CEP'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CepModal;
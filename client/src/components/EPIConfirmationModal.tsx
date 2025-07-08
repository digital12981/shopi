import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface EPIConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const EPIConfirmationModal: React.FC<EPIConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md w-full" hideCloseButton>
        <div className="bg-white rounded-md shadow-2xl p-8 w-full relative">
          <div className="absolute top-0 left-0 w-full bg-[#EF4B28]/20 text-[#EF4B28] text-sm font-medium p-4 rounded-t-md">
            Cerca de 80% dos entregadores estão sendo bloqueados por não adquirirem o Kit de EPI, que é obrigatório. Para segurar sua vaga e começar a realizar as entregas, adquira o Kit de EPI. Para ativar seu cadastro no aplicativo de entregas, será necessário enviar a foto do Kit oficial. Após isso, você poderá iniciar as entregas!
          </div>
          <h1 className="text-xl font-bold mb-4 mt-48">Confirmação de pagamento do Kit de EPI do entregador</h1>
          <p className="text-gray-800 mb-6 text-sm">Após confirmar o pagamento, você será redirecionado à página de acesso ao aplicativo de entregas. O acesso ao aplicativo também será enviado por e-mail. Comece a realizar suas entregas!</p>
          <button 
            className="bg-[#EF4B28] hover:bg-[#EF4B28]/90 text-white font-bold py-2 px-4 rounded-md w-full transition-colors duration-200"
            onClick={onConfirm}
          >
            Adquirir Kit EPI
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EPIConfirmationModal;
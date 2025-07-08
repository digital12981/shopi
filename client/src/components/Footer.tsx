import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#EE4E2E] text-white py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/2560px-Shopee.svg.png"
              alt="Shopee Logo" 
              className="h-10 mb-2 mx-auto md:mx-0 bg-white p-1 rounded"
            />
            <p className="text-sm text-center md:text-left">© 2024 Shopee. Todos os direitos reservados.</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm opacity-80 mb-2">Programa de Parceiros Entregadores Shopee</p>
            <p className="text-xs opacity-70">Trabalhe conosco e faça parte da nossa equipe de entregas</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
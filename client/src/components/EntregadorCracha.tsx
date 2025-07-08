import React from 'react';

interface EntregadorCrachaProps {
  nome: string;
  cpf: string;
  cidade: string;
  fotoUrl: string;
}

const EntregadorCracha: React.FC<EntregadorCrachaProps> = ({ nome, cpf, cidade, fotoUrl }) => {
  return (
    <div className="relative">
      <div className="absolute -top-9 left-1/2 transform -translate-x-1/2">
        <img 
          src="https://i.ibb.co/7dsrFY5q/Entregador-Shopee-2-1-2-removebg-preview-2-1.png" 
          alt="Imagem de um crachá de entregador Shopee com design oficial, sem fundo, com um layout atualizado" 
          className="w-16 h-16 filter-none" 
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg w-80 p-4 pt-8">
        <div className="flex items-center mb-4 justify-start">
          <img 
            src="https://d290ny10omyv12.cloudfront.net/images/shopee-large.png" 
            alt="Shopee Logo" 
            className="w-40 h-auto -ml-[30px]" 
          />
        </div>
        <div className="flex">
          <div className="w-[100px] h-[120px] bg-gray-200 rounded mr-4 flex items-center justify-center">
            {fotoUrl ? (
              <img 
                src={fotoUrl} 
                alt="Foto de perfil do entregador" 
                className="w-full h-full object-cover rounded" 
              />
            ) : (
              <i className="fas fa-user text-gray-400 text-4xl"></i>
            )}
          </div>
          <div className="flex-grow h-[120px] flex flex-col justify-between">
            <h2 className="text-xs font-bold">Entregador Shopee</h2>
            <p className="text-[10px] text-gray-700 uppercase">{nome.toUpperCase()}</p>
            <hr className="border-gray-300" />
            <p className="text-[10px] text-gray-700">{cpf}</p>
            <hr className="border-gray-300" />
            <p className="text-[10px] text-gray-700 uppercase">{cidade.toUpperCase()}</p>
            <hr className="border-gray-300" />
            <div className="flex items-center text-red-500">
              <i className="fas fa-times-circle mr-1 text-xs"></i>
              <span className="font-bold text-xs">NÃO ATIVO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntregadorCracha;
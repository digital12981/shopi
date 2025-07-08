import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="bg-shopee py-14 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Torne-se um Motorista Parceiro Shopee Hoje!</h2>
        <p className="text-white mb-6 max-w-2xl mx-auto text-lg">Transforme seu veículo em uma fonte de renda extra com horários flexíveis e pagamentos instantâneos.</p>
        <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-4 md:space-y-0 mt-6">
          <div className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
            <span className="text-white font-bold text-3xl">27</span>
            <p className="text-white text-sm mt-1">Estados Atendidos</p>
          </div>
          <div className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
            <span className="text-white font-bold text-3xl">+5.000</span>
            <p className="text-white text-sm mt-1">Parceiros Ativos</p>
          </div>
          <div className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
            <span className="text-white font-bold text-3xl">24h</span>
            <p className="text-white text-sm mt-1">Suporte Disponível</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

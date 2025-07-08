import React from 'react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: "fas fa-money-bill-wave",
      title: "Pagamento Instantâneo",
      description: "Receba seu pagamento assim que finalizar a rota, sem precisar esperar."
    },
    {
      icon: "fas fa-clock",
      title: "Horários Flexíveis",
      description: "Escolha quando e onde quer trabalhar, com total autonomia para organizar sua agenda."
    },
    {
      icon: "fas fa-car",
      title: "Diversos Veículos",
      description: "Use seu veículo como fonte de renda: motos, carros, vans e mais."
    },
    {
      icon: "fas fa-route",
      title: "Rotas Otimizadas",
      description: "Sistema inteligente que agrupa entregas próximas, maximizando sua produtividade."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Suporte Dedicado",
      description: "Equipe especializada disponível para ajudar em qualquer situação durante seu trabalho."
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white to-orange-50 py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Vantagens de ser um Motorista Parceiro Shopee</h2>
          <div className="w-20 h-1 bg-custom-orange mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">Junte-se a milhares de motoristas que já estão transformando seu tempo em oportunidades lucrativas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:-translate-y-2 border-t-4 border-custom-orange">
              <div className="text-custom-orange text-4xl mb-4 flex justify-center">
                <i className={benefit.icon}></i>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-center">{benefit.title}</h3>
              <p className="text-gray-600 text-center text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 rounded-lg p-8 text-white shadow-lg" style={{ backgroundColor: '#EE4D2D' }}>
          <h3 className="text-xl font-bold mb-4">Você está no controle. Você define seus ganhos.</h3>
          <p className="max-w-3xl mx-auto">Na Shopee, acreditamos que você merece flexibilidade e recompensas justas pelo seu trabalho. Nossa plataforma foi projetada para valorizar cada entrega que você faz, garantindo os melhores ganhos do mercado.</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

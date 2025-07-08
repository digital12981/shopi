import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-8 text-[#555]">
      <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-200 pb-2">Como funciona o Programa Motoristas Parceiros da Shopee?</h2>
      <p className="mb-6 leading-relaxed">O Programa de Motoristas Parceiros da Shopee é uma oportunidade para quem deseja ganhar uma renda extra realizando coletas, transferências ou entregas de pacotes. Com horários flexíveis e autonomia para organizar sua agenda, você escolhe quando e onde quer trabalhar.</p>
      <p className="mb-6 leading-relaxed">A Shopee aceita diferentes tipos de veículos, como <span className="font-bold text-custom-orange">motos, carros de passeio (2 ou 4 portas), Fiorino, Kombi e vans</span>. Isso permite que mais pessoas possam participar e transformar seu veículo em uma fonte de renda.</p>

      <h3 className="text-lg font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">Ganhos como Motorista Parceiro Shopee</h3>
      <p className="mb-6 leading-relaxed">Na Shopee, os pagamentos são realizados de forma instantânea. Assim que o motorista finaliza a rota, o valor correspondente é imediatamente transferido para sua conta. Isso garante maior segurança e agilidade para nossos parceiros, permitindo que eles tenham acesso rápido aos seus ganhos e possam planejar melhor suas finanças.</p>

      <h3 className="text-lg font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">Como se cadastrar</h3>
      <p className="mb-6 leading-relaxed">O cadastro é totalmente online. Para participar, basta:</p>
      <ol className="list-decimal list-inside mb-6 pl-4">
        <li>Verificar a disponibilidade de vagas na sua região;</li>
        <li>Informar o modelo do seu veículo e seus dados pessoais;</li>
        <li>Se houver vagas disponíveis, clique no botão para iniciar o cadastro;</li>
        <li>Finalize o processo e aguarde a aprovação.</li>
      </ol>
      <p className="mb-6 leading-relaxed">Após o cadastro, você poderá acessar as rotas disponíveis, gerenciar sua agenda e acompanhar seus ganhos em tempo real diretamente pelo aplicativo.</p>
    </section>
  );
};

export default InfoSection;

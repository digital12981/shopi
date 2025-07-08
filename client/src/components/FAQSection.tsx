import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "Quais documentos são necessários para o cadastro?",
      answer: "Para se cadastrar como Motorista Parceiro, você precisará de CNH válida, documento do veículo, comprovante de residência e dados bancários para recebimento.",
      isOpen: false
    },
    {
      question: "Como funciona o pagamento?",
      answer: "O pagamento é realizado de forma instantânea após a finalização de cada rota. O valor é transferido diretamente para a conta bancária cadastrada.",
      isOpen: false
    },
    {
      question: "Posso escolher minha área de atuação?",
      answer: "Sim, você pode escolher as regiões onde deseja trabalhar, desde que haja disponibilidade de rotas nessas áreas.",
      isOpen: false
    }
  ]);

  const toggleFAQ = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index].isOpen = !updatedFaqs[index].isOpen;
    setFaqs(updatedFaqs);
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-8 text-center">Perguntas Frequentes</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="bg-gray-50 px-4 py-3 cursor-pointer flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <i className={`fas ${faq.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-custom-orange`}></i>
              </div>
              <div className="px-4 py-3" style={{ display: faq.isOpen ? 'block' : 'none' }}>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

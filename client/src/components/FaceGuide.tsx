import React from 'react';

interface FaceGuideProps {
  step: number;
  countdown: number | null;
}

/**
 * Componente que exibe um guia visual para posicionamento facial
 * O guia muda de tamanho e instruções dependendo do passo da verificação
 */
const FaceGuide: React.FC<FaceGuideProps> = ({ step, countdown }) => {
  // Determinar o tamanho do oval com base no passo atual
  // Passo 1: Oval grande - a pessoa deve se aproximar
  // Passo 2: Oval médio - ajustar posição
  // Passo 3: Oval pequeno - posição final para captura (maior que antes)
  const getOvalSize = () => {
    switch (step) {
      case 1: return 'scale-150';
      case 2: return 'scale-140';
      case 3: return 'scale-130';
      default: return 'scale-130';
    }
  };

  // Obter a mensagem de instrução com base no passo atual
  const getMessage = () => {
    if (countdown !== null) {
      return `Capturando em ${countdown}...`;
    }
    
    switch (step) {
      case 1: return 'Centralize seu rosto no oval';
      case 2: return 'Aproxime-se mais da câmera';
      case 3: return 'Mantenha a posição para a captura';
      default: return 'Preparando...';
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      {/* Oval guia facial (SVG) */}
      <div className={`relative ${getOvalSize()} transition-transform duration-1000`}>
        <div className="w-56 h-72 mx-auto relative">
          <svg 
            viewBox="0 0 100 130" 
            className="absolute inset-0 w-full h-full"
          >
            <ellipse 
              cx="50" 
              cy="65" 
              rx="35" 
              ry="50" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
              strokeDasharray="5,3"
              className="drop-shadow-lg"
            />
          </svg>
        </div>
      </div>
      
      {/* Instruções */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="bg-black bg-opacity-50 text-white py-2 px-4 rounded-lg mx-auto inline-block">
          {getMessage()}
        </p>
      </div>
    </div>
  );
};

export default FaceGuide;
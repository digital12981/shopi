import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import FaceGuide from '@/components/FaceGuide';

const Selfie = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [faceGuideStep, setFaceGuideStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Inicializa a câmera
  useEffect(() => {
    // Resetar estados quando componente é montado
    setCapturedImage(null);
    setIsVerifying(false);
    setVerificationSuccess(false);
    setFaceGuideStep(0);
    setCountdown(null);
    
    // Rolar para o topo da página
    window.scrollTo(0, 0);
    
    // Inicializar câmera
    const initCamera = async () => {
      try {
        // Solicitar permissão para a câmera frontal
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        
        // Conectar o stream ao elemento de vídeo
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
          
          // Iniciar a sequência de guia facial após câmera estar pronta
          startFaceGuideSequence();
        }
      } catch (err) {
        console.error('Erro ao acessar a câmera:', err);
        alert('Não foi possível acessar a câmera. Por favor, permita o acesso à câmera e recarregue a página.');
      }
    };
    
    initCamera();
    
    // Cleanup da câmera ao desmontar o componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  // Sequência do guia facial
  const startFaceGuideSequence = () => {
    // Passo 1: Círculo distante, pedindo para centralizar
    setFaceGuideStep(1);
    
    // Passo 2: após 4 segundos, círculo médio, pedindo para aproximar
    setTimeout(() => {
      setFaceGuideStep(2);
    }, 4000);
    
    // Passo 3: após mais 3 segundos, círculo próximo, centralização final
    setTimeout(() => {
      setFaceGuideStep(3);
      
      // Iniciar contagem regressiva de 3 segundos
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount === null || prevCount <= 1) {
            clearInterval(countdownInterval);
            // Capturar automaticamente após contagem
            setTimeout(() => {
              captureImage();
            }, 500);
            return null;
          }
          return prevCount - 1;
        });
      }, 1000);
    }, 7000);
  };
  
  // Captura a imagem da câmera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Configurar canvas para o tamanho do vídeo (quadrado)
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      // Centralizar a captura
      const xOffset = (video.videoWidth - size) / 2;
      const yOffset = (video.videoHeight - size) / 2;
      
      // Desenhar a imagem no canvas com espelhamento horizontal
      const context = canvas.getContext('2d');
      if (context) {
        // Aplicar transformação para espelhar a imagem horizontalmente
        context.translate(size, 0);
        context.scale(-1, 1);
        
        context.drawImage(
          video, 
          xOffset, yOffset, size, size,
          0, 0, size, size
        );
        
        // Resetar a transformação para o estado padrão
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        // Converter para data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
      }
    }
  };
  
  // Tirar uma nova foto
  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setIsCameraReady(false);
    
    // Reimplementação baseada no initCamera original
    const reinitCamera = async () => {
      try {
        // Se o vídeo já estava com um stream, precisamos interrompê-lo
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Solicitar nova permissão para a câmera frontal
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        
        // Conectar o novo stream ao elemento de vídeo
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
            setFaceGuideStep(1);
            startFaceGuideSequence();
          };
        }
      } catch (err) {
        console.error('Erro ao reiniciar a câmera:', err);
        alert('Não foi possível reiniciar a câmera. Por favor, recarregue a página.');
      }
    };
    
    reinitCamera();
  };
  
  // Enviar a foto e processar
  const handleSubmitPhoto = () => {
    setIsVerifying(true);
    
    // Simulação de verificação por 6 segundos
    setTimeout(() => {
      setVerificationSuccess(true);
      
      // Salvar a foto no localStorage para uso posterior no crachá
      if (capturedImage) {
        localStorage.setItem('selfie_image', capturedImage);
      }
      
      // Após mais 2 segundos, redirecionar para a página de recebedor
      setTimeout(() => {
        navigate('/recebedor');
      }, 2000);
    }, 6000);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Selfie para o Crachá</h1>
          
          <p className="text-center text-gray-600 mb-8">
            Precisamos de uma foto sua para o crachá de identificação Shopee. 
            Por favor, olhe diretamente para a câmera e siga as instruções.
          </p>
          
          <div className="relative mx-auto mb-6">
            {/* Container da câmera/foto com formato quadrado */}
            <div 
              className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden border-2 border-gray-300"
              style={{ maxHeight: '400px' }}
            >
              {/* Elemento de vídeo (câmera) */}
              {!capturedImage && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform scale-x-[-1] ${isCameraReady ? '' : 'hidden'}`}
                    onLoadedMetadata={() => setIsCameraReady(true)}
                  />
                  {!isCameraReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                      <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full mb-3"></div>
                      <p className="text-sm font-medium">Inicializando câmera...</p>
                    </div>
                  )}
                </>
              )}
              
              {/* Imagem capturada */}
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Selfie capturada" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Canvas para captura (oculto) */}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Guia de posicionamento facial */}
              {!capturedImage && isCameraReady && faceGuideStep > 0 && (
                <FaceGuide 
                  step={faceGuideStep} 
                  countdown={countdown}
                />
              )}
              
              {/* Overlay de verificação */}
              {isVerifying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
                  {!verificationSuccess ? (
                    <>
                      <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
                      <p className="text-xl font-medium">Verificando Selfie...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xl font-medium">Selfie Verificada!</p>
                      <p className="text-sm mt-2">Redirecionando...</p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Botões de ação (apenas visíveis quando a foto foi tirada e não está verificando) */}
            {capturedImage && !isVerifying && (
              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={handleRetakePhoto}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3"
                >
                  Tirar Nova Foto
                </Button>
                <Button
                  onClick={handleSubmitPhoto}
                  className="flex-1 bg-[#E83D22] hover:bg-[#d73920] text-white font-medium py-3"
                >
                  Enviar Foto
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Sua foto será usada apenas para o crachá de identificação Shopee e não será compartilhada com terceiros.</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Selfie;
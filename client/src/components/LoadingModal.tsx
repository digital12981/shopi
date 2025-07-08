import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface LoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  loadingSteps: string[];
  title: string;
  completionMessage: string;
  loadingTime?: number;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  onComplete,
  loadingSteps,
  title,
  completionMessage,
  loadingTime = 7000
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [finishText, setFinishText] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setCurrentStep(0);
      setIsComplete(false);
      setFinishText('');
      return;
    }

    const stepInterval = loadingTime / (loadingSteps.length + 1);
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else if (prev === loadingSteps.length - 1 && !isComplete) {
          setIsComplete(true);
          setFinishText(completionMessage);
          setTimeout(() => {
            onComplete();
          }, 1500);
          return prev;
        }
        return prev;
      });
    }, stepInterval);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, loadingSteps.length, onComplete, completionMessage, loadingTime]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent className="p-0 sm:max-w-none w-full h-full max-h-screen overflow-hidden border-none shadow-none bg-white">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Processando sua solicitação...</DialogDescription>
        
        <div className="absolute top-0 left-0 w-full h-full bg-white z-0"></div>
        
        <div className="relative flex flex-col justify-center items-center h-screen bg-transparent z-10">
          {/* Loader */}
          {!isComplete && (
            <div className="flex space-x-2 mb-8 fixed top-1/4">
              <div className="loading-dot w-3 h-3 bg-[#E83D22] rounded-full"></div>
              <div className="loading-dot w-3 h-3 bg-[#E83D22] rounded-full"></div>
              <div className="loading-dot w-3 h-3 bg-[#E83D22] rounded-full"></div>
            </div>
          )}
          
          {/* Status Modal */}
          <div className="w-11/12 max-w-md mt-48">
            <h2 className="font-semibold text-lg text-center mb-6">{title}</h2>

            <div className="space-y-3">
              {loadingSteps.map((step, index) => (
                <div 
                  key={index} 
                  id={`status${index+1}`} 
                  className={`status-item flex items-center p-2 bg-gray-100 rounded-lg ${index <= currentStep ? 'active' : ''}`}
                >
                  <div className={`status-icon bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 ${index <= currentStep ? 'bg-[#E83D22]' : ''}`}>
                    {index < currentStep ? (
                      <i className="fas fa-check text-sm"></i>
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className={`status-text text-gray-600 text-sm ${index <= currentStep ? 'text-gray-900' : ''}`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
            
            {isComplete && (
              <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-center text-green-700 font-medium">
                  {finishText}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* CSS animações são adicionadas ao arquivo index.css */}
      </DialogContent>
    </Dialog>
  );
};
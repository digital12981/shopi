import { useEffect, useState } from 'react';

interface WhatsAppDetectorProps {
  children: React.ReactNode;
}

export const WhatsAppDetector: React.FC<WhatsAppDetectorProps> = ({ children }) => {
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  useEffect(() => {
    // Detectar se está no navegador do WhatsApp
    const isWhatsApp = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return (
        userAgent.includes('whatsapp') ||
        userAgent.includes('wv') && userAgent.includes('version/') ||
        // Detectar WebView do WhatsApp
        (userAgent.includes('mobile') && userAgent.includes('safari') && !userAgent.includes('chrome')) ||
        // Detectar in-app browser do WhatsApp
        window.location.href.includes('wa.me') ||
        document.referrer.includes('whatsapp')
      );
    };

    // Detectar se está em um WebView (navegador interno)
    const isInAppBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isStandalone = window.navigator.standalone;
      const isWebView = window.innerHeight === screen.height; // Indicativo de WebView
      
      return (
        userAgent.includes('wv') || // WebView
        userAgent.includes('fb') || // Facebook
        userAgent.includes('twitter') || // Twitter
        userAgent.includes('instagram') || // Instagram
        userAgent.includes('tiktok') || // TikTok
        userAgent.includes('line') || // LINE
        userAgent.includes('micromessenger') || // WeChat
        userAgent.includes('telegram') || // Telegram
        userAgent.includes('snapchat') || // Snapchat
        // Detectar browsers internos de apps
        (userAgent.includes('mobile') && !userAgent.includes('chrome') && !userAgent.includes('firefox') && !userAgent.includes('safari')) ||
        // Detectar se não tem barra de endereço (indicativo de WebView)
        isWebView ||
        // Detectar se é standalone (PWA dentro de app)
        isStandalone
      );
    };

    // Detectar se vem de anúncio do TikTok
    const isFromTikTokAd = () => {
      const referrer = document.referrer.toLowerCase();
      const urlParams = new URLSearchParams(window.location.search);
      
      return (
        referrer.includes('tiktok') ||
        referrer.includes('bytedance') ||
        urlParams.get('utm_source') === 'tiktok' ||
        urlParams.get('utm_medium') === 'tiktok' ||
        urlParams.get('fbclid') || // Facebook Ads
        urlParams.get('gclid') || // Google Ads
        urlParams.get('test_whatsapp') === 'true' || // Para teste
        window.location.href.includes('tt_') || // TikTok tracking
        localStorage.getItem('tiktok_ad_click') === 'true'
      );
    };

    // Log para debug
    console.log('Browser Detection:', {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      isWhatsApp: isWhatsApp(),
      isInAppBrowser: isInAppBrowser(),
      isFromTikTokAd: isFromTikTokAd()
    });

    // Verificar se precisa redirecionar (incluindo teste manual)
    const urlParams = new URLSearchParams(window.location.search);
    const forceTest = urlParams.get('test_whatsapp') === 'true';
    
    if (isWhatsApp() || isInAppBrowser() || forceTest) {
      setShowRedirectModal(true);
      
      // Salvar que veio de anúncio do TikTok
      if (isFromTikTokAd()) {
        localStorage.setItem('tiktok_ad_click', 'true');
      }
    }
  }, []);

  const handleOpenInChrome = () => {
    const currentUrl = window.location.href;
    
    // Múltiplas tentativas para abrir no Chrome
    const tryOpenInChrome = () => {
      // Método 1: Deep link do Chrome
      const chromeUrl = `googlechrome://${currentUrl.replace(/^https?:\/\//, '')}`;
      window.location.href = chromeUrl;
      
      // Método 2: Intent do Android para Chrome
      const androidIntent = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      
      // Método 3: Tentar abrir com window.open
      setTimeout(() => {
        try {
          window.open(androidIntent, '_blank');
        } catch (e) {
          // Fallback final
          window.open(currentUrl, '_blank');
        }
      }, 500);
    };
    
    // Copiar URL para clipboard como backup
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        console.log('URL copiada para clipboard');
      });
    }
    
    // Mostrar instruções para o usuário
    const instructions = `
      Para uma melhor experiência:
      1. Toque nos 3 pontos no canto superior direito
      2. Selecione "Abrir no Chrome"
      3. Ou copie este link: ${currentUrl}
    `;
    
    // Tentar abrir no Chrome
    tryOpenInChrome();
    
    // Mostrar toast com instruções
    if (window.alert) {
      setTimeout(() => {
        window.alert(instructions);
      }, 2000);
    }
    
    setShowRedirectModal(false);
  };

  const handleContinueAnyway = () => {
    setShowRedirectModal(false);
  };

  if (showRedirectModal) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-30 backdrop-blur-lg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Melhor experiência no Chrome
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Para uma experiência otimizada e segura, recomendamos abrir este site no 
                <span className="font-semibold text-blue-600"> Google Chrome</span>.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleOpenInChrome}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🌐 Abrir no Chrome
              </button>
              
              <button
                onClick={handleContinueAnyway}
                className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Continuar aqui mesmo
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                📱 Anúncio TikTok? Chrome = Melhor experiência!
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                💡 Dica: Toque nos 3 pontos e "Abrir no navegador"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WhatsAppDetector;
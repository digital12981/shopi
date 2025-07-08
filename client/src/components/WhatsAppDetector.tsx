import { useEffect, useState } from 'react';

interface WhatsAppDetectorProps {
  children: React.ReactNode;
}

export const TikTokChromeDetector: React.FC<WhatsAppDetectorProps> = ({ children }) => {

  useEffect(() => {
    // Detectar se está no navegador interno do TikTok
    const isTikTokInAppBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return (
        userAgent.includes('tiktok') ||
        userAgent.includes('musically') ||
        userAgent.includes('bytedance') ||
        userAgent.includes('com.zhiliaoapp.musically') || // TikTok package name
        // Detectar WebView específico do TikTok
        (userAgent.includes('mobile') && userAgent.includes('webview') && userAgent.includes('tiktok'))
      );
    };

    // Detectar qualquer WebView de rede social que pode vir de anúncios
    const isSocialMediaWebView = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isStandalone = window.navigator.standalone;
      
      return (
        userAgent.includes('wv') || // WebView genérico
        userAgent.includes('fb') || // Facebook
        userAgent.includes('twitter') || // Twitter
        userAgent.includes('instagram') || // Instagram
        userAgent.includes('line') || // LINE
        userAgent.includes('telegram') || // Telegram
        userAgent.includes('snapchat') || // Snapchat
        userAgent.includes('whatsapp') || // WhatsApp
        // Detectar browsers internos de apps mobile
        (userAgent.includes('mobile') && userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('chrome')) ||
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
        urlParams.get('utm_campaign')?.includes('tiktok') ||
        urlParams.get('test_tiktok') === 'true' || // Para teste
        window.location.href.includes('tt_') || // TikTok tracking
        window.location.href.includes('ttclid') || // TikTok Click ID
        localStorage.getItem('tiktok_ad_click') === 'true'
      );
    };

    // Log para debug
    console.log('TikTok Chrome Detection:', {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      isTikTokInAppBrowser: isTikTokInAppBrowser(),
      isSocialMediaWebView: isSocialMediaWebView(),
      isFromTikTokAd: isFromTikTokAd(),
      urlParams: Object.fromEntries(new URLSearchParams(window.location.search))
    });

    // REDIRECIONAMENTO AUTOMÁTICO PARA CHROME - SEM MODAL
    const urlParams = new URLSearchParams(window.location.search);
    const forceTest = urlParams.get('test_tiktok') === 'true';
    const shouldRedirect = isTikTokInAppBrowser() || (isSocialMediaWebView() && isFromTikTokAd()) || forceTest;
    
    if (shouldRedirect) {
      console.log('🎵 TikTok detectado! Redirecionando para Chrome IMEDIATAMENTE...');
      localStorage.setItem('tiktok_ad_click', 'true');
      
      // REDIRECIONAMENTO INSTANTÂNEO E SILENCIOSO
      const currentUrl = window.location.href;
      
      // Método 1: Deep link do Chrome (mais direto)
      const chromeUrl = `googlechrome://${currentUrl.replace(/^https?:\/\//, '')}`;
      
      // Método 2: Intent do Android para Chrome
      const androidIntent = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      
      // EXECUTAR REDIRECIONAMENTO IMEDIATO - SEM DELAY
      console.log('🚀 Tentando abrir no Chrome com URL:', chromeUrl);
      
      // Múltiplas estratégias simultâneas para maior eficácia
      try {
        // Estratégia 1: Deep link imediato
        window.location.href = chromeUrl;
        console.log('✅ Deep link executado');
      } catch (error) {
        console.log('❌ Deep link falhou:', error);
      }
      
      // Estratégia 2: Intent para Android (simultâneo)
      try {
        setTimeout(() => {
          window.location.href = androidIntent;
          console.log('✅ Intent Android executado');
        }, 200);
      } catch (error) {
        console.log('❌ Intent Android falhou:', error);
      }
      
      // Estratégia 3: Fallback com window.open (caso os outros falhem)
      setTimeout(() => {
        try {
          window.open(currentUrl, '_blank');
          console.log('✅ Fallback window.open executado');
        } catch (error) {
          console.log('❌ Todos os métodos falharam:', error);
        }
      }, 500);
    }
  }, []);

  // Retorna o conteúdo normalmente - redirecionamento é silencioso
  return <>{children}</>;
};
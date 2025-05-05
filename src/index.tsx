'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './components/ChatWidget';

// Declarar tipos globales
declare global {
  interface Window {
    NNIA: {
      initWidget: (config: {
        apiUrl: string;
        clientID?: string;
        platform?: 'client-website' | 'client-panel' | 'social-media';
      }) => void;
    }
  }
}

interface NiaChatWidgetProps {
  apiUrl: string;
  context: {
    platform: 'client-website' | 'client-panel' | 'social-media';
    clientID?: string;
    conversationID?: string;
  };
}

const NiaChatWidget: React.FC<NiaChatWidgetProps> = ({ apiUrl, context }) => {
  return <ChatWidget apiUrl={apiUrl} context={context} />;
};

const initWidget = (config: {
  apiUrl: string;
  clientID?: string;
  platform?: 'client-website' | 'client-panel' | 'social-media';
}) => {
  // Asegurarse de que React esté disponible
  if (!window.React) {
    console.error('React no está disponible. Asegúrate de cargar React antes del widget.');
    return;
  }

  const container = document.createElement('div');
  container.id = 'nia-widget-container';
  document.body.appendChild(container);

  try {
    const root = createRoot(container);
    root.render(
      <NiaChatWidget 
        apiUrl={config.apiUrl} 
        context={{ 
          platform: config.platform || 'client-website',
          clientID: config.clientID
        }} 
      />
    );
  } catch (error) {
    console.error('Error al inicializar el widget:', error);
  }
};

// Crear el objeto NNIA
const NNIA = {
  initWidget
};

// Exportar al objeto global window
if (typeof window !== 'undefined') {
  window.NNIA = NNIA;
}

// Exportar para uso en módulos
export { initWidget };
export default NNIA; 
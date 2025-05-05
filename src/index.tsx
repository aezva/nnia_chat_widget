'use client';

import React from 'react';
import ReactDOM from 'react-dom';
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
  const container = document.createElement('div');
  container.id = 'nia-widget-container';
  document.body.appendChild(container);

  ReactDOM.render(
    <React.StrictMode>
      <NiaChatWidget 
        apiUrl={config.apiUrl} 
        context={{ 
          platform: config.platform || 'client-website',
          clientID: config.clientID
        }} 
      />
    </React.StrictMode>,
    container
  );
};

// Exportar al objeto global window
const NNIA = {
  initWidget
};

if (typeof window !== 'undefined') {
  window.NNIA = NNIA;
}

export { initWidget };
export default NNIA; 
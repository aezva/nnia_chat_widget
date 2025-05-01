'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';

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

const initWidget = () => {
  const container = document.createElement('div');
  container.id = 'nia-widget-container';
  document.body.appendChild(container);

  ReactDOM.render(
    <React.StrictMode>
      <NiaChatWidget apiUrl="https://example.com" context={{ platform: 'client-website' }} />
    </React.StrictMode>,
    container
  );
};

// Inicializar el widget cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}

export default NiaChatWidget; 
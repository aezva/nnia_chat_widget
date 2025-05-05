'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './components/ChatWidget';
import './styles/ChatWidget.module.css';

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
      <ChatWidget 
        apiUrl={config.apiUrl} 
        clientID={config.clientID || 'test-client-id'}
        platform={config.platform || 'client-website'}
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
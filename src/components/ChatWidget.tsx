'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/ChatWidget.module.css';
import ChatService from '../services/chat';
import { NNIAContext } from '../services/context';

interface ChatWidgetProps {
  apiUrl: string;
  clientID: string;
  platform: 'client-website' | 'client-panel' | 'social-media';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ apiUrl, clientID, platform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);

  useEffect(() => {
    try {
      const context: NNIAContext = {
        platform,
        clientID,
      };
      const service = new ChatService(context, apiUrl);
      setChatService(service);
    } catch (error) {
      console.warn('Error inicializando el servicio de chat:', error);
      // Continuamos con el widget incluso si hay error en la inicialización
    }
  }, [apiUrl, clientID, platform]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowWelcome(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      if (chatService) {
        const response = await chatService.processMessage(userMessage);
        setMessages(prev => [...prev, { text: response, isUser: false }]);
      } else {
        // Respuesta de fallback si el servicio no está disponible
        setMessages(prev => [...prev, { 
          text: 'Gracias por tu mensaje. Estoy procesando tu consulta.', 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [...prev, { 
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {showWelcome && (
        <div className={styles.welcomeBubble} onClick={handleOpenChat}>
          ¡Hola! ¿En qué puedo ayudarte hoy?
        </div>
      )}
      
      <button 
        className={styles.floatingIcon} 
        onClick={handleOpenChat}
        aria-label="Abrir chat"
      />

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <img 
                src="https://aezva.com/wp-content/uploads/2025/04/web-200x200-1.webp" 
                alt="NNIA" 
                width="30"
                height="30"
              />
              <span>NNIA Chat</span>
            </div>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseChat}
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${message.isUser ? styles.userMessage : styles.niaMessage}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className={styles.loadingIndicator}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            )}
          </div>

          <div className={styles.chatFooter}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              aria-label="Mensaje"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 
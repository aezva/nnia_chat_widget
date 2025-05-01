'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/ChatWidget.module.css';
import ChatService from '../services/chatService';

interface Message {
  text: string;
  from: 'user' | 'nia';
  timestamp: string;
}

interface ChatWidgetProps {
  apiUrl: string;
  context: {
    platform: 'client-website' | 'client-panel' | 'social-media';
    clientID?: string;
    conversationID?: string;
  };
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ apiUrl, context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const [platform, setPlatform] = useState<'client-website' | 'client-panel' | 'social-media'>('client-website');

  useEffect(() => {
    const getClientID = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlClientID = urlParams.get('clientID');
      
      if (urlClientID) {
        return urlClientID;
      }

      const pathParts = window.location.pathname.split('/');
      const pathClientID = pathParts[pathParts.length - 1];
      
      if (pathClientID && pathClientID !== 'client-panel') {
        return pathClientID;
      }

      return undefined;
    };

    const detectPlatform = () => {
      const hostname = window.location.hostname;

      // Para desarrollo local
      if (window.location.href.includes('client-panel')) {
        return 'client-panel';
      }

      if (hostname.includes('facebook.com') || hostname.includes('instagram.com')) {
        return 'social-media';
      }

      return 'client-website';
    };

    const init = async () => {
      const clientID = getClientID();
      const detectedPlatform = detectPlatform();
      setPlatform(detectedPlatform);
      console.log('Platform detected:', detectedPlatform);

      const service = new ChatService(context, apiUrl);
      setChatService(service);

      if (clientID) {
        const history = await service.getConversationHistory();
        setMessages(history);
      }
    };

    init();

    // Ocultar la burbuja después de 6 segundos y mostrar mensaje de bienvenida
    const bubbleTimer = setTimeout(() => {
      setShowWelcomeBubble(false);
      if (platform === 'client-panel') {
        addMessage(`¡Hola! ¿En qué puedo ayudarte hoy?`, 'nia');
      } else {
        addMessage('¡Hola! Soy NNIA, ¿en qué puedo ayudarte?', 'nia');
      }
    }, 6000);

    return () => clearTimeout(bubbleTimer);
  }, []);

  const addMessage = async (text: string, from: 'user' | 'nia') => {
    const newMessage: Message = {
      text,
      from,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    
    if (chatService) {
      await chatService.saveMessage(newMessage);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { text: inputValue, from: 'user' as const };
    setInputValue('');
    setHasInteracted(true);

    await addMessage(userMessage.text, userMessage.from);

    try {
      const response = await chatService?.processMessage(userMessage.text);
      if (response) {
        await addMessage(response, 'nia');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      await addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', 'nia');
    } finally {
      setIsLoading(false);
    }
  };

  const getBubbleMessage = () => {
    if (platform === 'client-panel') {
      return `¡Hola!`;
    }
    return '¡Hola! Soy NNIA, ¿en qué puedo ayudarte?';
  };

  return (
    <div className={styles.widgetContainer}>
      {showWelcomeBubble && !hasInteracted && (
        <div className={styles.welcomeBubble} onClick={() => {
          setIsOpen(true);
          setShowWelcomeBubble(false);
        }}>
          {getBubbleMessage()}
        </div>
      )}

      <button 
        className={styles.floatingIcon}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <img 
                src="https://aezva.com/wp-content/uploads/2025/04/web-200x200-1.webp" 
                alt="NNIA"
              />
              NNIA
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.from === 'user' ? styles.userMessage : styles.niaMessage
                }`}
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
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className={styles.chatInput}
            />
            <button
              onClick={handleSendMessage}
              className={styles.sendButton}
              disabled={isLoading}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 
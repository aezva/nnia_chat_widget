'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/ChatWidget.module.css';
import ChatService from '../services/ChatService';

interface ChatWidgetProps {
  apiUrl: string;
  clientID: string;
  platform: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ apiUrl, clientID, platform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chatService = new ChatService(apiUrl, clientID, platform);
    // Aquí podrías inicializar el servicio de chat si es necesario
  }, [apiUrl, clientID, platform]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowWelcome(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // Aquí iría la lógica para enviar el mensaje al backend
      // Por ahora, simulamos una respuesta
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'Gracias por tu mensaje. Estoy procesando tu consulta.', isUser: false }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
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
      
      <button className={styles.floatingIcon} onClick={handleOpenChat} />

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <img src="https://aezva.com/wp-content/uploads/2025/04/web-200x200-1.webp" alt="NNIA" />
              <span>NNIA Chat</span>
            </div>
            <button className={styles.closeButton} onClick={handleCloseChat}>×</button>
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 
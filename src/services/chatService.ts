interface Message {
  text: string;
  from: 'user' | 'nia';
  timestamp: string;
}

interface Alert {
  id: string;
  type: 'reminder' | 'notification' | 'task';
  message: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'dismissed';
  dueDate?: string;
}

interface ChatContext {
  platform: 'client-website' | 'client-panel' | 'social-media';
  clientID?: string;
  conversationID?: string;
}

interface ClientInfo {
  name: string;
  email: string;
}

class ChatService {
  private context: ChatContext;
  private clientInfo: ClientInfo | null = null;
  private API_BASE_URL: string;

  constructor(context: ChatContext, apiUrl: string = 'http://localhost:8000/api/v1') {
    this.context = context;
    this.API_BASE_URL = apiUrl;
  }

  private detectPlatform(): 'client-website' | 'client-panel' | 'social-media' {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const port = window.location.port;

    // Detectar si estamos en el client panel
    if (
      (hostname === 'localhost' && port === '4000') || // Desarrollo
      (hostname === 'localhost' && pathname.includes('/client-panel')) || // Desarrollo alternativo
      pathname.includes('/client-panel') // Producción
    ) {
      return 'client-panel';
    }

    // Detectar redes sociales
    if (hostname.includes('facebook.com') || hostname.includes('instagram.com')) {
      return 'social-media';
    }

    // Por defecto, asumimos que es un sitio web de cliente
    return 'client-website';
  }

  async getClientInfo(): Promise<ClientInfo | null> {
    if (this.context.platform !== 'client-panel' || !this.context.clientID) {
      return null;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/client/info?clientID=${this.context.clientID}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener la información del cliente');
      }

      const data = await response.json();
      this.clientInfo = data;
      return data;
    } catch (error) {
      console.error('Error al obtener la información del cliente:', error);
      return null;
    }
  }

  async saveMessage(message: Message): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          context: this.context,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el mensaje');
      }
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  }

  async getConversationHistory(): Promise<Message[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/chat/messages?clientID=${this.context.clientID}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener el historial');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      return [];
    }
  }

  async processMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          thread_id: this.context.conversationID,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el mensaje');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
      throw error;
    }
  }

  async getThreadMessages(threadId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/thread/${threadId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los mensajes del thread');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      throw error;
    }
  }

  async createAlert(alertData: Omit<Alert, 'id'>): Promise<Alert | null> {
    if (this.context.platform !== 'client-panel' || !this.context.clientID) {
      return null;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...alertData,
          clientID: this.context.clientID,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la alerta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear la alerta:', error);
      return null;
    }
  }

  async getAlerts(): Promise<Alert[]> {
    if (this.context.platform !== 'client-panel' || !this.context.clientID) {
      return [];
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/alerts?clientID=${this.context.clientID}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener las alertas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener las alertas:', error);
      return [];
    }
  }

  async updateAlertStatus(alertId: string, status: Alert['status']): Promise<boolean> {
    if (this.context.platform !== 'client-panel' || !this.context.clientID) {
      return false;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          clientID: this.context.clientID,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error al actualizar el estado de la alerta:', error);
      return false;
    }
  }
}

export default ChatService; 
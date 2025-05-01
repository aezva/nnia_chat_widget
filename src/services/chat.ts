import axios from 'axios';
import ContextService, { NNIAContext } from './context';

interface ChatResponse {
  message: string;
}

interface HistoryResponse {
  history: Array<{
    text: string;
    from: string;
    timestamp: string;
  }>;
}

export class ChatService {
  private api: ReturnType<typeof axios.create>;
  private contextService: ContextService;

  constructor(context: NNIAContext, apiUrl: string) {
    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.contextService = new ContextService(context);

    // Configurar interceptor para agregar token
    this.api.interceptors.request.use((config) => {
      const token = this.contextService.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async processMessage(message: string): Promise<string> {
    try {
      const context = this.contextService.getContext();
      const response = await this.api.post<ChatResponse>('/chat', {
        message,
        context,
      });

      if (response.data && response.data.message) {
        await this.saveMessageToHistory(message, response.data.message);
        return response.data.message;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  async getConversationHistory(): Promise<Array<{ text: string; from: string; timestamp: string }>> {
    try {
      const context = this.contextService.getContext();
      const response = await this.api.get<HistoryResponse>('/history', {
        params: { context },
      });
      return response.data.history || [];
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  async saveMessage(message: { text: string; from: string; timestamp: string }): Promise<void> {
    try {
      const context = this.contextService.getContext();
      await this.api.post('/history', {
        message,
        context,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  private async saveMessageToHistory(userMessage: string, niaResponse: string): Promise<void> {
    try {
      const context = this.contextService.getContext();
      await this.api.post('/history', {
        userMessage,
        niaResponse,
        context,
      });
    } catch (error) {
      console.error('Error saving message history:', error);
    }
  }
} 
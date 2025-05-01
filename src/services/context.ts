export interface NNIAContext {
  platform: 'client-website' | 'client-panel' | 'social-media';
  clientID?: string;
  conversationID?: string;
}

export default class ContextService {
  private context: NNIAContext;

  constructor(context: NNIAContext) {
    this.context = context;
  }

  getContext(): NNIAContext {
    return this.context;
  }

  getToken(): string | null {
    if (this.context.platform === 'client-panel') {
      return localStorage.getItem('supabase.auth.token');
    }
    return null;
  }
} 
import { Linking } from 'react-native';

export interface DeepLinkData {
  token?: string;
  netid?: string;
  error?: string;
}

export class DeepLinkService {
  private static instance: DeepLinkService;
  private listeners: ((data: DeepLinkData) => void)[] = [];

  private constructor() {
    this.initialize();
  }

  public static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService();
    }
    return DeepLinkService.instance;
  }

  private initialize() {
    // Handle deep links when app is already running
    Linking.addEventListener('url', this.handleDeepLink);
    
    // Handle deep links when app is launched from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeepLink({ url });
      }
    });
  }

  private handleDeepLink = (event: { url: string }) => {
    const { url } = event;
    console.log('🔗 [DEEP LINK] Received URL:', url);

    if (url.startsWith('yideshare://auth/')) {
      const data = this.parseAuthUrl(url);
      console.log('🔗 [DEEP LINK] Parsed auth data:', data);
      
      // Notify all listeners
      this.listeners.forEach(listener => listener(data));
    }
  };

  private parseAuthUrl(url: string): DeepLinkData {
    try {
      // Parse URL manually since React Native doesn't have full URL API
      const urlParts = url.split('?');
      if (urlParts.length < 2) {
        return { error: 'No query parameters found' };
      }
      
      const queryString = urlParts[1];
      const params: { [key: string]: string } = {};
      
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
      
      return {
        token: params.token || undefined,
        netid: params.netid || undefined,
        error: params.error || undefined,
      };
    } catch (error) {
      console.error('🔗 [DEEP LINK] Error parsing URL:', error);
      return { error: 'Invalid URL format' };
    }
  }

  public addListener(listener: (data: DeepLinkData) => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (data: DeepLinkData) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  public cleanup() {
    Linking.removeAllListeners('url');
  }
}
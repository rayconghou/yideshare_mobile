import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CASService, { UserProfile } from '../services/CASService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  handleAuthCallback: (url: string) => Promise<{ success: boolean; message: string }>;
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const casService = CASService.getInstance();

  useEffect(() => {
    // Check for stored authentication on app start
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const session = await casService.getCurrentSession();
      if (session) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const result = await casService.initiateLogin();
      return result;
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 [AUTH CONTEXT DEBUG] Starting logout process');
      await casService.logout();
      setUser(null);
      console.log('🚪 [AUTH CONTEXT DEBUG] Logout completed - user set to null');
    } catch (error) {
      console.error('💥 [AUTH CONTEXT DEBUG] Error during logout:', error);
    }
  };

  const handleAuthCallback = async (url: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔄 [AUTH CONTEXT DEBUG] Handling auth callback in context');
      const result = await casService.handleCallback(url);
      if (result.success && result.user) {
        console.log('✅ [AUTH CONTEXT DEBUG] Setting user in context:', JSON.stringify(result.user, null, 2));
        console.log(`🔑 [AUTH CONTEXT DEBUG] USER NETID SET IN CONTEXT: ${result.user.netid}`);
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('💥 [AUTH CONTEXT DEBUG] Error handling auth callback:', error);
      return { success: false, message: 'Callback handling failed' };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    handleAuthCallback,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

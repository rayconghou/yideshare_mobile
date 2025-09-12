import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface CASWebViewProps {
  onAuthSuccess: (userData: any) => void;
  onAuthFailure: () => void;
}

const CASWebView: React.FC<CASWebViewProps> = ({ onAuthSuccess, onAuthFailure }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMockLogin, setShowMockLogin] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowMockLogin(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleMockLogin = () => {
    // Simulate successful authentication
    const mockUserData = {
      netId: 'testuser',
      name: 'Test User',
      email: 'test.user@yale.edu'
    };
    
    login(mockUserData);
    onAuthSuccess(mockUserData);
  };

  const handleMockFailure = () => {
    onAuthFailure();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Yale CAS...</Text>
      </View>
    );
  }

  if (showMockLogin) {
    return (
      <View style={styles.mockContainer}>
        <Text style={styles.mockTitle}>Yale CAS Login (Mock)</Text>
        <Text style={styles.mockSubtitle}>
          This is a demonstration of Yale CAS authentication.
          In a real app, this would redirect to the actual Yale CAS login page.
        </Text>
        
        <View style={styles.mockForm}>
          <Text style={styles.mockLabel}>NetID: testuser</Text>
          <Text style={styles.mockLabel}>Password: ••••••••</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.successButton} 
            onPress={handleMockLogin}
          >
            <Text style={styles.buttonText}>Login Successfully</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.failureButton} 
            onPress={handleMockFailure}
          >
            <Text style={styles.buttonText}>Login Failed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#333333',
    marginTop: 20,
  },
  mockContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  mockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  mockSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  mockForm: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  mockLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 15,
  },
  successButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  failureButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CASWebView;

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

interface LandingScreenProps {
  onAuthSuccess: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAuthSuccess }) => {
  const { login, isPolling } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const handleLogin = async () => {
    try {
      setIsAuthenticating(true);
      
      const result = await login();
      
      if (!result.success) {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      console.error('❌ [LOGIN] Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const isLoading = isAuthenticating || isPolling;

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
          Welcome to Yideshare
        </Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
          Your sharing platform
        </Text>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loginButtonText}>
                {isPolling ? 'Authenticating...' : 'Opening browser...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.loginButtonText}>Login with Yale CAS</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.helpText, isDarkMode && styles.darkHelpText]}>
          {isPolling 
            ? "Complete authentication in your browser and return to the app"
            : "You will be redirected to your browser to complete authentication"
          }
        </Text>

        {/* Debug info */}
        <View style={styles.debugContainer}>
          <Text style={[styles.debugText, isDarkMode && styles.darkDebugText]}>
            Debug: {isPolling ? 'Polling for auth...' : 'Ready to authenticate'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'RighteousRegular',
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  darkTitle: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  darkSubtitle: {
    color: '#CCCCCC',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
    minWidth: 200,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  darkHelpText: {
    color: '#CCCCCC',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  debugText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  darkDebugText: {
    color: '#666666',
  },
});

export default LandingScreen;

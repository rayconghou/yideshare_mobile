import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

interface LandingScreenProps {
  onAuthSuccess: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAuthSuccess }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { login, isLoading } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLoginPress = async () => {
    try {
      setIsAuthenticating(true);
      const result = await login();
      
      if (result.success) {
        // The browser will open automatically
        // The callback will be handled by the deep linking
        // No popup needed - user will be redirected to browser
        console.log('🔗 [LANDING DEBUG] Opening browser for CAS authentication');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An unexpected error occurred');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Welcome to Yideshare
        </Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
          Your sharing platform
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLoginPress}
          activeOpacity={0.8}
          disabled={isAuthenticating || isLoading}
        >
          {isAuthenticating || isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.loadingText}>Opening browser...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Login with Yale CAS</Text>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.helpText, isDarkMode && styles.darkText]}>
          {isAuthenticating 
            ? "Complete authentication in your browser and return to the app"
            : "You will be redirected to your browser to complete authentication"
          }
        </Text>

        {/* Debug buttons - remove in production */}
        <TouchableOpacity 
          style={[styles.debugButton, isDarkMode && styles.darkDebugButton]} 
          onPress={() => {
            console.log('🔍 [DEBUG] Current auth state:', { isAuthenticating, isLoading });
            Alert.alert('Debug Info', `Auth State: ${isAuthenticating ? 'Authenticating' : 'Not Authenticating'}\nLoading: ${isLoading}`);
          }}
        >
          <Text style={[styles.debugButtonText, isDarkMode && styles.darkDebugButtonText]}>
            Debug Auth State
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.debugButton, isDarkMode && styles.darkDebugButton]} 
          onPress={async () => {
            console.log('🧹 [DEBUG] Clearing all authentication data');
            try {
              const casService = require('../services/CASService').default;
              const service = casService.getInstance();
              await service.clearAllData();
              Alert.alert('Success', 'All authentication data cleared. Please restart the app.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          }}
        >
          <Text style={[styles.debugButtonText, isDarkMode && styles.darkDebugButtonText]}>
            Clear Auth Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.debugButton, isDarkMode && styles.darkDebugButton]} 
          onPress={() => {
            console.log('🧪 [DEBUG] Testing deep link manually');
            const testUrl = 'yideshare://auth-success?token=test123&netid=ryh4&email=ryh4@yale.edu&name=Test%20User';
            console.log('🧪 [DEBUG] Simulating deep link:', testUrl);
            // Simulate the deep link
            const { Linking } = require('react-native');
            Linking.openURL(testUrl).catch((err: any) => {
              console.error('Error opening test URL:', err);
            });
          }}
        >
          <Text style={[styles.debugButtonText, isDarkMode && styles.darkDebugButtonText]}>
            Test Deep Link
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  darkText: {
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  debugButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 20,
    alignSelf: 'center',
  },
  darkDebugButton: {
    backgroundColor: '#333333',
  },
  debugButtonText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
  darkDebugButtonText: {
    color: '#cccccc',
  },
});

export default LandingScreen;

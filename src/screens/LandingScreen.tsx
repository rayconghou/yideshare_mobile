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
import { ImageBackground } from 'react-native';

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
      <ImageBackground source={require('../assets/images/landing_page_background.png')} resizeMode="cover" style={styles.image}>
        <View style={styles.content}>
          <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
            Yideshare
          </Text>
          
          <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
            Ridesharing app for Yale students
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
              <Text style={styles.loginButtonText}>Log in with CAS</Text>
            )}
          </TouchableOpacity>

        </View>
      </ImageBackground>
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
    fontFamily: 'Righteous-Regular',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  darkTitle: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  darkSubtitle: {
    color: '#CCCCCC',
  },
  loginButton: {
    backgroundColor: '#CDE3DD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 37,
    marginBottom: 20,
    minWidth: 167,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loginButtonText: {
    color: '#397060',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Lexend-Regular',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default LandingScreen;

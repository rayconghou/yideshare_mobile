import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
  TurboModuleRegistry,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { ImageBackground, Animated } from 'react-native';
import { lightColors, darkColors } from '../constants/colors';

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

  const textmove = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const animationDuration = 2500;

  const moveTitle = () => {
    Animated.timing(textmove,{
      toValue: -70,
      duration: animationDuration,
      useNativeDriver: false,
    }).start()
  };
  
  const moveSubtitle = () => {
    Animated.parallel([
      Animated.timing(textmove,{
        toValue: -70,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(fadeOut,{
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const fadeIn = useRef(new Animated.Value(0)).current;
  const fadeButton = () => {
    Animated.timing(fadeIn,{
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }

  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!hasAnimated.current) {
      moveTitle();
      moveSubtitle();
      fadeButton();
      hasAnimated.current = true;
    }
  },[]);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ImageBackground source={require('../assets/images/landing_page_background.png')} resizeMode="cover" style={styles.image}>
        <Animated.View style={styles.content}>
          <Animated.Text style={[styles.title, isDarkMode && styles.darkTitle, {transform:[{translateY:textmove}]}]}>
            Yideshare
          </Animated.Text>
          
          <Animated.Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle, {opacity:fadeOut}, {transform:[{translateY:textmove}]}]}>
            Ridesharing app for Yale students
          </Animated.Text>
          <Animated.View style={{opacity:fadeIn}}>
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled, {opacity:fadeIn}]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Animated.View style={[styles.loadingContainer]}>
                  <ActivityIndicator size="small" color={lightColors.white} />
                  <Text style={styles.loginButtonText}>
                    {isPolling ? 'Authenticating...' : 'Opening browser...'}
                  </Text>
                </Animated.View>
              ) : (
                <Animated.Text style={[styles.loginButtonText]}>Log in with CAS</Animated.Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
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
    color: lightColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  darkTitle: {
    color: lightColors.white,
  },
  subtitle: {
    fontSize: 18,
    color: lightColors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  darkSubtitle: {
    color: '#CCCCCC',
  },
  loginButton: {
    backgroundColor: lightColors.primary,
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
    color: lightColors.tertiary,
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

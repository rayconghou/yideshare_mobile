import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { user, yaliesData, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            Welcome to Yideshare
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
            Your sharing platform
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
            Hello, {yaliesData?.preferred_name || yaliesData?.first_name || 'User'}!
          </Text>
          <Text style={[styles.successText, isDarkMode && styles.darkText]}>
            ✅ Successfully authenticated with Yale CAS
          </Text>
          <Text style={[styles.netIdText, isDarkMode && styles.darkText]}>
            NetID: {user?.netid}
          </Text>
          <Text style={[styles.emailText, isDarkMode && styles.darkText]}>
            {yaliesData?.email || 'No email available'}
          </Text>
          {yaliesData?.college && (
            <Text style={[styles.schoolText, isDarkMode && styles.darkText]}>
              College: {yaliesData.college}
            </Text>
          )}
          {yaliesData?.year && (
            <Text style={[styles.schoolText, isDarkMode && styles.darkText]}>
              Class Year: {yaliesData.year}
            </Text>
          )}
          {yaliesData?.major && (
            <Text style={[styles.majorText, isDarkMode && styles.darkText]}>
              Major: {yaliesData.major}
            </Text>
          )}
          {yaliesData?.school && (
            <Text style={[styles.schoolText, isDarkMode && styles.darkText]}>
              School: {yaliesData.school}
            </Text>
          )}
        </View>

        <View style={styles.features}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Features
          </Text>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkText]}>
              📱 Share content with Yale community
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkText]}>
              🔒 Secure authentication with Yale CAS
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureText, isDarkMode && styles.darkText]}>
              👥 Connect with fellow students
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  successText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
    marginBottom: 10,
  },
  netIdText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: '#888888',
  },
  schoolText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    fontWeight: '500',
  },
  majorText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  features: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  featureItem: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;

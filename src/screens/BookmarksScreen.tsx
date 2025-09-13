import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookmarksScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Bookmarks
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtext]}>
          Your saved rides will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  darkSubtext: {
    color: '#999',
  },
});

export default BookmarksScreen;

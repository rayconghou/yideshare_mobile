import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock message data
const mockChats = [
  {
    id: '1',
    from: 'Jane Doe',
    time: '9:30 AM',
    date: '14 Dec',
    preview: 'This is an example of a message',
    read: true,
  },
  {
    id: '2',
    from: 'John Doe',
    time: '10:30 AM',
    date: '14 Dec',
    preview: 'This is another example of a message',
    read: true,
  },
];

const MessagesScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const renderChatCard = (chat: typeof mockChats[0]) => (
      <View key={chat.id} style={styles.chatCard}>
        <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{chat.from}</Text>
            <Text style={styles.chatTime}>{chat.time}</Text>
        </View>

        <View style={styles.chatPreview}>
          <Text style={styles.chatPreviewText}>{chat.preview}</Text>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore rides</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
         */}
        {mockChats.map(renderChatCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#6B9080',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Righteous-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    fontFamily: defaultFontFamily,
  },
  chatTime: {
    fontSize: 14,
    color: '#666',
    fontFamily: defaultFontFamily,
    textAlign: 'right',
  },
  chatPreview: {

  },
  chatPreviewText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    fontFamily: defaultFontFamily,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default MessagesScreen;
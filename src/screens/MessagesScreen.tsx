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
import { lightColors } from '../constants/colors';
import { NotePencilIcon } from 'phosphor-react-native';

// Mock message data
const mockChats = [
  {
    id: '1',
    from: 'Jane Doe',
    time: '9:30 AM',
    date: '14 Dec',
    preview: 'This is an example of a message',
    read: true,
    initials: 'JD',
  },
  {
    id: '2',
    from: 'John Doe',
    time: '10:30 AM',
    date: '14 Dec',
    preview: 'This is another example of a message',
    read: true,
    initials: 'JD',
  },
];

const defaultFontFamily = 'Lexend-Regular';
const iconSizeMedium = 20;

const MessagesScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const renderChatCard = (chat: typeof mockChats[0]) => (
      <View key={chat.id} style={styles.chatCard}>
        <View style={styles.chatContent}>
          <View style={styles.chatAvatar}>
            <Text style={styles.chatInitials}>{chat.initials}</Text>
          </View>
          
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chat.from}</Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
            </View>

            <View style={styles.chatPreview}>
              <Text style={styles.chatPreviewText}>{chat.preview}</Text>
            </View>
          </View>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <NotePencilIcon size={iconSizeMedium} color={lightColors.stone}/>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {mockChats.map(renderChatCard)}
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
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightColors.text,
    fontFamily: 'Righteous-Regular',
  },
  newMessageIcon: {
    color: lightColors.stone,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatCard: {
    backgroundColor: '#ffffff',
    // paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chatName: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333',
    fontFamily: defaultFontFamily,
  },
  chatTime: {
    fontSize: 14,
    fontWeight: 300,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    textAlign: 'right',
  },
  chatPreview: {

  },
  chatPreviewText: {
    fontSize: 16,
    fontWeight: '300',
    color: lightColors.text,
    fontFamily: defaultFontFamily,
  },
  chatAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInitials: {
    color: '#918f8fff',
    fontWeight: 'bold',
    fontSize: 24,
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
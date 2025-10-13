import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import MyRidesScreen from '../screens/MyRidesScreen';
import MessagesScreen from '../screens/MessagesScreen';

// Phosphor React Native icon imports
import { lightColors } from '../constants/colors';
import { HouseIcon, ChatCircleIcon, BellIcon, UserIcon, BookmarkSimpleIcon } from 'phosphor-react-native';

import { AuthProvider, useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  
  // const { isAuthenticated, isLoading, isPolling, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const navBarIconSize = 32;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: lightColors.text,
        tabBarInactiveTintColor: lightColors.text,
        tabBarStyle: {
          backgroundColor: lightColors.backgroundBlue,
          paddingTop: 12,
          paddingBottom: 34,
          paddingHorizontal: 16,
          // borderTopWidth: 1,
          // borderTopColor: '#e0e0e0',
          height: 110,
          // position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Lexend-Regular',
          fontWeight: 300,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
  <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <HouseIcon
              size={navBarIconSize}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ChatCircleIcon
              size={navBarIconSize}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BookmarkSimpleIcon
              size={navBarIconSize}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyRides"
        component={MyRidesScreen}
        options={{
          tabBarLabel: 'My Rides',
          tabBarIcon: ({ color, focused }) => (
            <UserIcon
              size={navBarIconSize}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
  </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
      flexDirection: 'row',
      backgroundColor: lightColors.backgroundBlue,
      paddingTop: 12,
      paddingBottom: 48,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
    },
    navIcon: {
      marginBottom: 4,
      color: lightColors.text,
    },
    navLabel: {
      fontSize: 12,
      color: lightColors.text,
      fontFamily: 'Lexend-Regular'
    },
    activeNavLabel: {
      color: lightColors.text,
    }
});

export default TabNavigator;

{/* <View style={styles.bottomNav}>
    <TouchableOpacity 
      style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
      onPress={() => setActiveTab('home')}
    >
      <HouseIcon
        size={navBarIconSize}
        color={activeTab === 'home' ? '#6B9080' : '#999'}
        style={styles.navIcon}
        weight={activeTab === 'home' ? 'fill' : 'regular'}
      />
      <Text style={[styles.navLabel, activeTab === 'home' && styles.activeNavLabel]}>
        Home
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.navItem, activeTab === 'messages' && styles.activeNavItem]}
      onPress={() => setActiveTab('messages')}
    >
      <ChatCircleIcon
        size={navBarIconSize}
        color={activeTab === 'messages' ? '#6B9080' : '#999'}
        style={styles.navIcon}
        weight={activeTab === 'messages' ? 'fill' : 'regular'}
      />
      <Text style={[styles.navLabel, activeTab === 'messages' && styles.activeNavLabel]}>
        Messages
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.navItem, activeTab === 'bookmarks' && styles.activeNavItem]}
      onPress={() => setActiveTab('bookmarks')}
    >
      <BookmarkSimpleIcon
        size={navBarIconSize}
        color={activeTab === 'bookmarks' ? '#6B9080' : '#999'}
        style={styles.navIcon}
        weight={activeTab === 'bookmarks' ? 'fill' : 'regular'}
      />
      <Text style={[styles.navLabel, activeTab === 'bookmarks' && styles.activeNavLabel]}>
        Bookmarks
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.navItem, activeTab === 'myrides' && styles.activeNavItem]}
      onPress={() => setActiveTab('myrides')}
    >
      <UserIcon
        size={navBarIconSize}
        color={activeTab === 'myrides' ? '#6B9080' : '#999'}
        style={styles.navIcon}
        weight={activeTab === 'myrides' ? 'fill' : 'regular'}
      />
      <Text style={[styles.navLabel, activeTab === 'myrides' && styles.activeNavLabel]}>
        My Rides
      </Text>
    </TouchableOpacity>
  </View> */}
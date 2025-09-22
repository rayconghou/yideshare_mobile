import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import MyRidesScreen from '../screens/MyRidesScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          isDarkMode && styles.darkTabBar,
        ],
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>💬</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>🔖</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="My Rides"
        component={MyRidesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color }]}>🚗</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
  },
  darkTabBar: {
    backgroundColor: '#2a2a2a',
    borderTopColor: '#444',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TabNavigator;

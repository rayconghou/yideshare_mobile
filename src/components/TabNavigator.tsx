import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import MyRidesScreen from '../screens/MyRidesScreen';
import MessagesScreen from '../screens/MessagesScreen';

// Phosphor React Native icon imports
import { lightColors } from '../constants/colors';
import { HouseIcon, ChatCircleIcon, BellIcon, UserIcon, BookmarkSimpleIcon } from 'phosphor-react-native';

const Tab = createBottomTabNavigator();
const TabNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

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

export default TabNavigator;
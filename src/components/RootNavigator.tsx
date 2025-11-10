import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import TabNavigator from './TabNavigator'
import SearchScreen from '../screens/SearchScreen';
import LocationSelectScreen from '../screens/LocationSelectScreen';
import CalendarScreen from '../screens/CalendarScreen';
import TimeSelectScreen from '../screens/TimeSelectScreen';

export type RootStackParamList = {
  main: undefined;
  search: undefined;
  locationSelect: {
    screen: string,
  };
  calendar: undefined,
  timeSelect: undefined,
  // Add more screens as needed
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name ="main" component={TabNavigator} />
            <Stack.Screen
                name="search"
                component={SearchScreen}
            />
            <Stack.Screen 
                name ="locationSelect" 
                component={LocationSelectScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen 
                name ="calendar" 
                component={CalendarScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen 
                name ="timeSelect" 
                component={TimeSelectScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack.Navigator>
    );
};
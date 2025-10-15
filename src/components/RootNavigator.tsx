import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import TabNavigator from './TabNavigator'
import SearchScreen from '../screens/SearchScreen';
import LocationSelectScreen from '../screens/LocationSelectScreen';

export type RootStackParamList = {
  main: undefined;
  search: undefined;
  locationSelect: {
    screen: string,
  };
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
        </Stack.Navigator>
    );
};
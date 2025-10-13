import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import TabNavigator from './TabNavigator'
import SearchScreen from '../screens/SearchScreen';

export type RootStackParamList = {
  main: undefined;
  search: undefined;
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
        </Stack.Navigator>
    );
};
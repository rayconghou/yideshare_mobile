import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TextInput,
  ScrollView,
} from 'react-native';
import { lightColors } from '../constants/colors';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/RootNavigator';

// icon imports
import { XIcon, AirplaneTiltIcon, MapPinIcon} from 'phosphor-react-native';

const mockLocations = [
  {
    id: '1',
    name: 'Destination name',
    address: 'City, State',
  },
  {
    id: '2',
    name: 'Destination name',
    address: 'City, State',
  },
  {
    id: '3',
    name: 'Destination name',
    address: 'City, State',
  },
  {
    id: '4',
    name: 'Destination name',
    address: 'City, State',
  },
  {
    id: '5',
    name: 'Destination name',
    address: 'City, State',
  }
];

const LocationSelectScreen: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'locationSelect'>>();
    const route = useRoute<RouteProp<RootStackParamList, 'locationSelect'>>();

    // Checks whether it is from or to selection
    const { screen } = route.params;

    // Handle clicking "X" button
    const handleNavBack = () => {
        navigation.goBack();
    };

    // Individual locations
    const renderLocationCard = (location: typeof mockLocations[0]) => (
    <View key={location.id} style={styles.locationCard}>
      <View>
          <AirplaneTiltIcon size={24} color={lightColors.text}/>
      </View>
      <View>
          <Text style={styles.locationNameText}>{location.name}</Text>
          <Text style={styles.locationAddressText}>{location.address}</Text>
      </View>
    </View>
  );

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBackButton} onPress={handleNavBack}>
                    <XIcon size={24} color={lightColors.stone} style={styles.headerBackButtonIcon} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MapPinIcon size={iconSizeSmall} color={lightColors.tertiary} weight="fill"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder={screen === 'leaving' ? "Leaving from" : "Going to"}
                    placeholderTextColor={lightColors.tertiary}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {mockLocations.map(renderLocationCard)}
            </ScrollView>
        </View>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
const smallTextSize = 14;
const iconSizeSmall = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.white,
    paddingTop: 19,
    paddingHorizontal: 16,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonIcon: {
    // No additional styles needed
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightColors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
    borderColor: lightColors.tertiary,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: defaultTextSize,
    color: lightColors.tertiary,
    fontFamily: defaultFontFamily,
    fontWeight: 300, 
  },
  content: {
    // flex: 1,
    paddingHorizontal: 12,
    backgroundColor: lightColors.white,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.primary,
    gap: 12,
  },
  locationNameText: {
    fontFamily: defaultFontFamily,
    fontWeight: 400,
    fontSize: defaultTextSize, 
  },
  locationAddressText: {
    fontFamily: defaultFontFamily,
    fontWeight: 300,
    fontSize: smallTextSize,
  },
});

export default LocationSelectScreen;

import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColors } from '../constants/colors';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/RootNavigator';

// icon imports
import { XIcon, CaretDownIcon, CaretUpIcon, MinusIcon } from 'phosphor-react-native';

const TimeSelectScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'timeSelect'>>();
  
  const handleNavBack = () => {
      console.log("back");
      navigation.goBack();
  };

  // Time selection
  const [showPicker, setShowPicker] = useState(false);
  const [startShown, setStartShown] = useState(false);
  const [endShown, setEndShown] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  // console.log('initial state', startShown, endShown);
  
  const togglePicker = (forStart: boolean) => {
    if (forStart) {
      setShowPicker(!startShown);
      setStartShown(!startShown);
      setEndShown(false);
    } else {
      setShowPicker(!endShown);
      setEndShown(!endShown);
      setStartShown(false);
    }
  }

  const onChange = (_event: any) => {
    // unfortunately the only maintained package only supports inline implementation on ios, android only has modal
    if (Platform.OS === 'android') {
      setShowPicker(false);
      setStartShown(false);
      setEndShown(false);
    }
  }

  const formattedStartTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerBackButton} onPress={handleNavBack}>
                <XIcon size={24} color={lightColors.stone} style={styles.headerBackButtonIcon} />
            </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
            <Text style={styles.instruction}> Give a time range of when you're willing to leave </Text>
            <View style={styles.buttonRow}>  
              {/* Start time */}
              <TouchableOpacity style={startShown ? styles.dropdownButtonActive : styles.dropdownButton} onPress={() => togglePicker(true)}>
                  <Text style={styles.dropdownButtonText}>{formattedStartTime}</Text>
                  {startShown ? <CaretUpIcon size={20}/> : <CaretDownIcon size={20}/>}
              </TouchableOpacity>
              <View style={styles.minusWrap}>
                <MinusIcon size={23} color={lightColors.text} />
              </View>
              
              {/* End time */}
              <TouchableOpacity style={endShown ? styles.dropdownButtonActive : styles.dropdownButton} onPress={() => togglePicker(false)}>
                  <Text style={styles.dropdownButtonText}>{formattedEndTime}</Text>
                  {endShown ? <CaretUpIcon size={20}/> : <CaretDownIcon size={20}/>}
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={startShown ? startDate : endDate}
                mode={'time'}
                testID="dateTimePicker"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                style={styles.timePicker}
                onChange={onChange}
              />
            )}

            {/* Now button */}
            {showPicker && 
              <View style={styles.nowButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    const now = new Date();
                    if (startShown) setStartDate(now);
                    if (endShown) setEndDate(now);
                  }}
                  style={[styles.dropdownButton, styles.nowButton]}
                >
                  <Text style={styles.dropdownButtonText}>Now</Text>
                </TouchableOpacity>
              </View>
            }
        </View>
    </View>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;

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
    paddingBottom: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: defaultTextSize,
    fontWeight: 400,
    color: lightColors.tertiary,
    fontFamily: 'Righteous-Regular',
    textAlign: 'center',
    flex: 1,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonIcon: {
    // No additional styles needed
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: lightColors.white,
    paddingBottom: 0,
    gap: 32,
    flexDirection: 'column',
    alignItems: 'center',
  },
  instruction: {
    fontFamily: defaultFontFamily,
    fontWeight: 300,
    fontSize: defaultTextSize,
  },
  buttonRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 32,
    marginBottom: 12,
  },
  dropdownButton: {
    borderRadius: 12,
    width: 132,
    gap: 10,
    padding: 12,
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: lightColors.primary,
  },
  dropdownButtonActive: {
    borderRadius: 12,
    width: 132,
    gap: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: lightColors.secondary,
    borderWidth: 1,
    backgroundColor: lightColors.white,
  },
  dropdownButtonText: {
    fontFamily: defaultFontFamily,
    fontSize: defaultTextSize,
  },
  minusWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePicker: {
    
  },
  nowButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  nowButton: {
    paddingHorizontal: 16,
  },
});

export default TimeSelectScreen;

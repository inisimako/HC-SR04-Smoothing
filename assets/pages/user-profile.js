import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import * as Font from 'expo-font';

// Load Custom Font
const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

export default function UserProfile({navigation}) {
  useEffect(() => {
    fetchFonts();
  }, []);

  return (
    <View>
      <Text>Ini user profile</Text>
    </View>
  );
}

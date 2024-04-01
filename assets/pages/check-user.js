import React, {useEffect} from 'react';
import {View} from 'react-native';
import * as Font from 'expo-font';
import {initializeAuth, getAuth, onAuthStateChanged} from 'firebase/auth';
import {initializeApp, getApps} from 'firebase/app';
import {getReactNativePersistence} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';


// Load Custom Font
const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

export default function Check({navigation}) {
  useEffect(() => {
    fetchFonts();
  }, []);

  // Firebase Config
  const firebaseConfig = {
    apiKey: 'AIzaSyCzz4knGX75Eq8kzZApA9ZeddbP6gnaH1M',
    authDomain: 'aplikasi-token-listrik.firebaseapp.com',
    databaseURL: 'https://aplikasi-token-listrik-default-rtdb.firebaseio.com',
    projectId: 'aplikasi-token-listrik',
    storageBucket: 'aplikasi-token-listrik.appspot.com',
    messagingSenderId: '601223677873',
    appId: '1:601223677873:web:54922117f75408bb0e5f90',
    measurementId: 'G-J7LZGHZQYG',
  };

  // Initialize Firebase
  let app;
  let auth;
  if (getApps().length < 1) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth();
  }

  // Check User
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Tab'}],
        })
      );
    } else {
      // User is signed out
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      );
    }
  });

  return <View></View>;
}

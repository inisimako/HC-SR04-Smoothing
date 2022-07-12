import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import * as Font from 'expo-font';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {initializeApp, getApps} from 'firebase/app';
import {GlobalStyles} from './global-syle';

const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [eye, setEye] = useState('eye-off');

  useEffect(() => {
    fetchFonts();
  }, []);

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
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  const auth = getAuth();
  const submit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigation.navigate('Home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/wrong-password') {
          ToastAndroid.show('Wrong password!', ToastAndroid.LONG);
        } else if (errorCode == 'auth/user-not-found') {
          ToastAndroid.show('User not found!', ToastAndroid.LONG);
        }
      });
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
    if (showPassword) setEye('eye');
    else setEye('eye-off');
  };

  return (
    <View style={GlobalStyles.container}>
      <ImageBackground
        source={require('aplikasi-token-listrik/assets/bg.jpg')}
        resizeMode="cover"
        style={GlobalStyles.image}
      >
        {/*Login Title*/}
        <View style={{width: 300}}>
          <Text
            style={{
              fontSize: 30,
              color: '#636e72',
              paddingTop: 100,
              paddingBottom: 150,
              fontWeight: 'bold',
            }}
          >
            Login
          </Text>
        </View>

        {/*Label Email */}
        <View style={{width: 300}}>
          <Text style={GlobalStyles.inputLabel}>Email Address</Text>
        </View>

        {/*Text Input Email*/}
        <View style={GlobalStyles.input}>
          <Feather name="user" size={22} color="#bdc3c7" />
          <TextInput
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
            style={GlobalStyles.inputText}
          ></TextInput>
          <View style={{width: 22}}></View>
        </View>

        {/*Label Password */}
        <View style={{width: 300}}>
          <Text style={GlobalStyles.inputLabel}>Password</Text>
        </View>

        {/*Text Input Password*/}
        <View style={GlobalStyles.input}>
          <Feather name="lock" size={22} color="#bdc3c7" />

          <TextInput
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
            style={GlobalStyles.inputText}
            secureTextEntry={showPassword}
          ></TextInput>

          {/*Show Password*/}
          <TouchableOpacity
            style={{height: 24, width: 24}}
            onPress={passwordVisibility}
          >
            <Feather name={eye} size={22} color="#bdc3c7"></Feather>
          </TouchableOpacity>
        </View>

        {/*Login Button*/}
        <TouchableOpacity
          onPress={submit}
          activeOpacity={0.8}
          style={GlobalStyles.globalButton}
        >
          <Text style={GlobalStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={{color: '#636e72'}}>Don't have an account? </Text>
          <Text
            onPress={() => navigation.navigate('Register')}
            style={{color: '#8e44ad', fontWeight: 'bold'}}
          >
            Create Account
          </Text>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

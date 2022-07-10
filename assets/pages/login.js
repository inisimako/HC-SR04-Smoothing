import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [eye, setEye] = useState('eye-off');

  useEffect(() => {
    fetchFonts();
  }, []);

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
    if (showPassword) setEye('eye');
    else setEye('eye-off');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('aplikasi-token-listrik/assets/bg.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        {/*Judul dan Logo*/}
        <View
          style={{
            height: 250,
            width: Dimensions.get('window').width * 0.63,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Feather name="zap" size={80} color="white" />
          <Text
            style={{
              //fontFamily: 'Poppins-Italic',
              fontSize: 14,
              color: 'white',
              textAlign: 'center',
              paddingTop: 10,
            }}
          >
            "Monitoring dan Isi Ulang Token Listrik"
          </Text>
        </View>

        <View style={styles.containerCard}>
          {/*Login Title*/}
          <View style={{width: 300}}>
            <Text
              style={{
                //fontFamily: 'Poppins-Bold',
                fontSize: 25,
                color: '#636e72',
                textAlign: 'left',
              }}
            >
              Login
            </Text>
          </View>
          {/*Label Email */}
          <View style={{width: 300}}>
            <Text style={styles.inputLabel}>Email</Text>
          </View>

          {/*Text Input Email*/}
          <View style={styles.input}>
            <Feather name="user" size={22} color="#bdc3c7" />
            <TextInput
              value={email}
              onChangeText={(value) => setEmail(value)}
              placeholder="Masukkan E-Mail"
              style={styles.inputText}
            ></TextInput>
            <View style={{width: 22}}></View>
          </View>

          {/*Label Password */}
          <View style={{width: 300}}>
            <Text style={styles.inputLabel}>Password</Text>
          </View>

          {/*Text Input Password*/}
          <View style={styles.input}>
            <Feather name="lock" size={22} color="#bdc3c7" />

            <TextInput
              value={password}
              onChangeText={(value) => setPassword(value)}
              placeholder="Masukkan Password"
              style={styles.inputText}
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
            //onPress={submit}
            activeOpacity={0.8}
            style={styles.globalButton}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <Text style={{color: '#636e72'}}>Belum punya akun? </Text>
            <Text
              //onPress={() => navigation.navigate('Register')}
              style={{color: '#8e44ad', fontWeight: 'bold'}}
            >
              Register
            </Text>
          </View>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    borderRadius: 25,
    paddingTop: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 300,
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    color: '#bdc3c7',
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputText: {
    width: 200,
    height: 30,
    color: '#636e72',
    borderRadius: 25,
  },

  inputLabel: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 10,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  globalButton: {
    width: 306,
    height: 50,
    marginTop: 20,
    backgroundColor: '#8e44ad',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

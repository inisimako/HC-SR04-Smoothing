import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
  StyleSheet,
  Button,
} from 'react-native';
import * as Font from 'expo-font';
import {getDatabase, ref, onValue, set} from 'firebase/database';
import {GlobalStyles} from './global-syle';
import {Feather} from '@expo/vector-icons';

const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

export default function Home() {
  const [balances, setBalances] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    getBalance();
    fetchFonts();
  }, []);

  const getBalance = () => {
    //Fungsi read data
    const db = getDatabase();
    const reference = ref(db, 'data');
    console.log(reference);
    onValue(reference, (snapshot) => {
      var bal = snapshot.val().balances.replace(/[^\d.-]/g, '');
      setBalances(bal);
    });
  };

  const sendToken = () => {
    const db = getDatabase();
    const reference = ref(db, 'token');
    set(reference, {
      token: token,
    });
  };

  const refreshBalances = () => {
    const db = getDatabase();
    const reference = ref(db, 'request');
    set(reference, {
      ocr: 'yes',
    });
  };

  return (
    <View style={styles.container}>
      {/*Welcome Back Text*/}
      <View style={{width: 350, flexDirection: 'row'}}>
        <Text
          style={{fontFamily: 'Poppins-Bold', fontSize: 20, color: '#636e72'}}
        >
          Welcome Back!
        </Text>
      </View>

      {/*Balances Card*/}
      <View style={[styles.box, styles.elevation]}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: 'normal',
              fontSize: 35,
              color: '#636e72',
            }}
          >
            {balances}
          </Text>
          <Text
            style={{
              marginLeft: 5,
              paddingTop: 20,
              fontFamily: 'Poppins-Italic',
              fontSize: 15,
              color: '#636e72',
            }}
          >
            kWh
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            borderRadius: 25,
          }}
          onPress={refreshBalances}
        >
          <Feather name="refresh-cw" size={35} color="#6522A8" />
        </TouchableOpacity>
      </View>

      {/*Enter Token*/}
      <View
        style={{
          width: 350,
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.input}>
          <TextInput
            onChangeText={(value) => setToken(value)}
            placeholder="Enter Token"
            style={styles.inputText}
            keyboardType="numeric"
          ></TextInput>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            backgroundColor: '#6522A8',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            borderRadius: 25,
          }}
          onPress={sendToken}
        >
          <Feather name="chevrons-right" size={35} color="white" />
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f0fe',
    paddingTop: 50,
  },
  box: {
    width: 350,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  elevation: {
    elevation: 25,
    shadowColor: '#999999',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#636e72',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 10,
  },
  inputText: {
    width: 250,
    height: 30,
    color: '#636e72',
  },
});

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import * as Font from 'expo-font';
import {GlobalStyles} from './global-syle';
import {getDatabase, ref, update} from 'firebase/database';
import {CommonActions} from '@react-navigation/native'; // For Reset Stack Navigation

// Load Custom Font
const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

export default function PembelianSukses({route, navigation}) {
  const [token, setToken] = useState('');
  useEffect(() => {
    fetchFonts();
    console.log(meter_no);
    setToken(getRandomToken());
  }, []);
  const {meter_no, subscriber_id, name, segment_power, sku} = route.params;

  function getRandomToken() {
    let token = '';
    for (let i = 0; i < 20; i++) {
      token += Math.floor(Math.random() * 10);
    }
    return token;
  }

  function isNumber(char) {
    if (typeof char !== 'string') {
      return false;
    }

    if (char.trim() === '') {
      return false;
    }

    return !isNaN(char);
  }
  // Send Token
  const sendToken = () => {
    if (token.length !== 20) {
      ToastAndroid.show('Token harus 20 digit!', ToastAndroid.SHORT);
      return;
    }

    if (!isNumber(token)) {
      ToastAndroid.show('Token harus angka!', ToastAndroid.SHORT);
      return;
    }

    const db = getDatabase();
    let reference = ref(db, 'token');
    update(reference, {
      token: token,
    })
      .then(() => {})
      .catch((error) => {
        ToastAndroid.show('Permintaan gagal!', ToastAndroid.LONG);
      });

    reference = ref(db, 'request');
    update(reference, {
      inputToken: 'yes',
      inputTokenStatus: '-',
    })
      .then(() => {
        ToastAndroid.show('Token berhasil dikirim!', ToastAndroid.LONG);
      })
      .catch((error) => {
        ToastAndroid.show('Token gagal dikirim!', ToastAndroid.LONG);
      });
  };

  return (
    <View style={styles.container}>
      {/*Welcome Back Text*/}
      <View style={{width: 350, flexDirection: 'row'}}>
        <Text
          style={{fontFamily: 'Poppins-Bold', fontSize: 20, color: '#636e72'}}
        >
          Pembelian Sukses!
        </Text>
      </View>

      <View style={[styles.boxTop, styles.elevation]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1}}>
            <Text style={styles.Text1}>Status</Text>
            <Text style={styles.Text1}>No Meter</Text>
            <Text style={styles.Text1}>SKU</Text>
            <Text style={styles.Text1}>Token</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.Text2}>Sukses</Text>
            <Text style={styles.Text2}>{meter_no}</Text>
            <Text style={styles.Text2}>{sku}</Text>
            <Text style={styles.Text2}>{token}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          setTimeout(() => {
            sendToken();
          }, 2000);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Tab',
                },
              ],
            })
          );
        }}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Text style={GlobalStyles.buttonText}>Kirim Token Ke Robot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f0fe',
  },
  Text: {
    color: '#636e72',
    //fontFamily: 'Poppins-Medium',
  },
  Text1: {
    color: '#636e72',
    //fontFamily: 'Poppins-Medium',
    marginBottom: 2,
  },
  Text2: {
    color: '#636e72',
    //fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  boxBottom: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderRadius: 15,
    padding: 20,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  boxTop: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  elevation: {
    elevation: 25,
    shadowColor: '#999999',
  },

  button: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: '#6522A8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});

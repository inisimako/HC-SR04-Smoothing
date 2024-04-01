import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import * as Font from 'expo-font';
import {GlobalStyles} from './global-syle';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';

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

export default function CheckOut({route, navigation}) {
  const [saldo, setSaldo] = useState('');
  const cekSaldo = () => {
    let data = JSON.stringify({
      cmd: 'deposit',
      username: 'fefojuopZnlW',
      sign: 'cff21665dd4458f2c6f16446b5774654',
    });

    let config = {
      method: 'post',
      url: 'https://api.digiflazz.com/v1/cek-saldo',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
      data: data,
    };

    axios(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data.data.deposit));
        setSaldo(response.data.data.deposit);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  useEffect(() => {
    fetchFonts();
    cekSaldo();
  }, []);
  const {meter_no, subscriber_id, name, segment_power, sku} = route.params;

  let layanan;
  let harga;
  switch (sku) {
    case 'PLN20':
      layanan = 'Token Listrik Rp 20.000';
      harga = 'Rp 22.000';
      break;
    case 'PLN50':
      layanan = 'Token Listrik Rp 50.000';
      harga = 'Rp 52.000';
      break;
    case 'PLN100':
      layanan = 'Token Listrik Rp 100.000';
      harga = 'Rp 102.000';
      break;
    case 'PLN200':
      layanan = 'Token Listrik Rp 200.000';
      harga = 'Rp 202.000';
      break;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.boxTop, styles.elevation]}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingBottom: 10,
            borderColor: '#d4d4d4',
            marginBottom: 10,
          }}
        >
          <Image
            style={[{width: 30, height: 30}]}
            source={require('../Logo_PLN.png')}
          />
          <Text style={[styles.Text, {fontSize: 20, paddingLeft: 10}]}>
            Listrik PLN
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1}}>
            <Text style={styles.Text1}>Jenis Layanan</Text>
            <Text style={styles.Text1}>No Meter</Text>
            <Text style={styles.Text1}>Nama</Text>
            <Text style={styles.Text1}>Tarif/Daya</Text>
            <Text style={styles.Text1}>Harga</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.Text2}>{layanan}</Text>
            <Text style={styles.Text2}>{meter_no}</Text>
            <Text style={styles.Text2}>{name}</Text>
            <Text style={styles.Text2}>{segment_power}</Text>
            <Text style={styles.Text2}>{harga}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.boxBottom, styles.elevation]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.Text1}>Saldo Digiflazz</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.Text1}>Rp {saldo}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.Text1}>Total tagihan</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.Text1}>{harga}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => { setTimeout(() => {
            navigation.navigate('PembelianSukses', route.params);
          }, 2000);
          }}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={GlobalStyles.buttonText}>
            Bayar (Test Case Percobaan)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f0fe',
    justifyContent: 'space-between',
  },
  Text: {
    color: '#636e72',
    //fontFamily: 'Poppins-Medium',
  },
  Text1: {
    color: '#636e72',
    ///fontFamily: 'Poppins-Medium',
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

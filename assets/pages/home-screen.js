// Main library
import {StatusBar} from 'expo-status-bar';
import axios from 'axios';
import * as Device from 'expo-device';
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  Platform,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import * as Font from 'expo-font';
import {GlobalStyles} from './global-syle';
import {Feather} from '@expo/vector-icons';

// Firebase stuff
import {getReactNativePersistence} from 'firebase/auth/react-native'; // Remove Async-Storage Firebase Warning
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDatabase, ref, onValue, set, update} from 'firebase/database';
import {initializeApp, getApps} from 'firebase/app';
import {initializeAuth, getAuth, signOut} from 'firebase/auth';

// Navigation stuff
import {CommonActions} from '@react-navigation/native'; // For Reset Stack Navigation
//Notification stuff
import * as Notifications from 'expo-notifications';

// Load Custom Font
const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-Black': require('../fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../fonts/Poppins-Italic.ttf'),
  });
};

// Notification Stuff
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Flat list stuff
const Item = ({item, onPress, borderColor, borderWidth}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, borderColor, borderWidth]}
  >
    <Text style={[styles.title]}>{item.product_name}</Text>
    <Text
      style={[{fontSize: 14, fontFamily: 'Poppins-Regular', color: '#636e72'}]}
    >
      Rp. {item.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')}
    </Text>
  </TouchableOpacity>
);

export default function Home({navigation}) {
  const [balances, setBalances] = useState(null);
  const [token, setToken] = useState('');
  const [lastTimeUpdate, setLastTimeUpdate] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [allData, setAllData] = useState({});
  const [ocrRequest, setOcrRequest] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');
  const [inputTokenRequest, setInputTokenRequest] = useState('');
  const [inputTokenStatus, setInputTokenStatus] = useState('');
  const [noMeter, setNoMeter] = useState('');
  const [productList, setProductList] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  // Notification Stuff
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Main use effect
  useEffect(() => {
    fetchFonts();
    getAllDataFromFireBase();
  }, []);

  // Check input token status
  useEffect(() => {
    setTimeout(function () {
      if (inputTokenRequest === 'no' && inputTokenStatus === 'gagal') {
        sendPushNotification(
          expoPushToken,
          'Pengisian Token Gagal!',
          'Token: ' + allData.token.token
        );
        const db = getDatabase();
        let reference = ref(db, 'request');
        update(reference, {
          inputTokenStatus: '-',
        });
      } else if (
        inputTokenRequest === 'no' &&
        inputTokenStatus === 'berhasil'
      ) {
        sendPushNotification(
          expoPushToken,
          'Pengisian Token Berhasil!',
          'Token: ' + allData.token.token
        );
        const db = getDatabase();
        let reference = ref(db, 'request');
        update(reference, {
          inputTokenStatus: '-',
        });
      }
    }, 500);
  }, [inputTokenStatus]);

  // Load product
  useEffect(() => {
    var data = JSON.stringify({
      cmd: 'prepaid',
      username: 'fefojuopZnlW',
      sign: '44aa9a1e3cbb847619a083512fa92ed8',
    });

    var config = {
      method: 'post',
      url: 'https://api.digiflazz.com/v1/price-list',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setProductList(response.data.data);
        //console.log(JSON.stringify(response.data.data));
      })
      .catch(function (error) {
        ToastAndroid.show('Gagal memuat produk!', ToastAndroid.SHORT);
        //console.log(error);
      });
  }, []);

  useEffect(() => {
    if (balances !== null && parseFloat(balances) < 5.0) {
      sendPushNotification(
        expoPushToken,
        'Sisa kWh Listrik: ' + balances + ' kWh',
        'Segera Lakukan Pengisian Ulang!'
      );
    }
  }, [balances]);

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

  // Firebase Credenitial
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

  // Log Out
  const logOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          })
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  // Token validation
  function isNumber(char) {
    if (typeof char !== 'string') {
      return false;
    }

    if (char.trim() === '') {
      return false;
    }

    return !isNaN(char);
  }

  // Send Token to Robot
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
        ToastAndroid.show('Permintaan diproses!', ToastAndroid.LONG);
      })
      .catch((error) => {
        ToastAndroid.show('Permintaan gagal!', ToastAndroid.LONG);
      });
  };

  // Buy Token
  const buyToken = () => {
    if (noMeter === '') {
      ToastAndroid.show('Please insert Meter ID!', ToastAndroid.SHORT);
      return;
    }

    if (selectedId === null) {
      ToastAndroid.show('Please select product!', ToastAndroid.SHORT);
      return;
    }

    let data = JSON.stringify({
      commands: 'pln-subscribe',
      customer_no: noMeter,
    });

    let config = {
      method: 'post',
      url: 'https://api.digiflazz.com/v1/transaction',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
      data: data,
    };

    axios(config)
      .then((response) => {
        if (response.data.data.meter_no === '') {
          ToastAndroid.show('Meter ID not found!', ToastAndroid.SHORT);
          return;
        }
        response.data.data.sku = selectedId;
        navigation.navigate('Checkout', response.data.data);
        //console.log(JSON.stringify(response.data.data));
      })
      .catch((error) => {
        ToastAndroid.show('Request failed!', ToastAndroid.SHORT);
        //console.log(error);
      });
  };

  // Update OCR Request to Yes
  const refreshBalances = () => {
    const db = getDatabase();
    let reference = ref(db, 'request');
    update(reference, {
      ocr: 'yes',
    });

    reference = ref(db, 'request');
    update(reference, {
      ocr: 'yes',
    });
  };

  // Get All Data From Firebase
  const getAllDataFromFireBase = () => {
    const db = getDatabase();
    const reference = ref(db);
    onValue(reference, (snapshot) => {
      var data = snapshot.val();
      setAllData(data);
      setLastTimeUpdate(data.data.lastUpdateBalances);
      setBalances(data.data.balances);
      setOcrRequest(data.request.ocr);
      setOcrStatus(data.request.ocrStatus);
      setInputTokenRequest(data.request.inputToken);
      setInputTokenStatus(data.request.inputTokenStatus);
    });
  };

  // Flatlist Stuff
  const renderItem = ({item}) => {
    const borderColor =
      item.buyer_sku_code === selectedId ? '#6522A8' : '#DCDCDC';
    const borderWidth = item.buyer_sku_code === selectedId ? 2 : 1;

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.buyer_sku_code)}
        borderWidth={{borderWidth}}
        borderColor={{borderColor}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*Welcome Back Text*/}
      <View style={{width: 350, flexDirection: 'row'}}>
        <Text
          style={{fontFamily: 'Poppins-Bold', fontSize: 20, color: '#636e72'}}
        >
          Selamat Datang!
        </Text>
      </View>

      {/*Balances Card*/}
      <View style={[styles.boxRow, styles.elevation]}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            {/* Balances Text */}
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

            {/* kWh Text */}
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
          {/* Last update */}
          <Text
            style={{
              marginLeft: 10,
              paddingTop: 10,
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
              color: '#636e72',
            }}
          >
            Terakhir update: {lastTimeUpdate}
          </Text>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
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
          marginTop: 20,
          justifyContent: 'space-between',
        }}
      >
        {/* Input Token Text Box*/}
        <View style={[styles.input, {width: 280}]}>
          <TextInput
            onChangeText={(value) => setToken(value)}
            placeholder="Masukkan Token"
            style={styles.inputText}
            keyboardType="number-pad"
            maxLength={20}
            value={token}
          ></TextInput>
        </View>

        {/* Send Token button*/}
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            backgroundColor: '#6522A8',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
          }}
          onPress={sendToken}
        >
          <Feather name="chevrons-right" size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* Pilihan Pulsa */}
      <View style={[styles.boxCol, styles.elevation]}>
        <Image
          style={[{width: 125, height: 40, marginBottom: 10}]}
          source={require('../dgf_logo.png')}
        />
        <FlatList
          scrollEnabled={false}
          data={productList}
          renderItem={renderItem}
          keyExtractor={(item) => item.buyer_sku_code}
          extraData={selectedId}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          numColumns={2}
        />

        {/* Input ID Meteran*/}
        <View style={[styles.input, {width: 300, marginTop: 10}]}>
          <TextInput
            onChangeText={(value) => setNoMeter(value)}
            placeholder="Masukkan ID Meter"
            style={styles.inputText}
            keyboardType="numeric"
            maxLength={20}
          ></TextInput>
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          onPress={buyToken}
          activeOpacity={0.8}
          style={GlobalStyles.globalButton}
        >
          <Text style={GlobalStyles.buttonText}>Beli</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={logOut}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Text style={GlobalStyles.buttonText}>Keluar</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: {someData: 'goes here', lolol: 'lolol'},
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f0fe',
    paddingTop: 50,
  },
  item: {
    padding: 20,
    marginVertical: 7,
    marginHorizontal: 7,
    width: (350 - 40 - 20 - 10) / 2,
    borderRadius: 15,
    backgroundColor: 'white',
  },

  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#636e72',
  },

  boxRow: {
    width: 350,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  boxCol: {
    width: 350,
    marginTop: 20,
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
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
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
    fontSize: 17,
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

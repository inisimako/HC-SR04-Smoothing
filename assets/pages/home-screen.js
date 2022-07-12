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

import {getDatabase, ref, onValue} from 'firebase/database';

export default function Home() {
  const [balances, setBalances] = useState(null);

  const getBalance = () => {
    //Fungsi read data
    const db = getDatabase();
    const reference = ref(db, 'data');
    console.log(reference);
    onValue(reference, (snapshot) => {
      const highscore = snapshot.val().balances;
      setBalances(snapshot.val().balances);
      console.log('New high score: ' + balances);
    });
  };

  // setupHighscoreListener(userId) {
  //   const db = getDatabase();
  //   const reference = ref(db, 'balances');
  //   onValue(reference, (snapshot) => {
  //     setBalances(snapshot.val());
  //     console.log("Balances: " + balances);
  //   });
  // }

  return (
    <View style={styles.container}>
      <Button onPress={getBalance} title="Get from DB" color="#841584" />
      <Text>Data: {balances}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

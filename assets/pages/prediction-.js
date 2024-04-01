import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Font from 'expo-font';
import {getDatabase, ref, onValue, set, update} from 'firebase/database';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

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

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.boxTop}>{title}</Text>
  </View>
);

const line = {
  labels: ['11-12-2022', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      strokeWidth: 2, // optional
    },
  ],
};

export default function Prediction({navigation}) {
  const [dailyUsage, setDailyUsage] = useState({});
  const [balances, setBalances] = useState(null);
  // Get All Data From Firebase
  const getAllDataFromFireBase = () => {
    const db = getDatabase();
    const reference = ref(db);
    onValue(reference, (snapshot) => {
      var data = snapshot.val();
      setBalances(data.data.balances);
      setDailyUsage(data.dailyUsage);
    });
  };

  const renderItem = ({item}) => <Item title={item.id} />;
  useEffect(() => {
    fetchFonts();
    getAllDataFromFireBase();
    getAverage();
  }, []);

  useEffect(() => {
    fetchFonts();
    getAllDataFromFireBase();
    getAverage();
  }, []);

  const getAverage = () => {
    let sum = 0;
    const dailyUsageArray = Object.values(dailyUsage);
    for (let i = 1; i < 7; i++) {
      sum = sum + dailyUsageArray[i] - dailyUsageArray[i - 1];
    }
    return sum / 6;
  };

  return (
    <View style={styles.container}>
      <View style={{width: 350, flexDirection: 'row'}}>
        <Text
          style={{fontFamily: 'Poppins-Bold', fontSize: 20, color: '#636e72'}}
        >
          Prediksi
        </Text>
      </View>
      <View style={[styles.boxTop, styles.elevation]}>
        {/* Balances Text */}
        <Text
          style={{
            marginLeft: 10,
            fontSize: 15,
            color: '#636e72',
          }}
        >
          Listrik akan habis sekitar {Math.round(balances / getAverage())} hari
          Lagi
        </Text>
      </View>


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
    fontFamily: 'Poppins-Medium',
  },
  Text1: {
    color: '#636e72',
    fontFamily: 'Poppins-Medium',
    marginBottom: 2,
  },
  Text2: {
    color: '#636e72',
    fontFamily: 'Poppins-SemiBold',
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

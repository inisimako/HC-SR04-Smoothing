// In App.js in a new project

import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './login-screen';
import Register from './register-screen';
import Home from './home-screen';
import Check from './check-user';
import Prediction from './prediction-';
import UserProfile from './user-profile';
import CheckOut from './checkout';
import PembelianSukses from './pembelian-sukses';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
import {Dimensions} from 'react-native';
const DEVICE_WIDTH = Dimensions.get('window').width;
import {Feather} from '@expo/vector-icons';


export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Check">
        <Stack.Screen
          name="Check"
          component={Check}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckOut}
          options={{
            headerShown: true,
            headerShadowVisible: false,
            headerTintColor: '#636e72',
            headerStyle: {
              backgroundColor: '#f7f0fe',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PembelianSukses"
          component={PembelianSukses}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle:{
        borderTopLeftRadius: 21,
        borderTopRightRadius: 21,
        padding: 0,
        width: DEVICE_WIDTH,
        height: 60,
      },
      tabBarItemStyle:{
        margin:6,
      },
      tabBarActiveTintColor: '#6522A8',
      tabBarHideOnKeyboard: true,
    }}
  >
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Feather name="home" size={size} color= {color} />
        ),
      }}
      name="HomeTab"
      component={Home}
    />

    <Tab.Screen
      options={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: 'Prediction',
        tabBarIcon: ({ color, size }) => (
          <Feather name="bar-chart-2" size={size} color= {color} />
        ),
      }}
      name="PredictTab"
      component={Prediction}
    />

    <Tab.Screen
      options={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Feather name="user" size={size} color= {color} />
        ),
      }}
      name="ProfileTab"
      component={UserProfile}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({});

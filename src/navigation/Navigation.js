import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import Intro1 from '../screens/Intro1';
import Intro2 from '../screens/Intro2';
import Onboard from '../screens/Onboard';
import Login from '../screens/Login';

const Stack = createStackNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="Splash" component={SplashScreen}/>
        <Stack.Screen name="Intro1" component={Intro1}/>
        <Stack.Screen name="Intro2" component={Intro2}/>
        <Stack.Screen name="Onboard" component={Onboard}/>
        <Stack.Screen name="Login" component={Login}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
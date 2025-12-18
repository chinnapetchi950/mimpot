// import React from 'react';
// import { Provider } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from './navigation/AppNavigator';
// import store from './store/store';

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     </Provider>
//   );
// }
// App.js
//johndoe@gmail.com Password@12
import React,{useEffect} from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigation/RootNavigator";
import {store,persistor } from './store/store';
import AppNavigator from './navigation/AppNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



export default function App() {
   useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "759569956158-epidl158vp2g8dd0et92f53u9jbgkr9i.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
        <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

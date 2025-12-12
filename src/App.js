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
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigation/RootNavigator";
import {store,persistor } from './store/store';
import AppNavigator from './navigation/AppNavigator';


export default function App() {
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

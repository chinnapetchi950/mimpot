// store.js
// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice';

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

// export default store;
// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["user"], // only persist user slice
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

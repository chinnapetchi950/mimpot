// import axios from 'axios';
// import Storage from '../utils/storage';

// const apiClient = axios.create({
//   baseURL: 'http://testlink2.pillersofttechnologies.com/api',
//   timeout: 10000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Add a request interceptor to attach the token
// apiClient.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await Storage.getItem('token'); // get token from storage
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`; // attach token
//       }
//       if (config.data instanceof FormData) {
//         config.headers['Content-Type'] = 'multipart/form-data';
//       }
//     } catch (error) {
//       console.log('Error fetching token', error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
import axios from 'axios';
import { Alert } from 'react-native';
import Storage from '../utils/storage';
import { navigate } from '../navigation/RootNavigator';

const apiClient = axios.create({
  baseURL: 'http://testlink2.pillersofttechnologies.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 🚀 Request interceptor - Attach Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await Storage.getItem('token');
    console.log("token====>",token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🌐 FULL API URL =>", config.baseURL + config.url);

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚀 Response interceptor - Token Expired Auto Logout
let isAlertShown = false; // prevents multiple alerts

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (!isAlertShown && (status === 401 || message === "Token is expired" || message === "Unauthenticated.")) {

      isAlertShown = true;

      Alert.alert(
        "Session Expired",
        "Your session has expired. Please login again.",
        [
          {
            text: "OK",
            onPress: async () => {
              await Storage.removeItem('token');
              isAlertShown = false;
              navigate("Login");   // 🔥 Auto redirect
            },
          },
        ],
        { cancelable: false }
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;

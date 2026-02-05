// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import { common, colors } from '../styles/theme';
// import CustomHeader from '../components/CustomHeader';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LogoutModal from '../components/LogoutModal';
// import { useSelector } from 'react-redux';
// import Storage from '../utils/storage';
// import { authService } from '../api/authService';
// import { useDispatch } from 'react-redux';
// import { setUser, setToken, clearUser } from '../store/userSlice';
// import { useTranslation } from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const SettingsScreen = ({ navigation }) => {
//   const { t } = useTranslation();
//   const [userdata, setuserData] = useState();
// const [imageLoading, setImageLoading] = useState(true);

//   const { user, token } = useSelector(state => state);
//   const data = useSelector(state => state);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const userData = await Storage.getItem('userData');
//       console.log('userData', userData);
//       const token = await Storage.getItem('token'); // <-- read token

//       setuserData(userData);
//       dispatch(setUser(userData));
//       dispatch(setToken(token)); // <-- store token in Redux
//     };

//     checkAuth();
//   }, [navigation]);
//   const menuItems = [
//     { icon: 'info', title: t('settings.about_us'), screen: 'AboutusScreen' },
//     // { icon: "credit-card", title: "Manage Payment", screen: "PaymentScreen" },
//     { icon: 'shield', title: t('settings.security_settings'), screen: 'SecuritySettings' },
//     {
//       icon: 'file-text',
//       title: t('settings.manage_subscription'),
//       screen:'SubscriptionScreen'
//       //screen: 'ManageSubscription',
//     },
//     { icon: 'headphones', title: t('settings.help_center'), screen: 'HelpCenter' },
//     { icon: 'log-out', title: t('settings.logout'), screen: 'logout' },
//   ];
//   const [logoutVisible, setLogoutVisible] = useState(false);

//   // const items = [
//   //   { icon: "users", title: "Manage Account", screen: "Profile" },
//   //  // { icon: "credit-card", title: "Manage Payment", screen: "Payment" },
//   //   { icon: "shield-checkmark", title: "Security Settings", screen: "SecuritySettings" },
//   //   { icon: "file-tray-full", title: "Manage Subscription", screen: "ManageSubscription" },
//   //   { icon: "headset", title: "Access Help Center", screen: "HelpCenter" },
//   //   { icon: "log-out", title: "Logout", action: () => setLogoutVisible(true) },
//   // ];

//   const onLogoutConfirm = async () => {
//     try {
//       const res = await authService.logout();
//       console.log('logout RESPONSE:', res.data);
//       if (res?.data?.status === true) {
//         dispatch(clearUser());
//         Storage.setItem('userData', null);
//         Storage.setItem('token', null);
//         setLogoutVisible(false);
//         navigation.replace('Login');
//       }
//     } catch (e) {
//       console.log('logout ERROR:', e?.response?.data || e);
//       Alert.alert(t('common.error'), e?.message || t('settings.failed_to_logout'));
//     }

//     return;
//   };
//   const handlePress = async (item) => {
//   try {
//     if (item.title === t('settings.logout')) {
//       setLogoutVisible(true);
//       return;
//     }

//     // Check subscription only for "Manage Subscription"
//     if (item.title === t('settings.manage_subscription')) {
//       const res = await authService.getCurrentSubscription(); // call your API
//       console.log('Subscription API response:', res.data);

//       if (res?.data?.status) {
//         if (res.data.data) {
//           // User has active subscription → go to ManageSubscription
//       await AsyncStorage.setItem('isSubcribe', JSON.stringify(true));
//                 navigation.navigate('SubscriptionScreen'); // or SubscriptionList screen

//           // navigation.navigate('ManageSubscription',{currentplan:res.data.data});
//         } else {
//           await AsyncStorage.setItem('isSubcribe', JSON.stringify(true));
//           // No active subscription → go to SubscriptionList
//           navigation.navigate('SubscriptionScreen'); // or SubscriptionList screen
//         }
//       } else {
//         // Handle error response
//         Alert.alert(t('common.error'), res?.data?.message || t('subscription.failed_to_check_subscription'));
//       }
//       return;
//     }

//     // Navigate normally for other menu items
//     navigation.navigate(item.screen);
//   } catch (err) {
//     console.log('Error handling menu item:', err);
//     Alert.alert(t('common.error'), t('common.something_went_wrong'));
//   }
// };

//   // const handlePress = async item => {
//   //   //navigation.replace("Login");
//   //   if (item.title === strings.settings.logout) {
//   //     setLogoutVisible(true);
//   //   }
//   //   navigation.navigate(item.screen);
//   // };
//   const handleImageUpload = async () => {
//     try {
//       setUploading(true); // SHOW LOADER

//       const res = await authService.updateProfileImage(selectedImage);

//         if (res.data?.status === true) {
//         dispatch(setUser(res.data.data)); // Update Redux user
//         Storage.setItem('userData', res.data.data);

//         Alert.alert(t('common.success'), t('settings.profile_updated'));
//         navigation.goBack();
//       }
//     } catch (err) {
//       console.log('Upload error:', err);
//       Alert.alert(t('common.error'), t('settings.failed_to_upload_image'));
//     } finally {
//       setUploading(false); // HIDE LOADER
//     }
//   };


  
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//       <CustomHeader title={t('settings.settings')} />

//       <ScrollView style={{ flex: 1, padding: wp('5%') }}>
//         {/* Header */}
//         {/* <Text style={common.title}>Settings</Text> */}

//         {/* Profile Card */}
//         <View
//           style={{
//             backgroundColor: colors.primary,
//             borderRadius: 15,
//             padding: wp('5%'),
//             marginTop: hp('2%'),
//             position: 'relative',
//           }}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             {imageLoading && (
//     <View
//       style={{
//         position: "absolute",
//         width: 60,
//         height: 60,
//         backgroundColor: "rgba(0,0,0,0.1)",
//         borderRadius: 50,
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1,
//       }}
//     >
//       <ActivityIndicator size="small" color="#000" />
//     </View>
//   )}
//             <Image
//               source={
//                user?.user?.profile_image ||user?.user?.user?.profile_image
//                   ? { uri:user?.user?.profile_image|| user?.user?.user?.profile_image }
//                   : require('../assets/images/placeholder.png')
//               }
//               // source={require("../assets/images/profile.png")}
//               style={{
//                 width: 60,
//                 height: 60,
//                 borderRadius: 50,
//                 marginRight: 15,
//               }}
//               onLoadEnd={() => setImageLoading(false)}
//             />

//             <View>
//               <Text
//               ellipsizeMode="tail"   numberOfLines={1}
//                 style={{
//                   color: '#fff',
//                   fontSize: wp('4.5%'),
//                   fontWeight: '700',
//                   flexShrink:1,
//                   width:'80%'
//                 }}
//               >
//                 {[user?.user?.firstname||user?.user?.user?.firstname, user?.user?.lastname||user?.user?.user?.lastname]
//                   .filter(Boolean)
//                   .join(' ')}
//               </Text>

//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   marginTop: 10,
//                 }}
//               >
//                 <Icon name="map-pin" size={16} color="#fff" />
//                 <Text
//                   style={{ color: '#fff', marginLeft: 5, fontSize: wp('3.5%') }}
//                 >
//                   {user?.user?.email||user?.user?.user?.email}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Edit button */}
//           <TouchableOpacity
//             style={{
//               position: 'absolute',
//               right: 10,
//               top: 10,
//               backgroundColor: '#fff',
//               padding: 8,
//               borderRadius: 20,
//             }}
//             onPress={() => navigation.navigate('EditProfile')}
//           >
//             <Icon name="edit" size={18} color={colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* More Settings */}
//         <Text style={[common.title, { marginTop: hp('3%') }]}>
//           {t('settings.more_settings')}
//         </Text>

//         {menuItems.map(item => (
//           <TouchableOpacity
//             key={item.title}
//             onPress={() => handlePress(item)}
//             style={[common.card, common.rowBetween]}
//           >
//             <View style={common.rowStart}>
//               <Icon name={item.icon} size={22} color={colors.primary} />
//               <Text style={{ marginLeft: 10, fontSize: wp('4%') }}>
//                 {item.title}
//               </Text>
//             </View>
//             <Icon name="chevron-right" size={20} color="#999" />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//       <LogoutModal
//         visible={logoutVisible}
//         onConfirm={() => onLogoutConfirm()}
//         onCancel={() => setLogoutVisible(false)}
//       />
//     </SafeAreaView>
//   );
// };

// export default SettingsScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { colors, common } from '../styles/theme';
import CustomHeader from '../components/CustomHeader';
import LogoutModal from '../components/LogoutModal';
// import ImageWithLoader from '../components/ImageWithLoader';
import ImageWithLoader from '../components/ImageWithloader';
import { useDevice } from '../utils/useDeviceLayout';
import Storage from '../utils/storage';
import { authService } from '../api/authService';
import { setUser, setToken, clearUser } from '../store/userSlice';
import { height } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import HomeHeader from '../components/Homeheader';
import LanguageModal from '../components/LanguageModal';

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { ui,deviceType } = useDevice();

  const [userdata, setuserData] = useState();
const [imageLoading, setImageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const { user, token } = useSelector(state => state);
  const data = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await Storage.getItem('userData');
      console.log('userData', userData);
      const token = await Storage.getItem('token'); // <-- read token

      setuserData(userData);
      dispatch(setUser(userData));
      dispatch(setToken(token)); // <-- store token in Redux
    };

    checkAuth();
  }, [navigation]);
  const menuItems = [
    { icon: require('../assets/images/information.png'), title: t('settings.about_us'), screen: 'AboutusScreen' },
    // { icon: "credit-card", title: "Manage Payment", screen: "PaymentScreen" },
    { icon:  require('../assets/images/shield111.png'), title: t('settings.security_settings'), screen: 'SecuritySettings' },
    {
      icon: require('../assets/images/file.png'),
      title: t('settings.manage_subscription'),
      screen:'SubscriptionScreen'
      //screen: 'ManageSubscription',
    },
    { icon: require('../assets/images/support.png'), title: t('settings.help_center'), screen: 'HelpCenter' },
    { icon: require('../assets/images/language.png'), title: t('settings.language'), screen: 'language' },

    { icon: require('../assets/images/logout.png') ,title: t('settings.logout'), screen: 'logout' },
  ];
  const [logoutVisible, setLogoutVisible] = useState(false);

  // const items = [
  //   { icon: "users", title: "Manage Account", screen: "Profile" },
  //  // { icon: "credit-card", title: "Manage Payment", screen: "Payment" },
  //   { icon: "shield-checkmark", title: "Security Settings", screen: "SecuritySettings" },
  //   { icon: "file-tray-full", title: "Manage Subscription", screen: "ManageSubscription" },
  //   { icon: "headset", title: "Access Help Center", screen: "HelpCenter" },
  //   { icon: "log-out", title: "Logout", action: () => setLogoutVisible(true) },
  // ];

  const onLogoutConfirm = async () => {
    try {
      const res = await authService.logout();
      console.log('logout RESPONSE:', res.data);
      if (res?.data?.status === true) {
        dispatch(clearUser());
        Storage.setItem('userData', null);
        Storage.setItem('token', null);
        setLogoutVisible(false);
        navigation.replace('Login');
      }
    } catch (e) {
      console.log('logout ERROR:', e?.response?.data || e);
      Alert.alert(t('common.error'), e?.message || t('settings.failed_to_logout'));
    }

    return;
  };
  const handlePress = async (item) => {
  try {
    if (item.title === t('settings.logout')) {
      setLogoutVisible(true);
      return;
    } 
    if(item.title === t('settings.language')){
        setModalVisible(true)
    }

    // Check subscription only for "Manage Subscription"
    if (item.title === t('settings.manage_subscription')) {
      const res = await authService.getCurrentSubscription(); // call your API
      console.log('Subscription API response:', res.data);

      if (res?.data?.status) {
        if (res.data.data) {
          // User has active subscription → go to ManageSubscription
      await AsyncStorage.setItem('isSubcribe', JSON.stringify(true));
                navigation.navigate('SubscriptionScreen'); // or SubscriptionList screen

          // navigation.navigate('ManageSubscription',{currentplan:res.data.data});
        } else {
          await AsyncStorage.setItem('isSubcribe', JSON.stringify(true));
          // No active subscription → go to SubscriptionList
          navigation.navigate('SubscriptionScreen'); // or SubscriptionList screen
        }
      } else {
        // Handle error response
        Alert.alert(t('common.error'), res?.data?.message || t('subscription.failed_to_check_subscription'));
      }
      return;
    }

    // Navigate normally for other menu items
    navigation.navigate(item.screen);
  } catch (err) {
    console.log('Error handling menu item:', err);
    Alert.alert(t('common.error'), t('common.something_went_wrong'));
  }
};

  return (
    <View style={[common.screen, { flex: 1, backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={"#FFFFFF"} barStyle={'dark-content'} />
      
      {/* <CustomHeader showlogo={true} title={t('settings.settings')} /> */}
 <HomeHeader title={t('settings.settings')}/>
<ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    padding: ui.padding,
    paddingBottom: 60,
    flexGrow: 1,
  }}
>       
        <>
        <View style={[styles.profileCard, { padding:20, borderRadius: 15 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ImageWithLoader
              source={
                userdata?.profile_image
                  ? { uri: userdata.profile_image }
                  : require('../assets/images/placeholder.png')
              }
              style={{ width: ui.image.avatar, height: ui.image.avatar, borderRadius: ui.image.avatar/2 }}
              resizeMode="cover"
            />
            <View style={{ flexShrink: 1, marginLeft: ui.spacing.md }}>
              <Text style={[styles.profileName, { fontSize: ui.font.h2 }]} numberOfLines={1} ellipsizeMode="tail">
                {[userdata?.firstname, userdata?.lastname].filter(Boolean).join(' ')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: ui.spacing.sm }}>
                {/* <Icon name="map-pin" size={ui.font.body} color="#fff" /> */}
                <Text style={[styles.profileEmail, { fontSize: ui.font.body, }]}>
                  {userdata?.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Edit button */}
          <TouchableOpacity
            style={[styles.editBtn, { padding: ui.spacing.sm, borderRadius: 20 }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="edit" size={ui.font.body} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* More Settings */}
        <Text style={[common.title, {fontSize:20, marginTop: 30 }]}>{t('settings.more_settings')}</Text>

        {menuItems.map(item => (
          <TouchableOpacity
            key={item.title}
            onPress={() => handlePress(item)}
            style={[common.card,{paddingHorizontal: wp("2%"),paddingTop:deviceType==='tablet'?20:10}, common.rowBetween, ]}
          >
            <View style={common.rowStart}>
              <Image source={item.icon} style={{width:deviceType==='tablet'?40:36,height:deviceType==='tablet'?40:36}} />
              <Text style={{ marginLeft:deviceType==='tablet'? 40:20, fontSize:deviceType==='tablet'? 24:20 }}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={deviceType==='tablet'?40:24} color="#999" />
          </TouchableOpacity>
        ))}
        </>
      </ScrollView>

      <LogoutModal
        visible={logoutVisible}
        onConfirm={onLogoutConfirm}
        onCancel={() => setLogoutVisible(false)}
      />
       {/* ✅ Only This */}
      <LanguageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: colors.primary,
    marginTop: 10,
    position: 'relative',
      shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14,
  },
  profileName: {
    color: '#fff',
    fontWeight: '700',
  },
  profileEmail: {
    color: '#fff',
  },
  editBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
  },
});

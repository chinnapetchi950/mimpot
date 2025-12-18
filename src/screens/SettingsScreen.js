import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { common, colors } from '../styles/theme';
import CustomHeader from '../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutModal from '../components/LogoutModal';
import { useSelector } from 'react-redux';
import Storage from '../utils/storage';
import { authService } from '../api/authService';
import { useDispatch } from 'react-redux';
import { setUser, setToken, clearUser } from '../store/userSlice';
import strings from '../localization/en';

const SettingsScreen = ({ navigation }) => {
  const [userdata, setuserData] = useState();
const [imageLoading, setImageLoading] = useState(true);

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
    { icon: 'info', title: strings.settings.about_us, screen: 'AboutusScreen' },
    // { icon: "credit-card", title: "Manage Payment", screen: "PaymentScreen" },
    { icon: 'shield', title: strings.settings.security_settings, screen: 'SecuritySettings' },
    {
      icon: 'file-text',
      title: strings.settings.manage_subscription,
      screen:'SubscriptionScreen'
      //screen: 'ManageSubscription',
    },
    { icon: 'headphones', title: strings.settings.help_center, screen: 'HelpCenter' },
    { icon: 'log-out', title: strings.settings.logout, screen: 'logout' },
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
      Alert.alert(strings.common.error, e?.message || strings.settings.failed_to_logout);
    }

    return;
  };
  const handlePress = async (item) => {
  try {
    if (item.title === strings.settings.logout) {
      setLogoutVisible(true);
      return;
    }

    // Check subscription only for "Manage Subscription"
    if (item.title === strings.settings.manage_subscription) {
      const res = await authService.getCurrentSubscription(); // call your API
      console.log('Subscription API response:', res.data);

      if (res?.data?.status) {
        if (res.data.data) {
          // User has active subscription → go to ManageSubscription
          navigation.navigate('ManageSubscription',{currentplan:res.data.data});
        } else {
          // No active subscription → go to SubscriptionList
          navigation.navigate('SubscriptionScreen'); // or SubscriptionList screen
        }
      } else {
        // Handle error response
        Alert.alert('Error', res?.data?.message || 'Failed to check subscription');
      }
      return;
    }

    // Navigate normally for other menu items
    navigation.navigate(item.screen);
  } catch (err) {
    console.log('Error handling menu item:', err);
    Alert.alert('Error', 'Something went wrong, please try again.');
  }
};

  // const handlePress = async item => {
  //   //navigation.replace("Login");
  //   if (item.title === strings.settings.logout) {
  //     setLogoutVisible(true);
  //   }
  //   navigation.navigate(item.screen);
  // };
  const handleImageUpload = async () => {
    try {
      setUploading(true); // SHOW LOADER

      const res = await authService.updateProfileImage(selectedImage);

        if (res.data?.status === true) {
        dispatch(setUser(res.data.data)); // Update Redux user
        Storage.setItem('userData', res.data.data);

        Alert.alert(strings.common.success, strings.settings.profile_updated);
        navigation.goBack();
      }
    } catch (err) {
      console.log('Upload error:', err);
      Alert.alert(strings.common.error, strings.settings.failed_to_upload_image);
    } finally {
      setUploading(false); // HIDE LOADER
    }
  };


  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader title={strings.settings.settings} />

      <ScrollView style={{ flex: 1, padding: wp('5%') }}>
        {/* Header */}
        {/* <Text style={common.title}>Settings</Text> */}

        {/* Profile Card */}
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 15,
            padding: wp('5%'),
            marginTop: hp('2%'),
            position: 'relative',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {imageLoading && (
    <View
      style={{
        position: "absolute",
        width: 60,
        height: 60,
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <ActivityIndicator size="small" color="#000" />
    </View>
  )}
            <Image
              source={
               user?.user?.profile_image ||user?.user?.user?.profile_image
                  ? { uri:user?.user?.profile_image|| user?.user?.user?.profile_image }
                  : require('../assets/images/placeholder.png')
              }
              // source={require("../assets/images/profile.png")}
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                marginRight: 15,
              }}
              onLoadEnd={() => setImageLoading(false)}
            />

            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: wp('4.5%'),
                  fontWeight: '700',
                }}
              >
                {[user?.user?.firstname||user?.user?.user?.firstname, user?.user?.lastname||user?.user?.user?.lastname]
                  .filter(Boolean)
                  .join(' ')}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Icon name="map-pin" size={16} color="#fff" />
                <Text
                  style={{ color: '#fff', marginLeft: 5, fontSize: wp('3.5%') }}
                >
                  {user?.user?.email||user?.user?.user?.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Edit button */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 20,
            }}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="edit" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* More Settings */}
        <Text style={[common.title, { marginTop: hp('3%') }]}>
          {strings.settings.more_settings}
        </Text>

        {menuItems.map(item => (
          <TouchableOpacity
            key={item.title}
            onPress={() => handlePress(item)}
            style={[common.card, common.rowBetween]}
          >
            <View style={common.rowStart}>
              <Icon name={item.icon} size={22} color={colors.primary} />
              <Text style={{ marginLeft: 10, fontSize: wp('4%') }}>
                {item.title}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <LogoutModal
        visible={logoutVisible}
        onConfirm={() => onLogoutConfirm()}
        onCancel={() => setLogoutVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import Storage from '../utils/storage';
import { useTranslation } from 'react-i18next';

export default function SplashScreen({ navigation }) {
  const { t } = useTranslation();
  // useEffect(() => {
  //   const t = setTimeout(() => navigation.replace('Login'), 1600);
  //   return () => clearTimeout(t);
  // }, [navigation]);
useEffect(() => {
  const checkAuth = async () => {
    const token = await Storage.getItem("token");

    if (token) {
      // User already logged in → go to Dashboard
      navigation.replace("MainTabs");
    } else {
      //No token → go to Login after 1.6s
      setTimeout(() => {
        navigation.replace("Onboarding");
      }, 1600);
    }
  };

  checkAuth();
}, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRounded}>
        <View style={styles.logoCard}>
          <Image source={require('../assets/images/logo.png')} resizeMode="contain" accessible accessibilityLabel="M.impot logo" />
        </View>
      </View>
      <Text style={styles.footer}>{t('welcome.footer')}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'},
  topRounded:{
    position:'absolute',
    top:0,
    width: width,
    height: height*0.95,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
  
  },
  logoCard:{
 
    borderRadius: 20,
    backgroundColor:'#f2f2f2',
    alignItems:'center',
    justifyContent:'center'
  },
  footer:{position:'absolute', bottom:50, color:'#4aa8db', fontSize:18, fontWeight:'600'}
});

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('MainTabs'), 1600);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRounded}>
        <View style={styles.logoCard}>
          <Image source={require('../assets/images/logo.png')} resizeMode="contain" accessible accessibilityLabel="M.impot logo" />
        </View>
      </View>
      <Text style={styles.footer}>M.impôt 2025</Text>
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

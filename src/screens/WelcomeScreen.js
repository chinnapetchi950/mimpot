import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../styles/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require('../assets/images/logo.png')}  />
        {/* <View style={styles.logoCard}>
          <Image source={require('../assets/images/splash.png')} style={styles.logo} resizeMode='contain' />
        </View> */}
      </View>

      <Text style={styles.appTitle}>M.impôt</Text>
      <Text style={styles.subtitle}>Keeps you updated on law text</Text>

      <TouchableOpacity style={styles.primary} onPress={()=> navigation.navigate('Login')}>
        <Text style={styles.primaryText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
        <Text style={styles.link}>Create an account</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>M.impôt 2025</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff'},
  logoWrap:{alignItems:'center', marginBottom:20},
  logoBg:{width:220, height:220, borderRadius:24, opacity:0.9},
  logoCard:{position:'absolute', top:30, width:140, height:140, borderRadius:18, backgroundColor:'#f2f2f2', alignItems:'center', justifyContent:'center'},
  logo:{width:100, height:100},
  appTitle:{color:theme.colors.primary, fontSize:28, fontWeight:'700', marginTop:12},
  subtitle:{fontSize:16, color:'#1D1D1D', marginTop:8},
  primary:{backgroundColor:theme.colors.primary, paddingVertical:14, paddingHorizontal:60, borderRadius:28, marginTop:74},
  primaryText:{color:'#fff', fontWeight:'700', fontSize:18},
  link:{marginTop:14, fontSize:16, color:'#1D1D1D'},
  footer:{position:'absolute', bottom:40, color:theme.colors.primary, fontSize:19}
});

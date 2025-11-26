import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert,Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { authService } from '../api/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await authService.login({ email, password });
      // pretend response contains user
      dispatch(setUser(res.data || { email }));
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Login failed', e.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.top}> */}
        <View style={styles.topRounded}>
                <View style={styles.logoCard}>
                  <Image source={require('../assets/images/logo.png')}  resizeMode="cover" accessible accessibilityLabel="M.impot logo" />
                </View>
              </View>
      {/* </View> */}
<View style={styles.top}> </View>
      <Text style={styles.title}>Log In</Text>

      <View style={styles.form}>
        <InputField placeholder="Email*" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <InputField placeholder="Password*" value={password} onChangeText={setPassword} secureTextEntry />
        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} accessible accessibilityRole="checkbox" />
            <Text style={{marginLeft:8,color:'#1D1D1D',fontSize:16}}>Remember me</Text>
          </View>
          <TouchableOpacity><Text style={{color:'#1D1D1D',fontSize:16}}>Forgot password?</Text></TouchableOpacity>
        </View>
<View style={{marginTop:40}}></View>
        <PrimaryButton title="Log In" onPress={handleLogin} />
          <TouchableOpacity onPress={()=>navigation.navigate('Signup')}><Text style={{textAlign:'center',color:'#1D1D1D',fontSize:18,fontWeight:'700',marginTop:20}}>Sign Up</Text></TouchableOpacity>

          <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 35,
  }}
>
  <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />

  <Text style={{ marginHorizontal: 10, color: '#9CA3AF', fontSize: 14 }}>
    OR
  </Text>

  <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
</View>

        <TouchableOpacity style={styles.google} onPress={()=> Alert.alert('Google sign in')}>
          <Image source={require('../assets/images/google.png')} style={{width:24,height:24,marginRight:8,alignSelf:'flex-start'}} />
          <Text style={{fontSize:18,justifyContent:'flex-start',marginRight:90}}>Continue with google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  top:{alignItems:'center', paddingTop:10},
  logoBg:{width:'90%', height:140, borderRadius:30, resizeMode:'contain'},
  logoCard:{position:'absolute', top:20, width:120, height:120, borderRadius:18, backgroundColor:'#f2f2f2', alignItems:'center', justifyContent:'center'},
  logo:{width:90, height:90},
  title:{fontSize:28, fontWeight:'700', textAlign:'center', marginTop:'70%'},
  form:{padding:20},
  row:{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:15},
  checkboxRow:{flexDirection:'row', alignItems:'center'},
  checkbox:{width:20,height:20,borderWidth:1,borderRadius:4},
  google:{borderWidth:1, borderRadius:28, padding:12, alignItems:'center', flexDirection:'row',borderColor:'#000',justifyContent:'space-between',alignContent:'center'},
  topRounded:{
    position:'absolute',
    top:0,
    width: width,
    height: height*0.35,
    backgroundColor:'#fff',
    borderBottomLeftRadius: 72,
    borderBottomRightRadius: 72,
    alignItems:'center',
    justifyContent:'center',
    // subtle shadow for iOS
    shadowColor:'#000',
    shadowOffset:{width:0,height:6},
    shadowOpacity:0.06,
    shadowRadius:10,
    elevation:3
  },
  logoCard:{
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor:'#f2f2f2',
    alignItems:'center',
    justifyContent:'center'
  },
  logo:{width:120,height:120},
});

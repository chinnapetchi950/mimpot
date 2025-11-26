import React, {useState} from 'react';
import { View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, StatusBar, Dimensions } from 'react-native';
import theme from '../styles/theme';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DividerOr from '../components/DividerOr';

const { width, height } = Dimensions.get('window');

export default function SignupScreen(){
  const [agree, setAgree] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground
        source={require('../assets/images/hero.png')}
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          {/* <View style={styles.logoWrap}> */}
            <Image source={require('../assets/images/logo.png')} style={styles.logoSmall} />
          {/* </View> */}
          <Text style={styles.headerTitle}>Access Share</Text>
          <Text style={styles.headerSubtitle}>Learn tax laws easily</Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.whiteCard}>
          <Text style={styles.pageTitle}>Sign Up</Text>

          <InputField placeholder="Email*" />
          <InputField placeholder="Password*" secureTextEntry />
          <InputField placeholder="Name*" />
          <InputField placeholder="Last Name*" />
          <InputField placeholder="ID Number*" />

          <View style={styles.termRow}>
            <TouchableOpacity onPress={()=> setAgree(!agree)} style={styles.checkbox}>
              {agree ? <View style={styles.checkboxTick} /> : null}
            </TouchableOpacity>
            <Text style={styles.termText}>
              By signing up, you agree to our <Text style={styles.link}>Terms & Conditions</Text> and <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>

          <PrimaryButton title="Sign Up" onPress={()=>{}} />

          <TouchableOpacity style={styles.loginLink}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>

          <DividerOr />

          <TouchableOpacity style={styles.googleButton}>
            <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>Continue with google</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'rgba(0, 0, 0, 0.4)'},
  headerImage:{ width: width, height: height*0.35,justifyContent:'flex-end' },
  headerOverlay:{ alignItems:'center', paddingBottom:'10%' },
  logoWrap:{ position:'absolute', top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30, alignItems:'center', width:80, height:80, borderRadius:20, backgroundColor:'#fff', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:4 },
  logoSmall:{ width:56, height:56, resizeMode:'contain' },
  headerTitle:{ color:'#fff', fontSize:34, fontWeight:'700', marginTop:10, textAlign:'center' },
  headerSubtitle:{ color:'#fff', fontSize:18, marginTop:4, textAlign:'center', fontWeight:'700' },

  scrollContent:{ paddingBottom:40, alignItems:'center',borderTopLeftRadius:36, borderTopRightRadius:36,backgroundColor:"#fff" },
  whiteCard:{ width: '100%', backgroundColor:'#fff', borderTopLeftRadius:36, borderTopRightRadius:36, paddingTop:24, paddingHorizontal:18, paddingBottom:30, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:8, elevation:2 },

  pageTitle:{ fontSize:32, fontWeight:'700', textAlign:'center', marginBottom:12 },

  termRow:{ flexDirection:'row', alignItems:'flex-start', marginTop:8 },
  checkbox:{ width:22, height:22, borderWidth:1, borderColor:'#cfcfcf', borderRadius:4, marginTop:4 },
  checkboxTick:{ flex:1, backgroundColor: theme.colors.primary, borderRadius:2 },
  termText:{ flex:1, marginLeft:12, color:'#333', lineHeight:20 },
  link:{ color: theme.colors.primary },

  loginLink:{ marginTop:10, alignItems:'center' },
  loginText:{ color:'#111', fontSize:16 },

  googleButton:{ marginTop:12, flexDirection:'row', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#000', borderRadius:30, paddingVertical:12, paddingHorizontal:18 },
  googleIcon:{ width:22, height:22, marginRight:10, resizeMode:'contain' },
  googleText:{ fontSize:16 }
});

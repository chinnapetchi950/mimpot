import React, { useState } from 'react';
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar, Dimensions, Alert, ActivityIndicator
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { colors } from '../styles/theme';;
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DividerOr from '../components/DividerOr';
import { authService } from '../api/authService';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../utils/useDeviceLayout';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({navigation}) {
  const { t } = useTranslation();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { ui, width, height } = useDevice();

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.invalid_email_format'))
      .required(t('auth.email_is_required')),

    password: Yup.string()
      .min(6, t('auth.password_min_length'))
      .required(t('auth.password_is_required')),
    password_confirmation: Yup.string()
      .min(6, t('auth.confirm_password_min_length'))
      .required(t('auth.confirm_password_required_text')),
    firstname: Yup.string()
      .required(t('auth.name_is_required')),

    lastname: Yup.string()
      .required(t('auth.last_name_is_required')),

    // id_number: Yup.string()
    //   .required("ID number is required"),
  });

  const handleRegister = async (values) => {
    if (!agree) {
      Alert.alert(t('auth.terms_title'), t('auth.terms_alert'));
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register(values);
      console.log("REGISTER RESPONSE:", res.data);

      if (res.data?.user) {
        dispatch(setUser(res.data.user));    // <-- REDUX UPDATE
      }

Alert.alert(
  t('common.success'),
  t('auth.account_created_successfully'),
  [
    {
      text: t('common.ok'),
      onPress: () => {
        console.log("OK Pressed");
        // 👉 navigate or perform action here
        navigation.navigate("Login");  // example
      }
    }
  ]
);
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error);

      Alert.alert(
        t('common.error'),
        error.response?.data?.message || t('auth.registration_failed')
      );
    } finally {
      setLoading(false);
    }
  };

 return (
    <View style={[styles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* HERO */}
      <ImageBackground
        source={require('../assets/images/hero.png')}
        style={[styles.hero, { height: height * 0.32 }]}
      >
        <View style={styles.heroContent}>
          <Image
            source={require('../assets/images/round_logo.png')}
            style={[styles.logo, { width: ui.image.avatar, height: ui.image.avatar }]}
          />
          <Text style={[styles.heroTitle, { fontSize: ui.font.h1 }]}>
            Access Share
          </Text>
          <Text style={[styles.heroSubtitle, { fontSize: ui.font.body }]}>
            Learn tax laws easily
          </Text>
        </View>
      </ImageBackground>

      {/* FORM CARD */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.cardWrapper}>
  <View style={[styles.card, { paddingHorizontal: ui.padding }]}>
 <Text style={[styles.title, { fontSize: ui.font.h2 }]}>
            Sign Up
          </Text>

          <Formik
            initialValues={{
              email: '',
              password: '',
              password_confirmation: '',
              firstname: '',
              lastname: '',
              id_number: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={handleRegister}
          >
            {({ handleSubmit, handleChange, values }) => (
              <>
                <InputField
                  placeholder="Email*"
                  value={values.email}
                  onChangeText={handleChange('email')}
                />

                <InputField
                  placeholder="Password*"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                />

                <InputField
                  placeholder="Name*"
                  value={values.firstname}
                  onChangeText={handleChange('firstname')}
                />

                <InputField
                  placeholder="Last Name*"
                  value={values.lastname}
                  onChangeText={handleChange('lastname')}
                />

                <InputField
                  placeholder="ID Number*"
                  value={values.id_number}
                  onChangeText={handleChange('id_number')}
                />

                {/* TERMS */}
                <View style={styles.termsRow}>
                  <TouchableOpacity
                    onPress={() => setAgree(!agree)}
                    style={styles.checkbox}
                  >
                    {agree && <View style={styles.checkboxTick} />}
                  </TouchableOpacity>

                  <Text style={styles.termsText}>
                    By signing up, you agree to our{' '}
                    <Text style={styles.link}>Terms & Conditions</Text> and{' '}
                    <Text style={styles.link}>Privacy Policy</Text>.
                  </Text>
                </View>

                <PrimaryButton
                  title="Sign Up"
                  height={ui.button.height}
                  fontSize={ui.button.text}
                  onPress={handleSubmit}
                  disabled={loading}
                />

                {loading && (
                  <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={{ marginTop: 12 }}
                  />
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginLink}
                >
                  <Text style={styles.loginText}>Log in</Text>
                </TouchableOpacity>

                <DividerOr />

                <TouchableOpacity style={styles.googleBtn}>
                  <Image
                    source={require('../assets/images/google.png')}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleText}>
                    Continue with google
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
            </View>

         
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // hero background
  },
hero: { width: '100%', justifyContent: 'flex-end' }, 
heroContent: { alignItems: 'center', paddingBottom: 24 }, 
logo: { resizeMode: 'contain', marginBottom: 8 },
 heroTitle: { color: '#fff', fontWeight: '700' },
  heroSubtitle: { color: '#fff', marginTop: 4 },
  hero: {
    width: '100%',
    justifyContent: 'flex-end',
  },

  heroContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },

  scrollContent: {
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },

  // ✅ THIS is where radius MUST be
  cardWrapper: {
    // backgroundColor: '#fff',
    // borderTopLeftRadius: 96,
    // borderTopRightRadius: 96,
    // marginTop: -15,        // 🔑 pulls card over hero
    // overflow: 'hidden',   // 🔑 clips corners
  },

  // card: {
  //   backgroundColor: 'red', // test color
  //   paddingTop: 24,
  // },
 card:{ width: '100%', overflow: 'hidden', backgroundColor:'#fff', borderTopLeftRadius:36, borderTopRightRadius:36, paddingTop:24, paddingHorizontal:18, paddingBottom:30, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:8, },

  // card: {
  //   backgroundColor: 'red',
  //   marginTop: -24,
  //   paddingTop: 24,
  //   borderTopLeftRadius:96,
  //   borderBottomLeftRadius:36
  // },

  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 16,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 2,
  },

  checkboxTick: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  termsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#444',
  },

  link: { color: colors.primary },

  loginLink: { alignItems: 'center', marginTop: 12 },
  loginText: { fontSize: 16 },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 28,
    paddingVertical: 12,
    marginTop: 12,
  },

  googleIcon: { width: 22, height: 22, marginRight: 10 },
  googleText: { fontSize: 16 },
});





// const styles = StyleSheet.create({
//   container:{flex:1, backgroundColor:'rgba(0, 0, 0, 0.4)'},
//   headerImage:{ width: width, height: height*0.26,justifyContent:'flex-end' },
//   headerOverlay:{ alignItems:'center', paddingBottom:'10%' },
//   logoWrap:{ position:'absolute', top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30, alignItems:'center', width:80, height:80, borderRadius:20, backgroundColor:'#fff', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:4 },
//   logoSmall:{ width:64, height:64, resizeMode:'contain' },
//   headerTitle:{ color:'#fff', fontSize:34, fontWeight:'700', marginTop:10, textAlign:'center' },
//   headerSubtitle:{ color:'#fff', fontSize:18, marginTop:4, textAlign:'center', fontWeight:'700' },

//   scrollContent:{ paddingBottom:40, alignItems:'center',borderTopLeftRadius:36, borderTopRightRadius:36,backgroundColor:"#fff" },
//   whiteCard:{ width: '100%', backgroundColor:'#fff', borderTopLeftRadius:36, borderTopRightRadius:36, paddingTop:24, paddingHorizontal:18, paddingBottom:30, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:8, },

//   pageTitle:{ fontSize:32, fontWeight:'700', textAlign:'center', marginBottom:12 },

//   termRow:{ flexDirection:'row', alignItems:'flex-start', marginTop:8 },
//   checkbox:{ width:22, height:22, borderWidth:1, borderColor:'#cfcfcf', borderRadius:4, marginTop:4 },
//   checkboxTick:{ flex:1, backgroundColor: colors.primary, borderRadius:2 },
//   termText:{ flex:1, marginLeft:12, color:'#333', lineHeight:20 },
//   link:{ color: colors.primary },

//   loginLink:{ marginTop:10, alignItems:'center' },
//   loginText:{ color:'#111', fontSize:16 },

//   googleButton:{ marginTop:12, flexDirection:'row', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#000', borderRadius:30, paddingVertical:12, paddingHorizontal:18 },
//   googleIcon:{ width:22, height:22, marginRight:10, resizeMode:'contain' },
//   googleText:{ fontSize:16 }
// });

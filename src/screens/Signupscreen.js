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

const { width, height } = Dimensions.get('window');

export default function SignupScreen({navigation}) {
  const { t } = useTranslation();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ImageBackground
        source={require('../assets/images/hero.png')}
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Image
            source={require('../assets/images/round_logo.png')}
            style={styles.logoSmall}
          />
          <Text style={styles.headerTitle}>{t('signup.access_share')}</Text>
          <Text style={styles.headerSubtitle}>{t('signup.learn_tax_laws_easily')}</Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.whiteCard}>
          <Text style={styles.pageTitle}>{t('auth.sign_up')}</Text>

          {/* FORM */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              firstname: "",
              lastname: "",
              id_number: "",
              password_confirmation:''
            }}
            validationSchema={SignupSchema}
            onSubmit={handleRegister}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors
            }) => (
              <>

                {/* EMAIL */}
                <InputField
                  placeholder={t('auth.email_required')}
                  value={values.email}
                  onChangeText={handleChange("email")}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* PASSWORD */}
                <InputField
                  placeholder={t('auth.password_required')}
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange("password")}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <InputField
                  placeholder={t('auth.confirm_password_required')}
                  secureTextEntry
                  value={values.password_confirmation}
                  onChangeText={handleChange("password_confirmation")}
                />
                {touched.password_confirmation && errors.password_confirmation && (
                  <Text style={styles.errorText}>{errors.password_confirmation}</Text>
                )}

                {/* NAME */}
                <InputField
                  placeholder={t('auth.name_required')}
                  value={values.firstname}
                  onChangeText={handleChange("firstname")}
                />
                {touched.firstname && errors.firstname && (
                  <Text style={styles.errorText}>{errors.firstname}</Text>
                )}

                {/* LAST NAME */}
                <InputField
                  placeholder={t('auth.last_name_required')}
                  value={values.lastname}
                  onChangeText={handleChange("lastname")}
                />
                {touched.lastname && errors.lastname && (
                  <Text style={styles.errorText}>{errors.lastname}</Text>
                )}

                {/* ID NUMBER */}
                <InputField
                  placeholder={t('auth.id_number')}
                  value={values.id_number}
                  onChangeText={handleChange("id_number")}
                />
                {touched.id_number && errors.id_number && (
                  <Text style={styles.errorText}>{errors.id_number}</Text>
                )}

                {/* TERMS */}
                <View style={styles.termRow}>
                  <TouchableOpacity
                    onPress={() => setAgree(!agree)}
                    style={styles.checkbox}
                  >
                    {agree ? <View style={styles.checkboxTick} /> : null}
                  </TouchableOpacity>

                  <Text style={styles.termText}>
                    {t('auth.terms_agreement')}{" "}
                    <Text style={styles.link}>{t('auth.terms_and_conditions')}</Text> and{" "}
                    <Text style={styles.link}>{t('auth.privacy_policy')}</Text>.
                  </Text>
                </View>

                {/* SIGN UP BUTTON */}
                <PrimaryButton
                  title={loading ? t('common.please_wait') : t('auth.sign_up')}
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

                {/* LOGIN LINK */}
                <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={styles.loginLink}>
                  <Text style={styles.loginText}>{t('auth.login')}</Text>
                </TouchableOpacity>

                <DividerOr />

                <TouchableOpacity style={styles.googleButton}>
                  <Image
                    source={require('../assets/images/google.png')}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleText}>{t('auth.continue_with_google_lower')}</Text>
                </TouchableOpacity>

              </>
            )}
          </Formik>

        </View>
      </ScrollView>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },

//   headerImage: {
//     width: width,
//     height: height * 0.35,
//     justifyContent: 'flex-end'
//   },

//   headerOverlay: {
//     alignItems: 'center',
//     paddingBottom: '10%'
//   },

//   logoSmall: { width: 56, height: 56, resizeMode: 'contain' },
//   headerTitle: { color: '#fff', fontSize: 34, fontWeight: '700', marginTop: 10 },
//   headerSubtitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

//   scrollContent: {
//     paddingBottom: 40,
//     alignItems: 'center',
//     backgroundColor: "rgba(0, 0, 0, 0.2)"
//   },

//   whiteCard: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 36,
//     borderTopRightRadius: 36,
//     paddingTop: 24,
//     paddingHorizontal: 18,
//     paddingBottom: 30
//   },

//   pageTitle: {
//     fontSize: 32,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 12
//   },

//   errorText: {
//     color: "red",
//     fontSize: 13,
//     marginTop: -4,
//     marginBottom: 8
//   },

//   termRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },

//   checkbox: {
//     width: 22,
//     height: 22,
//     borderWidth: 1,
//     borderColor: '#cfcfcf',
//     borderRadius: 4,
//     marginTop: 4
//   },

//   checkboxTick: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     borderRadius: 2
//   },

//   termText: { flex: 1, marginLeft: 12, color: '#333', lineHeight: 20 },
//   link: { color: colors.primary },

//   loginLink: { marginTop: 10, alignItems: 'center' },
//   loginText: { color: '#111', fontSize: 16 },

//   googleButton: {
//     marginTop: 12,
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 30,
//     paddingVertical: 12,
//     justifyContent: 'center'
//   },

//   googleIcon: { width: 22, height: 22, marginRight: 10 },
//   googleText: { fontSize: 16 }
// });


const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'rgba(0, 0, 0, 0.4)'},
  headerImage:{ width: width, height: height*0.26,justifyContent:'flex-end' },
  headerOverlay:{ alignItems:'center', paddingBottom:'10%' },
  logoWrap:{ position:'absolute', top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30, alignItems:'center', width:80, height:80, borderRadius:20, backgroundColor:'#fff', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:4 },
  logoSmall:{ width:64, height:64, resizeMode:'contain' },
  headerTitle:{ color:'#fff', fontSize:34, fontWeight:'700', marginTop:10, textAlign:'center' },
  headerSubtitle:{ color:'#fff', fontSize:18, marginTop:4, textAlign:'center', fontWeight:'700' },

  scrollContent:{ paddingBottom:40, alignItems:'center',borderTopLeftRadius:36, borderTopRightRadius:36,backgroundColor:"#fff" },
  whiteCard:{ width: '100%', backgroundColor:'#fff', borderTopLeftRadius:36, borderTopRightRadius:36, paddingTop:24, paddingHorizontal:18, paddingBottom:30, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:8, },

  pageTitle:{ fontSize:32, fontWeight:'700', textAlign:'center', marginBottom:12 },

  termRow:{ flexDirection:'row', alignItems:'flex-start', marginTop:8 },
  checkbox:{ width:22, height:22, borderWidth:1, borderColor:'#cfcfcf', borderRadius:4, marginTop:4 },
  checkboxTick:{ flex:1, backgroundColor: colors.primary, borderRadius:2 },
  termText:{ flex:1, marginLeft:12, color:'#333', lineHeight:20 },
  link:{ color: colors.primary },

  loginLink:{ marginTop:10, alignItems:'center' },
  loginText:{ color:'#111', fontSize:16 },

  googleButton:{ marginTop:12, flexDirection:'row', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#000', borderRadius:30, paddingVertical:12, paddingHorizontal:18 },
  googleIcon:{ width:22, height:22, marginRight:10, resizeMode:'contain' },
  googleText:{ fontSize:16 }
});

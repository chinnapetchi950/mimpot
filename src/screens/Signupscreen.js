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
import Feather from 'react-native-vector-icons/Feather';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import Storage from '../utils/storage';
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
 const GoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;

      if (!idToken) throw new Error('No ID token');

      handleGoogleLogin({idToken});
    } catch (error) {
      console.log("err",error);
      
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(
          t('common.error'),
          t('common.something_went_wrong'),
        );
      }
    }
  };

  const handleGoogleLogin = async tokens => {
    try {
      const formData = new FormData();
      formData.append('access_token', tokens.idToken);

      const res = await authService.googleLogin(formData);

      const token = res?.data?.token;
      const userData = res?.data?.user;

      await Storage.setItem('token', token);
      await Storage.setItem('userData', userData);

      dispatch(setUser(userData));
      dispatch(setToken(token));

      Alert.alert(t('common.success'), t('auth.logged_in_with_google'));
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert(
        t('auth.google_login_failed'),
        t('common.something_went_wrong'),
      );
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
           {t('signup.access_share')}
          </Text>
          <Text style={[styles.heroSubtitle, { fontSize: ui.font.body }]}>
            {t('signup.learn_tax_laws_easily')}
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
           {t('auth.sign_up')}
          </Text>

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
                <View style={styles.termsRow}>
  <TouchableOpacity
    style={styles.checkboxRow}
    onPress={() => setAgree(!agree)}
  >
    {/* Checkbox Box */}
    <View
      style={[
        styles.checkbox,
        agree && styles.checkboxChecked,
      ]}
    >
      {agree && (
        <Feather name="check" size={16} color="#fff" />
      )}
    </View>

    {/* Terms Text */}
    <Text style={styles.termsText}>
      {t('auth.terms_agreement')}{" "}
      <Text style={styles.link}>
        {t('auth.terms_and_conditions')}
      </Text>{" "}
      {t('common.and')}{" "}
      <Text style={styles.link}>
        {t('auth.privacy_policy')}
      </Text>.
    </Text>
  </TouchableOpacity>
</View>


                {/* SIGN UP BUTTON */}
                <PrimaryButton
                  title={loading ? t('common.please_wait') : t('auth.sign_up')}
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

                {/* LOGIN LINK */}
                <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={styles.loginLink}>
                  <Text style={styles.loginText}>{t('auth.login')}</Text>
                </TouchableOpacity>

                <DividerOr />

                <TouchableOpacity onPress={GoogleSignUp} style={styles.googleBtn}>
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
checkboxRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginTop: 10,
},

checkbox: {
  width: 22,
  height: 22,
  borderWidth: 1,
  borderColor: "#cfcfcf",
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 3,
},

checkboxChecked: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
},

termsText: {
  flex: 1,
  marginLeft: 12,
  color: "#333",
  lineHeight: 20,
  fontSize: 14,
},

link: {
  color: colors.primary,
  fontWeight: "600",
},

  // checkbox: {
  //   width: 22,
  //   height: 22,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 4,
  //   marginTop: 2,
  // },

  // checkboxTick: {
  //   flex: 1,
  //   backgroundColor: colors.primary,
  //   borderRadius: 2,
  // },

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
      errorText: {
    color: "red",
    fontSize: 13,
    marginTop: -4,
    marginBottom: 8
  },
});







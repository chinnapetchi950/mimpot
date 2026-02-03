import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import CustomHeader from '../components/CustomHeader';

import {authService} from '../api/authService';
import {setToken, setUser} from '../store/userSlice';
import Storage from '../utils/storage';
import {useDevice} from '../utils/useDeviceLayout';

// const {width, height} = Dimensions.get('window');

export default function LoginScreen({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {width, height, ui,isFolded, deviceType} = useDevice();

  const [rememberMe, setRememberMe] = useState(false);
  const [initialEmail, setInitialEmail] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- VALIDATION ----------------
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.invalid_email'))
      .required(t('auth.email_is_required')),
    password: Yup.string()
      .min(4, t('auth.password_too_short'))
      .required(t('auth.password_is_required')),
  });

  // ---------------- LOAD SAVED LOGIN ----------------
  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedEmail = await Storage.getItem('saved_email');
      const savedPassword = await Storage.getItem('saved_password');

      if (savedEmail && savedPassword) {
        setInitialEmail(savedEmail);
        setInitialPassword(savedPassword);
        setRememberMe(true);
      }
    };
    loadSavedCredentials();
  }, []);

  // ---------------- LOGIN ----------------
  const handleLogin = async (values, {setSubmitting}) => {
    try {
      const res = await authService.login(values);
      const token = res?.data?.data?.access_token;
      const userData = res?.data?.data;

      await Storage.setItem('token', token);
      await Storage.setItem('userData', userData);

      if (rememberMe) {
        Storage.setItem('saved_email', values.email);
        Storage.setItem('saved_password', values.password);
      } else {
        Storage.removeItem('saved_email');
        Storage.removeItem('saved_password');
      }

      dispatch(setUser(userData));
      dispatch(setToken(token));

      Alert.alert(t('common.success'), t('auth.logged_in_successfully'));
      navigation.replace('MainTabs');
    } catch (e) {
  console.log("AXIOS FULL ERROR", e);
  console.log("message:", e.message);
  console.log("response:", e.response);
  console.log("request:", e.request);

  Alert.alert(
    t('auth.login_failed'),
    e?.response?.data?.message || e.message || t('common.something_went_wrong'),
  );
}finally {
      setSubmitting(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
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

  // ---------------- UI ----------------
  return (
     <SafeAreaView style={styles.container}>
      <CustomHeader
        headerContainerStyle={{paddingHorizontal: ui.padding, elevation: 0}}
        showLanguage
      />

      {/* TOP CURVE */}
      <View
        style={[
          styles.topRounded,
          {
            width,
           height:isFolded?height*0.38: height * 0.48,
            borderBottomLeftRadius: ui.radius * 2,
            borderBottomRightRadius: ui.radius * 2,
          },
        ]}
        pointerEvents="none">
        <View
          style={[
            styles.logoCard,
            {
              width: isFolded?ui.image.avatar * 1:ui.image.avatar * 1,
              height: isFolded?ui.image.avatar * 1:ui.image.avatar * 1,
            },
          ]}>
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
            style={{
              width: ui.image.avatar,
              height: ui.image.avatar,
            }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop:isFolded?height*0.32: height * 0.42,
          paddingBottom: ui.spacing.xl,
        }}>
        <Text style={[styles.title, {fontSize: ui.font.h1}]}>
          {t('auth.log_in')}
        </Text>

        <Formik
          initialValues={{email: initialEmail, password: initialPassword}}
          enableReinitialize
          validationSchema={LoginSchema}
          onSubmit={handleLogin}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={[styles.form, {padding: ui.padding}]}>
              <InputField
                placeholder={t('auth.email_required')}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <InputField
                placeholder={t('auth.password_required')}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={!showPassword}
                rightIcon={{
                  name: showPassword ? 'eye-off' : 'eye',
                  onPress: () => setShowPassword(!showPassword),
                }}
              />
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <View style={[styles.row, {marginVertical: ui.spacing.sm}]}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}>
                    {rememberMe && (
                      <Feather name="check" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={[styles.smallText, {fontSize: 14}]}>
                    {t('auth.remember_me')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ForgotPasswordScreen')
                  }>
                  <Text style={[styles.smallText, {fontSize: 14}]}>
                    {t('auth.forgot_password')}
                  </Text>
                </TouchableOpacity>
              </View>

              <PrimaryButton
                title={
                  isSubmitting
                    ? t('common.please_wait')
                    : t('auth.log_in')
                }
                height={ui.button.height}
                fontSize={ui.button.fontSize}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />

              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={[
                    styles.signup,
                    {fontSize: ui.font.body},
                  ]}>
                  {t('auth.sign_up')}
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {marginVertical: ui.spacing.xl}]}>
                <View style={styles.line} />
                <Text style={styles.or}>{t('common.or')}</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.google} onPress={GoogleSignUp}>
                <Image
                  source={require('../assets/images/google.png')}
                  style={styles.googleIcon}
                />
                <Text
                  style={[
                    styles.googleText,
                    {fontSize: ui.font.body},
                  ]}>
                  {t('auth.continue_with_google')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  title: {
    fontWeight: '700',
    textAlign: 'center',
  },

  form: {},

  error: {
    color: 'red',
    fontSize: 13,
    marginTop: -6,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  checkboxRow: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1D9BF0',
    borderColor: '#1D9BF0',
  },

  smallText: {marginLeft: 8, color: '#1D1D1D'},

  signup: {
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 20,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {flex: 1, height: 1, backgroundColor: '#E5E7EB'},
  or: {marginHorizontal: 10, color: '#9CA3AF'},

  google: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {width: 24, height: 24, marginRight: 8},
  googleText: {fontWeight: '500'},

  topRounded: {
    position: 'absolute',
    top: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  logoCard: {
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

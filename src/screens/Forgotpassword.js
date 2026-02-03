import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import CustomHeader from '../components/CustomHeader';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDevice } from '../utils/useDeviceLayout';

import { authService } from '../api/authService';

const {width, height} = Dimensions.get('window');

export default function ForgotPasswordScreen({navigation}) {
  const {t} = useTranslation();
  const { ui, height,deviceType,isFolded } = useDevice(); // ✅ useDevice for responsive sizing

  // ---------------- VALIDATION ----------------
  const ForgotSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.invalid_email'))
      .required(t('auth.email_is_required')),
  });

  // ---------------- API CALL ----------------
  const handleForgotPassword = async (values, {setSubmitting}) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);

      const res = await authService.forgotPassword(formData);
console.log(res,'res');

      Alert.alert(
        t('common.success'),
        res?.data?.message ||
          t('auth.password_reset_link_sent'),
      );

      navigation.goBack();
    } catch (error) {
        console.log("error.res",error);
        
      Alert.alert(
        t('common.error'),
        error?.response?.data?.message ||
          t('common.something_went_wrong'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: ui.padding }]}>
      <CustomHeader
headerContainerStyle={{paddingHorizontal: ui.padding, elevation: 0}}        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={ui.font.h2} color="#000" />
          </TouchableOpacity>
        }
        showBack
        showLanguage={false}
      />

      {/* Top Logo Section */}
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
        pointerEvents="none"
      >
        <View
          style={[
            styles.logoCard,
{
              width: isFolded?ui.image.avatar * 1:ui.image.avatar * 1,
              height: isFolded?ui.image.avatar * 1:ui.image.avatar * 1,
            },          ]}
        >
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
        }}
      >
        <Text style={[styles.title, { fontSize: ui.font.h1 }]}>{t('auth.forgot_password_screen')}</Text>

        <Text style={[styles.subtitle, { fontSize: ui.font.body, paddingHorizontal: ui.padding }]}>
          {t(
            'auth.forgot_password_desc',
            'Enter registered email address to get your password reset information'
          )}
        </Text>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotSchema}
          onSubmit={handleForgotPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={{ paddingHorizontal: ui.padding }}>
              <InputField
                placeholder={t('auth.email_required')}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
              />

              {errors.email && touched.email && (
                <Text style={[styles.error, { fontSize: ui.font.small }]}>{errors.email}</Text>
              )}

              <View style={{ paddingTop: ui.spacing.lg }} />

              <PrimaryButton
                title={isSubmitting ? t('common.please_wait') : t('auth.reset_password')}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.signIn, { fontSize: ui.font.body }]}>{t('auth.sign_in')}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#6B7280',
    paddingHorizontal: 40,
    marginBottom: 30,
  },

  form: {
    paddingHorizontal: 20,
  },

  error: {
    color: 'red',
    fontSize: 13,
    marginTop: -6,
    marginBottom: 12,
  },

  signIn: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
  },

  topRounded: {
    position: 'absolute',
    top: 10,
    width,
    height: height * 0.35,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 72,
    borderBottomRightRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  logoCard: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },

//   title: {
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 10,
//   },

//   subtitle: {
//     textAlign: 'center',
//     color: '#6B7280',
//     marginBottom: 30,
//   },

//   error: {
//     color: 'red',
//     marginTop: -6,
//     marginBottom: 12,
//   },

//   signIn: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontWeight: '700',
//   },

//   topRounded: {
//     position: 'absolute',
//     top: 10,
//     width: '100%',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.06,
//     shadowRadius: 10,
//     elevation: 3,
//   },

//   logoCard: {
//     backgroundColor: '#f2f2f2',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
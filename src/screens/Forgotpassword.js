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


import { authService } from '../api/authService';

const {width, height} = Dimensions.get('window');

export default function ForgotPasswordScreen({navigation}) {
  const {t} = useTranslation();

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
    <SafeAreaView style={styles.container}>
      <CustomHeader
        headerContainerStyle={{paddingHorizontal: 20, elevation: 0}}
 leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }        showBack
        showLanguage={false}
      />

      {/* Top Logo Section */}
      <View style={styles.topRounded} pointerEvents="none">
        <View style={styles.logoCard}>
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
            style={{width: 120, height: 120}}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: height * 0.38,
          paddingBottom: 40,
        }}>
        <Text style={styles.title}>
          {t('auth.forgot_password_screen')}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'auth.forgot_password_desc',
            'Enter registered email address to get your password reset information',
          )}
        </Text>

        <Formik
          initialValues={{email: ''}}
          validationSchema={ForgotSchema}
          onSubmit={handleForgotPassword}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={styles.form}>
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
<View style={{paddingTop:30}}></View>
              <PrimaryButton
                title={
                  isSubmitting
                    ? t('common.please_wait')
                    : t('auth.reset_password')
                }
                onPress={handleSubmit}
                disabled={isSubmitting}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signIn}>
                  {t('auth.sign_in')}
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

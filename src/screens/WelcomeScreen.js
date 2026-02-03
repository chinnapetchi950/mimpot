import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { colors } from '../styles/theme';
import { useDevice } from '../utils/useDeviceLayout';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { ui, isTablet, isFolded } = useDevice();

  return (
    <SafeAreaView style={styles.container}>
      {/* LOGO */}
      <View style={[styles.logoWrap, { marginBottom: isTablet ? 40 : 20 }]}>
        <Image
          source={require('../assets/images/logo.png')}
          resizeMode="contain"
          style={{
            width: ui.image.hero * 0.75,
            height: ui.image.hero * 0.75,
          }}
        />
      </View>

      {/* TITLE */}
      <Text
        style={[
          styles.appTitle,
          { fontSize: ui.font.h1 },
        ]}
      >
        {t('welcome.app_title')}
      </Text>

      {/* SUBTITLE */}
      <Text
        style={[
          styles.subtitle,
          {
            fontSize: ui.font.body,
            marginTop: isTablet ? 16 : 8,
            paddingHorizontal: ui.padding,
            textAlign: 'center',
          },
        ]}
      >
        {t('welcome.subtitle')}
      </Text>

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        style={[
          styles.primary,
          {
            paddingVertical: ui.button.height / 4,
            paddingHorizontal: isTablet ? 80 : 60,
            borderRadius: ui.radius,
            marginTop: isTablet || isFolded ? 90 : 74,
          },
        ]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text
          style={[
            styles.primaryText,
            { fontSize: ui.button.text },
          ]}
        >
          {t('welcome.log_in')}
        </Text>
      </TouchableOpacity>

      {/* SIGN UP */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text
          style={[
            styles.link,
            { fontSize: ui.font.body },
          ]}
        >
          {t('welcome.create_account')}
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text
        style={[
          styles.footer,
          {
            fontSize: ui.font.body,
            bottom: isTablet || isFolded ? 70 : 40,
          },
        ]}
      >
        {t('welcome.footer')}
      </Text>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  logoWrap: {
    alignItems: 'center',
  },

  appTitle: {
    color: colors.primary,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },

  subtitle: {
    color: '#1D1D1D',
  },

  primary: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },

  link: {
    marginTop: 16,
    color: '#1D1D1D',
  },

  footer: {
    position: 'absolute',
    color: colors.primary,
    fontWeight: '600',
  },
});


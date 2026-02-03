import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Storage from '../utils/storage';
import { useDevice } from '../utils/useDeviceLayout';

export default function SplashScreen({ navigation }) {
  const { t } = useTranslation();
  const { width, height, ui, isTablet, isFolded } = useDevice();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await Storage.getItem('token');

      if (token) {
        navigation.replace('MainTabs');
      } else {
        setTimeout(() => {
          navigation.replace('Onboarding');
        }, 1600);
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP CURVED AREA */}
      <View
        style={[
          styles.topRounded,
          {
            width,
            height: isTablet ? height * 0.9 : height * 0.95,
          },
        ]}
      >
        {/* LOGO CARD */}
        <View
          style={[
            styles.logoCard,
            {
              width: ui.image.hero,
              height: ui.image.hero,
              borderRadius: ui.radius,
            },
          ]}
        >
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
            style={{
              width: ui.image.hero * 0.7,
              height: ui.image.hero * 0.7,
            }}
            accessible
            accessibilityLabel="M.impot logo"
          />
        </View>
      </View>

      {/* FOOTER TEXT */}
      <Text
        style={[
          styles.footer,
          {
            fontSize: ui.font.body,
            bottom: isTablet || isFolded ? 70 : 50,
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topRounded: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoCard: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  footer: {
    position: 'absolute',
    color: '#4aa8db',
    fontWeight: '600',
  },
});

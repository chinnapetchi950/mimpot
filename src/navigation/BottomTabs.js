
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../utils/useDeviceLayout';
import HomeScreen from '../screens/HomeScreen';
import TaxLawScreen from '../screens/TaxLawScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { t } = useTranslation();
  const { deviceType, ui } = useDevice(); // 👈 ADD

  const renderTab = (icon, label, focused) => (
  <View
    style={{
      minWidth: deviceType === 'tablet' ? 138 : 72,
      height: deviceType === 'tablet' ? 98 : 68,
      paddingHorizontal: 10,
      backgroundColor: focused ? '#2da9ff' : '#EEEEEE',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Feather
      name={icon}
      size={deviceType === 'tablet' ? 28 : 20}
      color={focused ? '#fff' : '#787878'}
    />

    <Text
      style={{
        fontSize: deviceType === 'tablet' ? 14 : 10,
        marginTop: 4,
        color: focused ? '#fff' : '#787878',
        textAlign: 'center',
      }}
      numberOfLines={2}
      adjustsFontSizeToFit
    >
      {label}
    </Text>
  </View>
);


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
       tabBarStyle: {
  height: deviceType === 'tablet' ? 125 : 100,
  borderTopWidth: 0,
  elevation: 8,
  paddingTop:deviceType === 'tablet' ? 8:18,
  paddingBottom: Platform.OS === 'ios' ? 22 : 12,
},

      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTab('home', t('tabs.home', 'Home'), focused),
        }}
      />

      <Tab.Screen
        name="TaxLaw"
        component={TaxLawScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTab('book-open', t('tabs.taxLaw', 'Tax Law'), focused),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTab('search', t('tabs.explore', 'Explore'), focused),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTab('user', t('tabs.profile', 'Profile'), focused),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTab('settings', t('tabs.settings', 'Settings'), focused),
        }}
      />
    </Tab.Navigator>
  );
}

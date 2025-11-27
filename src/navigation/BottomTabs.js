// // navigation/BottomTabs.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/HomeScreen';
// import TaxLawScreen from '../screens/TaxLawScreen';
// import ExploreScreen from '../screens/ExploreScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import Icon from 'react-native-vector-icons/Feather';
// import { View, Text } from 'react-native';

// const Tab = createBottomTabNavigator();

// export default function BottomTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           height: 70,
//           paddingBottom: 8,
//           paddingTop: 8,
//           elevation: 4,
//           borderTopWidth: 0,
//           backgroundColor: '#fff'
//         }
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View style={{ alignItems: 'center' }}>
//               <Icon name="home" size={20} color={focused ? '#2da9ff' : '#bdbdbd'} />
//               <Text style={{ fontSize: 11, color: focused ? '#2da9ff' : '#bdbdbd' }}>Home</Text>
//             </View>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="TaxLaw"
//         component={TaxLawScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View style={{ alignItems: 'center' }}>
//               <Icon name="book-open" size={20} color={focused ? '#2da9ff' : '#bdbdbd'} />
//               <Text style={{ fontSize: 11, color: focused ? '#2da9ff' : '#bdbdbd' }}>Tax Law</Text>
//             </View>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Explore"
//         component={ExploreScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View style={{ alignItems: 'center' }}>
//               <Icon name="grid" size={20} color={focused ? '#2da9ff' : '#bdbdbd'} />
//               <Text style={{ fontSize: 11, color: focused ? '#2da9ff' : '#bdbdbd' }}>Explore</Text>
//             </View>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View style={{ alignItems: 'center' }}>
//               <Icon name="user" size={20} color={focused ? '#2da9ff' : '#bdbdbd'} />
//               <Text style={{ fontSize: 11, color: focused ? '#2da9ff' : '#bdbdbd' }}>Profile</Text>
//             </View>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View style={{ alignItems: 'center' }}>
//               <Icon name="settings" size={20} color={focused ? '#2da9ff' : '#bdbdbd'} />
//               <Text style={{ fontSize: 11, color: focused ? '#2da9ff' : '#bdbdbd' }}>Settings</Text>
//             </View>
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/HomeScreen';
import TaxLawScreen from '../screens/TaxLawScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  const renderTab = (icon, label, focused) => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,          // FIX: keeps every tab icon+text aligned
      }}
    >
      <Icon
        name={icon}
        size={20}
        color={focused ? '#2da9ff' : '#bdbdbd'}
      />

      <Text
        style={{
          fontSize: 10.5,
          marginTop: 2,
          color: focused ? '#2da9ff' : '#bdbdbd',
        }}
        numberOfLines={1}
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
          height: Platform.OS === 'android' ? 60 : 80,
          paddingBottom: Platform.OS === 'ios' ? 18 : 8,
          paddingTop: 8,
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab("home", "Home", focused)
        }}
      />

      <Tab.Screen
        name="TaxLaw"
        component={TaxLawScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab("book-open", "Tax Law", focused)
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab("grid", "Explore", focused)
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab("user", "Profile", focused)
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab("settings", "Settings", focused)
        }}
      />
    </Tab.Navigator>
  );
}

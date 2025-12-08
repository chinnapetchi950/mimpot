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
import Feather from 'react-native-vector-icons/Feather';

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
        width: 70,
        height: 65,
        backgroundColor: focused ? '#2da9ff' : '#EEEEEE',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:40
      }}
    >
      <Feather
        name={icon}
        size={20}
        color={focused ? '#fff' : '#787878'}
      />

      <Text
        style={{
          fontSize: 11,
          marginTop: 4,
          color: focused ? '#fff' : '#787878',
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
          height: 90,
          //backgroundColor: '#0000001A',
          borderTopWidth: 0,
         // elevation: 0,
          shadowOpacity: 0,
          // paddingBottom: 10,
          // paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab('home', 'Home', focused)
        }}
      />

      <Tab.Screen
        name="TaxLaw"
        component={TaxLawScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab('book-open', 'Tax Law', focused)
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab('search', 'Explore', focused)
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab('user', 'Profile', focused)
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTab('settings', 'Settings', focused)
        }}
      />
    </Tab.Navigator>
  );
}




import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import HomeScreen from "../screens/HomeScreen";
import TaxLawScreen from "../screens/TaxLawScreen";
import ExploreScreen from "../screens/ExploreScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useDevice } from "../utils/useDeviceLayout";

const Tab = createBottomTabNavigator();

/* ✅ Custom TabBar */
function CustomTabBar({ state, descriptors, navigation }) {
    const { deviceType, ui } = useDevice();

 const TAB_HEIGHT =
    deviceType === "tablet"
      ? 90
      : deviceType === "unfolded"
      ? 82
      : 70;

  const ACTIVE_SIZE =
    deviceType === "tablet"
      ? 78
      : deviceType === "unfolded"
      ? 70
      : 65;

  const ICON_SIZE =
    deviceType === "tablet"
      ? 32
      : deviceType === "unfolded"
      ? 28
      : 24;

  const LABEL_SIZE =
    deviceType === "tablet"
      ? 14
      : deviceType === "unfolded"
      ? 13
      : 12;

  return (
    <View style={styles.wrapper}>

      {/* ✅ Pill Bar */}
      <View
        style={[
          styles.pillBar,
          {
            height: TAB_HEIGHT,
            borderRadius:TAB_HEIGHT/2,
           // borderRadius: ui.radius,
            paddingHorizontal: 10,
          },
        ]}
      >
        {state.routes.slice(0, 4).map((route, index) => {

          const { options } = descriptors[route.key];
          const focused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.8}
              style={[
                styles.tabBtn,

                focused && {
                  width: ACTIVE_SIZE,
                  height: ACTIVE_SIZE,
                  borderRadius: ACTIVE_SIZE /2,
                  backgroundColor: "#2da9ff",
                },
              ]}
            >
              {/* Icon */}
              <Image
                source={options.tabBarIconSource}
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  tintColor: focused ? "#fff" : "#888",
                  resizeMode: "contain",
                }}
              />

              {/* Label */}
              <Text
                style={{
                  fontSize: LABEL_SIZE,
                  marginTop: 3,
                  color: focused ? "#fff" : "#777",
                  fontWeight: focused ? "600" : "400",
                }}
              >
                {options.tabBarLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ✅ Profile Button */}
      <TouchableOpacity
        style={[
          styles.profileBtn,
          {
            width: ACTIVE_SIZE + 6,
            height: ACTIVE_SIZE + 6,
            borderRadius: (ACTIVE_SIZE + 6) / 2,
            backgroundColor: state.index === 4 ? "#2da9ff" : "#fff",
          },
        ]}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image
          source={require("../assets/images/tab4.png")}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            tintColor: state.index === 4 ? "#fff" : "#777",
          }}
        />

        <Text
          style={{
            fontSize: LABEL_SIZE,
            marginTop: 3,
            color: state.index === 4 ? "#fff" : "#777",
          }}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export default function BottomTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIconSource: require("../assets/images/tab1.png"),
        }}
      />

      {/* TaxLaw */}
      <Tab.Screen
        name="TaxLaw"
        component={TaxLawScreen}
        options={{
          tabBarLabel: "Tax Law",
          tabBarIconSource: require("../assets/images/tab2.png"),
        }}
      />

      {/* Explore */}
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIconSource: require("../assets/images/tab3.png"),
        }}
      />

      {/* Settings */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIconSource: require("../assets/images/tab5.png"),
        }}
      />

      {/* Profile Separate */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 25 : 15,
    left: 15,
    right: 15,

    flexDirection: "row",
    alignItems: "center",
  },

  pillBar: {
    flex: 1,
    // flexDirection: "row",
flexDirection: "row",
    justifyContent: 'space-between',
    // justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 10,
  },

  tabBtn: {
    justifyContent: "center",
    alignItems: "center",

    paddingVertical: 6,

    // ✅ Prevent Fold stretching problem
    //flexGrow: 1,
    maxWidth: 90,
  },

  profileBtn: {
    marginLeft: 12,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },

    elevation: 8,
  },
});


/* ✅ Styles */
// const styles = StyleSheet.create({
//   wrapper: {
//     position: "absolute",
//     bottom: Platform.OS === "ios" ? 25 : 15,
//     left: 15,
//     right: 15,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   /* ✅ Pill Bar Holds Only 4 Tabs */
//   pillBar: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: 'space-between',

//     backgroundColor: "#fff",
//    borderRadius:40,
// height:70,
//    //backgroundColor: "transparent",

//   // ✅ Figma Soft Shadow
//   shadowColor: "#000",
//   shadowOpacity: 0.18,
//   shadowRadius: 18,
//   shadowOffset: { width: 0, height: 6 },

//   elevation: 14, 
// },

// shadowBox: {
//   flex: 1,

//   backgroundColor: "transparent",

//   // ✅ Figma Soft Shadow
//   shadowColor: "#000",
//   shadowOpacity: 0.18,
//   shadowRadius: 18,
//   shadowOffset: { width: 0, height: 6 },

//   elevation: 14, // Android Shadow
// },

//   tabBtn: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 25,
//     marginHorizontal: 4,
//   },

//   activeTab: {
//      height: 64,
//     width:64,
//     borderRadius: 64/2,
//     marginTop:5,
//     backgroundColor: "#2da9ff",
//   },

//   icon: {
//     width: 24,
//     height: 24,
//     resizeMode: "contain",
//     marginBottom: 3,
//   },

//   label: {
//     fontSize: 12,
//     color: "#777",
//   },

//   activeLabel: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   /* ✅ Separate Profile Button */
//   profileBtn: {
//     width: 68,
//     height: 68,
//     borderRadius: 68/2,
//     marginLeft: 12,

//     backgroundColor: "#fff",

//     justifyContent: "center",
//     alignItems: "center",

//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },

//     elevation: 8,
//   },

//   profileActive: {
//     backgroundColor: "#2da9ff",
//   },

//   profileIcon: {
//     width: 24,
//     height: 24,
//     resizeMode: "contain",
//     marginBottom: 3,
//   },

//   profileLabel: {
//     fontSize: 12,
//     color: "#777",
//   },
// });

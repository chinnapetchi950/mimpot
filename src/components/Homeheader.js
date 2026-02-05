// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useTranslation } from "react-i18next";
// import { changeLanguage } from "../localization/i18n";
// import { useNavigation } from "@react-navigation/native";
// import { useDevice } from "../utils/useDeviceLayout";

// const LANGUAGES = [
//   {
//     code: "en",
//     label: "English",
//     flag: require("../assets/images/flag.png"),
//   },
//   {
//     code: "fr",
//     label: "French",
//     flag: require("../assets/images/france.png"),
//   },
// ];

// const getLanguageDisplay = (code) =>
//   code?.toLowerCase() === "en" ? "En" : "Fr";

// const HomeHeader = ({ userName = "" }) => {
//   const { i18n } = useTranslation();
//   const navigation = useNavigation();
//   const { ui, deviceType, isTablet, isUnfolded } = useDevice();

//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState(
//     i18n.language || "en"
//   );

//   useEffect(() => {
//     setCurrentLanguage(i18n.language || "en");
//   }, [i18n.language]);

//   const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

//   const selectLanguage = async (code) => {
//     await changeLanguage(code);
//     setCurrentLanguage(code);
//     setDropdownVisible(false);
//   };

//   const selectedLang =
//     LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           paddingHorizontal:deviceType==='folded'?10:20,
//           paddingTop: isTablet || isUnfolded ? ui.spacing.lg : ui.spacing.md,
//           paddingBottom: ui.spacing.md,
//         },
//       ]}
//     >
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       <View style={styles.headerRow}>
//         {/* LEFT : LOGO + USER */}
//         <View style={styles.leftSection}>
//           <Image
//             source={require("../assets/images/logo.png")}
//             resizeMode="contain"
//             style={{
//               width: ui.image.avatar * 0.45,
//               height: ui.image.avatar * 0.45,
//             }}
//           />

//           <Text
//             numberOfLines={1}
//             ellipsizeMode="tail"
//             style={[
//               styles.userName,
//               {
//                 fontSize: ui.font.h2,
//                 marginLeft: ui.spacing.sm,
//                 maxWidth:
//                   deviceType === "folded"
//                     && 190
//                     // : deviceType === "phone"
//                     // ? 180
//                     // : 300,
//               },
//             ]}
//           >
//             {userName.charAt(0).toUpperCase() + userName.slice(1)}
//           </Text>
//         </View>

//         {/* RIGHT : LANGUAGE */}
//         <View style={styles.rightSection}>
//           <View>
//             <TouchableOpacity
//               style={[
//                 styles.langBox,
//                 {
//                   paddingHorizontal: ui.spacing.sm,
//                   paddingVertical: 6,
//                   borderRadius: ui.radius,
//                 },
//               ]}
//               onPress={toggleDropdown}
//             >
//               <Image
//                 source={selectedLang.flag}
//                 style={{
//                   width: 22,
//                   height: 22,
//                   borderRadius: 11,
//                   marginRight: 6,
//                 }}
//               />
//               <Text
//                 style={{
//                   fontSize: ui.font.small,
//                   marginRight: 4,
//                   color: "#000",
//                 }}
//               >
//                 {getLanguageDisplay(currentLanguage)}
//               </Text>
//               <Ionicons
//                 name={dropdownVisible ? "chevron-up" : "chevron-down"}
//                 size={16}
//                 color="#555"
//               />
//             </TouchableOpacity>

//             {dropdownVisible && (
//               <View
//                 style={[
//                   styles.dropdown,
//                   {
//                     top: 44,
//                     width: isTablet || isUnfolded ? 150 : 120,
//                     borderRadius: ui.radius,
//                   },
//                 ]}
//               >
//                 {LANGUAGES.map((lang) => (
//                   <TouchableOpacity
//                     key={lang.code}
//                     style={styles.dropdownItem}
//                     onPress={() => selectLanguage(lang.code)}
//                   >
//                     <Image
//                       source={lang.flag}
//                       style={{
//                         width: 22,
//                         height: 22,
//                         borderRadius: 11,
//                       }}
//                     />
//                     <Text
//                       style={{
//                         marginLeft: ui.spacing.sm,
//                         fontSize: ui.font.body,
//                         color: "#000",
//                       }}
//                     >
//                       {lang.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default HomeHeader;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#fff",
//     // elevation: 4,
//     zIndex: 1000,
//       shadowColor: "#000",
//   shadowOpacity: 0.18,
//   shadowRadius: 18,
//   shadowOffset: { width: 0, height: 6 },

//   elevation: 14,
//   },

//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     minWidth: 0,
//   },

//   userName: {
//     fontWeight: "700",
//     color: "#1e88e5",
//   },

//   rightSection: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   langBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f3f3",
//   },

//   dropdown: {
//     position: "absolute",
//     right: 0,
//     backgroundColor: "#fff",
//     elevation: 6,
//     zIndex: 200,
//   },

//   dropdownItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//   },
// });

{/* <HomeHeader userName="Monsieur Impots" /> */}


import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useDevice } from "../utils/useDeviceLayout";

const HomeHeader = ({ title = "Home" }) => {
  const { ui, deviceType, isTablet, isUnfolded } = useDevice();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: deviceType === "folded" ? 10 : 20,
          paddingTop: isTablet || isUnfolded ? ui.spacing.lg : ui.spacing.md,
          paddingBottom: ui.spacing.md,
        },
      ]}
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.headerRow}>
        {/* ✅ LEFT : TITLE */}
        <Text
        ellipsizeMode="tail"
          style={[
            styles.title,
            {
              fontSize: 26,
               maxWidth:230
                //    deviceType === "folded"
                // && 190
//                     // : deviceType === "phone"
//                     // ? 180
//                     // : 300,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* ✅ RIGHT : APP LOGO */}
        <Image
          source={require("../assets/images/logo.png")}
          resizeMode="contain"
          style={{
            width: ui.image.avatar * 0.65,
            height: ui.image.avatar * 0.65,
          }}
        />
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    zIndex: 1000,

    /* ✅ Soft Shadow Like Figma */
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "700",
    fontSize:20,
    color: "#1e88e5",
  },
});

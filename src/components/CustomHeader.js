// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { RFValue } from "react-native-responsive-fontsize";
// import { StatusBar } from "react-native";

// const CustomHeader = ({
//   title,
//   showLanguage = true,
//   onLanguagePress = () => {},
//   leftComponent = null,
//   rightComponent = null,
//   headertextstyle,
// }) => {
//   return (
//     <View style={styles.container}>
//         <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
//       {/* Status Bar Row */}
//       {/* <View style={styles.statusRow}>
//         <Text style={styles.time}>9:41</Text>

//         <View style={styles.statusIcons}>
//           <Ionicons name="cellular" size={18} color="#000" />
//           <Ionicons name="wifi" size={18} color="#000" style={{ marginLeft: 6 }} />
//           <Ionicons
//             name="battery-full"
//             size={22}
//             color="#000"
//             style={{ marginLeft: 6 }}
//           />
//         </View>
//       </View> */}

//       {/* Header Row */}
//       <View style={[styles.headerRow]}>
//         {/* Left Custom Component */}
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           {leftComponent}
//           <Text style={[styles.title,headertextstyle]}>{title}</Text>
//         </View>

//         {/* Right Area: Either custom or language */}
//         {rightComponent!=null&&rightComponent ? (
//           rightComponent
//         ) : (
//           showLanguage && (
//             <TouchableOpacity style={styles.langBox} onPress={onLanguagePress}>
//               <Image
//                 source={require("../assets/images/flag.png")}
//                 style={styles.flag}
//               />
//               <Text style={styles.langText}>En</Text>
//               <Ionicons name="chevron-down" size={16} color="#555" />
//             </TouchableOpacity>
//           )
//         )}
//       </View>
      
//     </View>
//   );
// };

// export default CustomHeader;

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     backgroundColor: "#fff",
//     elevation:5
//   },

//   statusRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   time: {
//     fontSize: RFValue(14),
//     fontWeight: "600",
//     color: "#000",
//   },

//   statusIcons: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   headerRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom:15
//   },

//   title: {
//     fontSize: RFValue(18),
//     fontWeight: "700",
//     color: "#000",
//     marginLeft:20
//   },

//   langBox: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   flag: {
//     width: 22,
//     height: 22,
//     borderRadius: 50,
//     marginRight: 5,
//   },

//   langText: {
//     fontSize: RFValue(14),
//     marginRight: 4,
//     color: "#000",
//   },
// });


// {/* <CustomHeader
//   title="Profile"
//   leftComponent={
//     <TouchableOpacity onPress={() => navigation.goBack()}>
//       <Ionicons name="chevron-back" size={26} color="#000" />
//     </TouchableOpacity>
//   }
// />
// 🧩 4. Add Custom Right Button (Optional)
// js
// Copy code
// <CustomHeader
//   title="Messages"
//   rightComponent={
//     <TouchableOpacity onPress={openFilter}>
//       <Ionicons name="filter" size={22} color="#000" />
//     </TouchableOpacity>
//   }
// /> */}

import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../localization/i18n";
import { useDevice } from "../utils/useDeviceLayout";

const CustomHeader = ({
  title,
  showLanguage = true,
  onLanguageChange = (lang) => {},
  leftComponent = null,
  rightComponent = null,
  headertextstyle,
  headerContainerStyle = {},
    showlogo = false,

}) => {
  const { t, i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");
const {ui,deviceType}=useDevice()
  useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
  }, [i18n.language]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const selectLanguage = async (langCode) => {
    const langMap = { "En": "en", "Fr": "fr" };
    const code = langMap[langCode] || langCode.toLowerCase();
    await changeLanguage(code);
    setCurrentLanguage(code);
    onLanguageChange(code);
    setDropdownVisible(false);
  };

  const getLanguageDisplay = (code) => {
    return code === "en" || code === "En" ? "En" : "Fr";
  };

  // const languages = [
  //   { code: "En", label: t("language.english") },
  //   { code: "Fr", label: t("language.french") },
  // ];

const LANGUAGES = [
  {
    code: "en",
   label: t("language.english"),
    flag: require("../assets/images/flag.png"),
  },
  {
    code: "fr",
    label: t("language.french"),
    flag: require("../assets/images/france.png"),
  },
];
 const selectedLang =
    LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];
  return (
<View style={[styles.container, headerContainerStyle]}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header Row */}
      <View style={[styles.headerRow]}>
        {/* Left Custom Component */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftComponent}
          {showlogo&&
           <Image
                      source={require("../assets/images/logo.png")}
                      resizeMode="contain"
                      style={{
                        width: ui.image.avatar * 0.48,
                        height: ui.image.avatar * 0.48,
                      }}
                    />
}
          <Text  numberOfLines={1}
            ellipsizeMode="tail" style={[styles.title,{maxWidth:
                  deviceType === "folded"
                    && 280}, headertextstyle]}>{title}</Text>
        </View>

        {/* Right Area */}
        {rightComponent ? (
          rightComponent
        ) : (
          showLanguage && (
            <View>
              <TouchableOpacity style={styles.langBox} onPress={toggleDropdown}>
                <Image
                  source={selectedLang.flag}
                  style={styles.flag}
                />
                <Text style={styles.langText}>{getLanguageDisplay(currentLanguage)}</Text>
                <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={16} color="#555" />
              </TouchableOpacity>

              {/* Dropdown Below Icon */}
              {dropdownVisible && (
                <View style={styles.dropdown}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={styles.dropdownItem}
                      onPress={() => selectLanguage(lang.code)}
                    >
                      <Image source={lang.flag} style={styles.flag} />
                      <Text style={styles.dropdownText}>{lang.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
    elevation: 5,
    zIndex: 10,
  },
  headerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
      shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14,
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: "#000",
    marginLeft: 30,
    
  },
  langBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  flag: {
    width: 22,
    height: 22,
    borderRadius: 50,
    marginRight: 5,
  },
  langText: {
    fontSize: RFValue(14),
    marginRight: 4,
    color: "#000",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 8,
    paddingVertical: 5,
    width: 102,
    zIndex: 100,
  },
   dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
  },
  // dropdownItem: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
    
  // },
  dropdownText: {
    fontSize: RFValue(14),
    color: "#000",
  },
});


// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { RFValue } from "react-native-responsive-fontsize";
// import { StatusBar } from "react-native";

// const CustomHeader = ({
//   title,
//   showLanguage = true,
//   onLanguagePress = () => {},
//   leftComponent = null,
//   rightComponent = null,
//   headertextstyle,
// }) => {
//   return (
//     <View style={styles.container}>
//         <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
//       {/* Status Bar Row */}
//       {/* <View style={styles.statusRow}>
//         <Text style={styles.time}>9:41</Text>

//         <View style={styles.statusIcons}>
//           <Ionicons name="cellular" size={18} color="#000" />
//           <Ionicons name="wifi" size={18} color="#000" style={{ marginLeft: 6 }} />
//           <Ionicons
//             name="battery-full"
//             size={22}
//             color="#000"
//             style={{ marginLeft: 6 }}
//           />
//         </View>
//       </View> */}

//       {/* Header Row */}
//       <View style={[styles.headerRow]}>
//         {/* Left Custom Component */}
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           {leftComponent}
//           <Text style={[styles.title,headertextstyle]}>{title}</Text>
//         </View>

//         {/* Right Area: Either custom or language */}
//         {rightComponent!=null&&rightComponent ? (
//           rightComponent
//         ) : (
//           showLanguage && (
//             <TouchableOpacity style={styles.langBox} onPress={onLanguagePress}>
//               <Image
//                 source={require("../assets/images/flag.png")}
//                 style={styles.flag}
//               />
//               <Text style={styles.langText}>En</Text>
//               <Ionicons name="chevron-down" size={16} color="#555" />
//             </TouchableOpacity>
//           )
//         )}
//       </View>
      
//     </View>
//   );
// };

// export default CustomHeader;

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     backgroundColor: "#fff",
//     elevation:5
//   },

//   statusRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   time: {
//     fontSize: RFValue(14),
//     fontWeight: "600",
//     color: "#000",
//   },

//   statusIcons: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   headerRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom:15
//   },

//   title: {
//     fontSize: RFValue(18),
//     fontWeight: "700",
//     color: "#000",
//     marginLeft:20
//   },

//   langBox: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   flag: {
//     width: 22,
//     height: 22,
//     borderRadius: 50,
//     marginRight: 5,
//   },

//   langText: {
//     fontSize: RFValue(14),
//     marginRight: 4,
//     color: "#000",
//   },
// });


// {/* <CustomHeader
//   title="Profile"
//   leftComponent={
//     <TouchableOpacity onPress={() => navigation.goBack()}>
//       <Ionicons name="chevron-back" size={26} color="#000" />
//     </TouchableOpacity>
//   }
// />
// 🧩 4. Add Custom Right Button (Optional)
// js
// Copy code
// <CustomHeader
//   title="Messages"
//   rightComponent={
//     <TouchableOpacity onPress={openFilter}>
//       <Ionicons name="filter" size={22} color="#000" />
//     </TouchableOpacity>
//   }
// /> */}

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
// import { useDevice } from "../utils/useDeviceLayout"; // <-- your hook

// const CustomHeader = ({
//   title,
//   showLanguage = true,
//   onLanguageChange = (lang) => {},
//   leftComponent = null,
//   rightComponent = null,
//   headertextstyle,
//   headerContainerStyle = {},
// }) => {
//   const { t, i18n } = useTranslation();
//   const device = useDevice(); // 🔹 get all device info
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

//   useEffect(() => {
//     setCurrentLanguage(i18n.language || "en");
//   }, [i18n.language]);

//   const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

//   const selectLanguage = async (langCode) => {
//     const langMap = { En: "en", Fr: "fr" };
//     const code = langMap[langCode] || langCode.toLowerCase();
//     await changeLanguage(code);
//     setCurrentLanguage(code);
//     onLanguageChange(code);
//     setDropdownVisible(false);
//   };

//   const getLanguageDisplay = (code) => (code === "en" ? "En" : "Fr");

//   const LANGUAGES = [
//     { code: "en", label: t("language.english"), flag: require("../assets/images/flag.png") },
//     { code: "fr", label: t("language.french"), flag: require("../assets/images/france.png") },
//   ];

//   const selectedLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

//   return (
//     <View
//       style={[
//         styles.container,
//         headerContainerStyle,
//         { paddingHorizontal: 10},
//       ]}
//     >
//       <StatusBar backgroundColor="white" barStyle="dark-content" />

//       <View style={[styles.headerRow]}>
//         {/* Left component + title */}
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           {leftComponent}
//           <Text
//             style={[
//               styles.title,
//               headertextstyle,
//               { fontSize: device.ui.font.h2, marginLeft: 30 },
//             ]}
//           >
//             {title}
//           </Text>
//         </View>

//         {/* Right component / Language */}
//         {rightComponent ? (
//           rightComponent
//         ) : (
//           showLanguage && (
//             <View>
//               <TouchableOpacity
//                 style={[
//                   styles.langBox,
//                   { paddingHorizontal: device.ui.spacing.md, paddingVertical: device.ui.spacing.sm },
//                 ]}
//                 onPress={toggleDropdown}
//               >
//                 <Image
//                   source={selectedLang.flag}
//                   style={{ width: device.ui.font.h2, height: device.ui.font.h2, borderRadius: device.ui.radius / 2, marginRight: 5 }}
//                 />
//                 <Text style={{ fontSize: device.ui.font.body, marginRight: 4, color: "#000" }}>
//                   {getLanguageDisplay(currentLanguage)}
//                 </Text>
//                 <Ionicons
//                   name={dropdownVisible ? "chevron-up" : "chevron-down"}
//                   size={device.ui.font.body}
//                   color="#555"
//                 />
//               </TouchableOpacity>

//               {dropdownVisible && (
//                 <View
//                   style={[
//                     styles.dropdown,
//                     {
//                       top: device.ui.spacing.lg,
//                       width: device.width * 0.25,
//                       paddingVertical: device.ui.spacing.sm,
//                     },
//                   ]}
//                 >
//                   {LANGUAGES.map((lang) => (
//                     <TouchableOpacity
//                       key={lang.code}
//                       style={[
//                         styles.dropdownItem,
//                         { paddingVertical: device.ui.spacing.sm, paddingHorizontal: device.ui.spacing.md },
//                       ]}
//                       onPress={() => selectLanguage(lang.code)}
//                     >
//                       <Image
//                         source={lang.flag}
//                         style={{ width: device.ui.font.body, height: device.ui.font.body, borderRadius: device.ui.radius / 2, marginRight: 5 }}
//                       />
//                       <Text style={{ fontSize: device.ui.font.body, color: "#000" }}>
//                         {lang.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>
//           )
//         )}
//       </View>
//     </View>
//   );
// };

// export default CustomHeader;

// const styles = StyleSheet.create({
//     container: {
//     backgroundColor: "#fff",
    
//     // Android bottom-only shadow
//     elevation: 5, // keeps the shadow
//     shadowColor: "#000", // iOS shadow
//     shadowOffset: { width: 0, height: 3 }, // bottom shadow
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     zIndex: 10,

//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     position: "relative",
//   },
//   title: {
//     fontWeight: "700",
//     color: "#000",
//   },
//   langBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//     borderRadius: 20,
//   },
//   dropdown: {
//     position: "absolute",
//     right: 0,
//     backgroundColor: "#fff",
//     elevation: 5,
//     borderRadius: 8,
//     zIndex: 100,
//   },
//   dropdownItem: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });


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

const CustomHeader = ({
  title,
  showLanguage = true,
  onLanguageChange = (lang) => {},
  leftComponent = null,
  rightComponent = null,
  headertextstyle,
  headerContainerStyle = {},
}) => {
  const { t, i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

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

  const languages = [
    { code: "En", label: t("language.english") },
    { code: "Fr", label: t("language.french") },
  ];

  return (
<View style={[styles.container, headerContainerStyle]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {/* Header Row */}
      <View style={[styles.headerRow]}>
        {/* Left Custom Component */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftComponent}
          <Text style={[styles.title, headertextstyle]}>{title}</Text>
        </View>

        {/* Right Area */}
        {rightComponent ? (
          rightComponent
        ) : (
          showLanguage && (
            <View>
              <TouchableOpacity style={styles.langBox} onPress={toggleDropdown}>
                <Image
                  source={require("../assets/images/flag.png")}
                  style={styles.flag}
                />
                <Text style={styles.langText}>{getLanguageDisplay(currentLanguage)}</Text>
                <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={16} color="#555" />
              </TouchableOpacity>

              {/* Dropdown Below Icon */}
              {dropdownVisible && (
                <View style={styles.dropdown}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={styles.dropdownItem}
                      onPress={() => selectLanguage(lang.code)}
                    >
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
    paddingTop: 20,
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
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: "#000",
    marginLeft: 20,
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
    width: 120,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: RFValue(14),
    color: "#000",
  },
});

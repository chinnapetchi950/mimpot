import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../localization/i18n";
import { useNavigation } from '@react-navigation/native';

const LANGUAGES = [
  {
    code: "en",
    label: "English",
    flag: require("../assets/images/flag.png"),
  },
  {
    code: "fr",
    label: "French",
    flag: require("../assets/images/france.png"),
  },
];
const getLanguageDisplay = (code) => {
    return code === "en" || code === "En" ? "En" : "Fr";
  };
const HomeHeader = ({ userName}) => {
  const { i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language || "en"
  );
const navigation = useNavigation();

  useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
  }, [i18n.language]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const selectLanguage = async (code) => {
    await changeLanguage(code);
    setCurrentLanguage(code);
    setDropdownVisible(false);
  };

  /* ===== USER INITIALS LOGIC ===== */
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (
      words[0][0].toUpperCase() + words[1][0].toUpperCase()
    );
  };

  const initials = getInitials(userName);

  const selectedLang =
    LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];
//     const formatUserName = (name = "") =>
//   name
//     .split(" ")
//     .map(w => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(" ");


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.headerRow}>
        {/* LEFT : LOGO + NAME */}
        <View style={styles.leftSection}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text   ellipsizeMode="tail"   numberOfLines={1}

style={styles.userName}>{userName.charAt(0).toUpperCase() + userName.slice(1)}</Text>
        </View>

        {/* RIGHT : LANGUAGE + AVATAR */}
        <View style={styles.rightSection}>
          {/* Language Dropdown */}
          <View>
            <TouchableOpacity
              style={styles.langBox}
              onPress={toggleDropdown}
            >
              <Image source={selectedLang.flag} style={styles.flag} />
                              <Text style={styles.langText}>{getLanguageDisplay(currentLanguage)}</Text>
              <Ionicons
                name={dropdownVisible ? "chevron-up" : "chevron-down"}
                size={16}
                color="#555"
              />
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={styles.dropdown}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={styles.dropdownItem}
                    onPress={() => selectLanguage(lang.code)}
                  >
                    <Image source={lang.flag} style={styles.flag} />
                    <Text style={styles.dropdownText}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Avatar */}
          {/* <TouchableOpacity onPress={() => {navigation.navigate('MainTabs', {
  screen: 'Profile',
});}} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    elevation: 4,
    zIndex: 1000,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0
  },
  logo: {
    width: 48,
    height: 48,
  },
  userName: {
    marginLeft: 10,
    fontSize: RFValue(17),
    fontWeight: "700",
    color: "#1e88e5",
    flexShrink: 1, 
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  langBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    //marginRight: 10,
  },
  langText: {
    fontSize: RFValue(14),
    marginRight: 4,
    color: "#000",
  },
  flag: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6,
    width: 112,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: RFValue(14),
    color: "#000",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: "#f7941d",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: RFValue(14),
  },
});
{/* <HomeHeader userName="Monsieur Impots" /> */}

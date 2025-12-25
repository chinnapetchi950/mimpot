import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

/**
 * Props:
 * - title (string)
 * - showBack (bool)
 * - onBack (fn)
 * - showLanguage (bool)
 * - onLanguagePress (fn)
 * - rightIcon (element) // optional custom element
 * - onRightPress (fn)
 */
const AppHeader = ({
  title,
  showBack = false,
  onBack = () => {},
  showLanguage = true,
  onLanguagePress = () => {},
  rightIcon = null,
  onRightPress = () => {},
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'En' : 'Fr';
  
  return (
    <View style={styles.container}>
      {/* status row (time on left + status icons right) */}
      {/* <View style={styles.statusRow}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.iconsRow}>
          <Ionicons name="cellular" size={hp("2.2%")} />
          <Ionicons name="wifi" size={hp("2.2%")} style={{ marginLeft: wp("1.4%") }} />
          <Ionicons name="battery-full" size={hp("2.6%")} style={{ marginLeft: wp("1.4%") }} />
        </View>
      </View> */}

      {/* header row */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={hp("3.2%")} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress}>{rightIcon}</TouchableOpacity>
        ) : (
          showLanguage && (
            <TouchableOpacity style={styles.langBox} onPress={onLanguagePress}>
              <Image source={require("../assets/images/flag.png")} style={styles.flag} />
              <Text style={styles.langText}>{currentLang}</Text>
              <Ionicons name="chevron-down" size={hp("1.8%")} color="#555" />
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.divider} />
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: wp("4%"),
    paddingTop: hp("1.2%"),
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
  },
  iconsRow: { flexDirection: "row", alignItems: "center" },
  headerRow: {
    marginTop: hp("1.4%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    marginRight: wp("2%"),
    padding: hp("0.6%"),
  },
  title: {
    fontSize: hp("2.8%"),
    fontWeight: "700",
  },
  langBox: { flexDirection: "row", alignItems: "center" },
  flag: { width: wp("6%"), height: wp("4.2%"), resizeMode: "cover", borderRadius: 50, marginRight: wp("2%") },
  langText: { marginRight: wp("1%"), fontSize: hp("2%") },
  divider: { height: 1, backgroundColor: "#eee", marginTop: hp("1.2%") },
});

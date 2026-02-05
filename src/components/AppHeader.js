import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout";

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
  const { ui, deviceType } = useDevice();

  const currentLang = i18n.language === "en" ? "En" : "Fr";

  return (
    <View
      style={[
        styles.container,
        {
         /// paddingHorizontal: ui.padding,
          paddingTop: ui.spacing.md,
        },
      ]}
    >
      {/* HEADER ROW */}
      <View
        style={[
          styles.headerRow,
          { marginTop: ui.spacing.sm },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              style={[
                styles.backBtn,
                { padding: ui.spacing.sm },
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={ui.font.h2}
                color="#000"
              />
            </TouchableOpacity>
          )}

          <Text
            style={[
              styles.title,
              {
                fontSize: ui.font.h2,
                marginLeft: showBack ? ui.spacing.sm : 0,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* RIGHT SIDE */}
        {rightIcon ? (
          <TouchableOpacity  onPress={onRightPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          showLanguage && (
            <TouchableOpacity
              style={[
                styles.langBox,
                {
                  paddingHorizontal:12,
                  paddingVertical: ui.spacing.sm / 2,
                  borderRadius: ui.radius,
                },
              ]}
              onPress={onLanguagePress}
            >
              <Image
                source={require("../assets/images/flag.png")}
                style={{
                  width:
                    deviceType === "tablet"
                      ? 36
                      : deviceType === "unfolded"
                      ? 32
                      : 26,
                  height:
                    deviceType === "tablet"
                      ? 24
                      : deviceType === "unfolded"
                      ? 22
                      : 18,
                  borderRadius: 50,
                  marginRight: ui.spacing.sm,
                }}
              />

              <Text
                style={{
                  fontSize: ui.font.body,
                  marginRight: ui.spacing.sm / 2,
                }}
              >
                {currentLang}
              </Text>

              <Ionicons
                name="chevron-down"
                size={15}
                color="#555"
                style={{marginLeft:20,marginRight:40}}
              />
            </TouchableOpacity>
          )
        )}
      </View>

      {/* DIVIDER */}
      <View
        style={[
          styles.divider,
          { marginTop: 10 },
        ]}
      />
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontWeight: "700",
    color: "#000",
  },

  langBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
});


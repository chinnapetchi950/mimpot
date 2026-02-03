import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout";

export default function DividerOr() {
  const { t } = useTranslation();
  const { ui, isTablet, isUnfolded } = useDevice();

  return (
    <View
      style={[
        styles.container,
        { marginTop: ui.spacing.lg },
      ]}
    >
      <View
        style={[
          styles.line,
          {
            height: isTablet || isUnfolded ? 1.5 : 1,
          },
        ]}
      />

      <Text
        style={[
          styles.or,
          {
            marginHorizontal: ui.spacing.md,
            fontSize: ui.font.body,
          },
        ]}
      >
        {t("common.or")}
      </Text>

      <View
        style={[
          styles.line,
          {
            height: isTablet || isUnfolded ? 1.5 : 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  or: {
    color: "#9b9b9b",
    fontWeight: "500",
  },
});


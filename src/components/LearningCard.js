import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ImageWithLoader from "./ImageWithloader";
import { useDevice } from "../utils/useDeviceLayout";

export default function LearningCard({ item, onPress }) {
  const { ui, deviceType } = useDevice();
  const BASE_URL = "http://testlink2.pillersofttechnologies.com/storage/";

  const imageHeight =
    deviceType === "tablet"
      ? 260
      : deviceType === "unfolded"
      ? 220
      : 180;

  const playSize =
    deviceType === "tablet"
      ? 70
      : deviceType === "unfolded"
      ? 62
      : 54;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.wrap,
        {
          marginHorizontal: ui.spacing.md,
          marginTop: ui.spacing.sm,
          borderRadius: ui.radius,
        },
      ]}
    >
      {/* IMAGE */}
      <ImageWithLoader
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={{ width: "100%", height: imageHeight }}
      />

      {/* PLAY BUTTON */}
      <View
        style={[
          styles.play,
          {
            width: playSize,
            height: playSize,
            borderRadius: playSize / 2,
            top: imageHeight / 2 - playSize / 2,
          },
        ]}
      >
        <Text style={{ fontSize: ui.font.h2, color: "#fff" }}>▶</Text>
      </View>

      {/* INFO */}
      <View
        style={[
          styles.info,
          {
            padding: ui.spacing.md,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { fontSize: ui.font.h2 },
          ]}
        >
          {item.title}
        </Text>

        <Text
          style={[
            styles.by,
            { fontSize: ui.font.small },
          ]}
        >
          {item.author ?? "By M.impot"}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            styles.desc,
            {
              fontSize: ui.font.body,
              marginTop: ui.spacing.sm,
            },
          ]}
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
  },
  play: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -0.5 }],
    backgroundColor: "rgba(42,168,242,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {},
  title: {
    fontWeight: "800",
    color: "#000",
  },
  by: {
    color: "#6B7280",
    marginTop: 6,
  },
  desc: {
    color: "#374151",
  },
});

// VideoCard.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ImageWithLoader from "./ImageWithloader";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout"; // adjust path

export default function VideoCard({ item, onPress }) {
  const { t } = useTranslation();
  const { deviceType, ui } = useDevice();

  const BASE_URL =
    "http://testlink2.pillersofttechnologies.com/storage/";

  const styles = createStyles(deviceType, ui);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      {/* Thumbnail */}
      <View>
        <ImageWithLoader
          source={{ uri: `${BASE_URL}${item.image}` }}
          style={styles.thumbnail}
        />

        <View style={styles.playBtn}>
          <Icon
            name="play"
            size={styles.playIcon.fontSize}
            color="#fff"
          />
        </View>
      </View>

      {/* Title + Rating */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.author}>
            {t("video_details.by")} {"M.impot"}
          </Text>
        </View>

        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Icon
              key={i}
              name="star"
              size={ui.font.small + 2}
              color={i <= item.total_ratings ? "#ff9d27" : "#ccc"}
            />
          ))}
        </View>
      </View>

      {/* Description */}
      <Text numberOfLines={3} style={styles.description}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (deviceType, ui) =>
  StyleSheet.create({
    card: {
      marginBottom: ui.spacing.lg,
      paddingHorizontal: ui.spacing.md,
    },

    thumbnail: {
      width: "100%",
      height:
        deviceType === "tablet"
          ? 280
          : deviceType === "unfolded"
          ? 240
          : 200,
      borderRadius: 12,
    },

    playBtn: {
      position: "absolute",
      top: "40%",
      left: "45%",
      backgroundColor: "#00000088",
      width:
        deviceType === "tablet"
          ? 72
          : deviceType === "unfolded"
          ? 64
          : 56,
      height:
        deviceType === "tablet"
          ? 72
          : deviceType === "unfolded"
          ? 64
          : 56,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
    },

    playIcon: {
      fontSize:
        deviceType === "tablet"
          ? 34
          : deviceType === "unfolded"
          ? 30
          : 26,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: ui.spacing.sm,
    },

    title: {
      fontSize: ui.font.h2,
      fontWeight: "700",
      color: "#111",
    },

    author: {
      marginTop: 4,
      fontSize: ui.font.small,
      color: "#777",
    },

    rating: {
      flexDirection: "row",
      marginLeft: ui.spacing.sm,
    },

    description: {
      marginTop: ui.spacing.sm,
      fontSize: ui.font.body,
      color: "#555",
    },
  });


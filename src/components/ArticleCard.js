// ArticleCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";
import ImageWithLoader from "./ImageWithloader";
import { useTranslation } from "react-i18next";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDevice } from "../utils/useDeviceLayout";

export default function ArticleCard({ item, onPress, onDownload }) {
  const { t } = useTranslation();
  const { ui, deviceType, numColumns } = useDevice();

  const BASE_URL = "http://testlink2.pillersofttechnologies.com/storage/";

  /** dynamic card width based on grid */
  const cardWidth =
    deviceType === "tablet"
      ? "23%"
      : deviceType === "unfolded"
      ? "31%"
      : "48%";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          width: cardWidth,
          borderRadius: 12,
          marginBottom: 15,
        },
      ]}
    >
      <ImageWithLoader
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={{
          width: "100%",
          height:
            deviceType === "tablet"
              ? 180
              : deviceType === "unfolded"
              ? 150
              : 120,
        }}
      />

      <Text
        numberOfLines={2}
        style={[
          styles.title,
          {
            fontSize: ui.font.body,
            paddingHorizontal: ui.spacing.sm,
            paddingTop: ui.spacing.sm,
          },
        ]}
      >
        {item.title}
      </Text>

      <Text
        numberOfLines={2}
        style={[
          styles.desc,
          {
            fontSize: ui.font.small,
            paddingHorizontal: ui.spacing.sm,
            paddingTop: ui.spacing.xl,
          },
        ]}
      >
        {item.description}
      </Text>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: ui.spacing.sm,
            paddingVertical: ui.spacing.sm,
          },
        ]}
      >
        <Text
          style={[
            styles.date,
            { fontSize: ui.font.xs },
          ]}
        >
          {moment(item.created_at).format("DD-MM-YYYY")}
        </Text>

        <View style={styles.rightActions}>
          {item?.file_path && (
            <TouchableOpacity
              onPress={onDownload}
              hitSlop={10}
            >
              <FontAwesome
                name="file-pdf-o"
                size={20}
                color="#e53935"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onPress}>
            <Text
              style={[
                styles.readMore,
                { fontSize: ui.font.small },
              ]}
            >
              {t("articles.read_more")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
      shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14,
  },

  title: {
    fontWeight: "700",
    color: "#000",
  },

  desc: {
    color: "#666",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    color: "#777",
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  readMore: {
    fontWeight: "700",
    color: "#ff9d27",
  },
  shadowBox: {
  flex: 1,

  backgroundColor: "transparent",

  // ✅ Figma Soft Shadow
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14, // Android Shadow
},
});



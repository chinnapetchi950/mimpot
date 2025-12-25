// ArticleCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import ImageWithLoader from "./ImageWithloader";
import { useTranslation } from "react-i18next";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ArticleCard({ item, onPress, onDownload }) {
  const { t } = useTranslation();
  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <ImageWithLoader
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={styles.img}
      />

      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>

      <Text numberOfLines={2} style={styles.desc}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {moment(item.created_at).format("DD-MM-YYYY")}
        </Text>

        <View style={styles.rightActions}>
          {item?.file_path && (
            <TouchableOpacity
              onPress={onDownload}
              style={styles.pdfBtn}
              hitSlop={8}
            >
              <FontAwesome
                name="file-pdf-o"
                size={20}
                color="#e53935"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onPress}>
            <Text style={styles.readMore}>
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
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },

  img: {
    width: "100%",
    height: 120,
  },

  title: {
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },

  desc: {
    paddingHorizontal: 10,
    paddingTop: 4,
    fontSize: 12,
    color: "#666",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },

  date: {
    fontSize: 11,
    color: "#777",
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  pdfBtn: {
    padding: 2,
  },

  readMore: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ff9d27",
  },
});


import React from "react";
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout";

export default function DownloadModal({ visible, onClose }) {
  const { t } = useTranslation();
  const { ui, width, deviceType } = useDevice();

  const BOX_WIDTH =
    deviceType === "tablet"
      ? width * 0.5
      : deviceType === "unfolded"
      ? width * 0.65
      : width * 0.8;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.box,
            {
              width: BOX_WIDTH,
              borderRadius: ui.radius,
              padding: ui.spacing.lg,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons
              name="arrow-back"
              size={ui.font.h2}
              color="#000"
            />
          </TouchableOpacity>

          <ActivityIndicator
            size={deviceType === "tablet" ? "large" : "small"}
            color="#1E90FF"
            style={{ marginTop: ui.spacing.md }}
          />

          <Text
            style={[
              styles.title,
              {
                fontSize: ui.font.h2,
                marginTop: ui.spacing.md,
              },
            ]}
          >
            {t("download.downloading")}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                fontSize: ui.font.body,
                marginTop: ui.spacing.sm,
                maxWidth: BOX_WIDTH * 0.85,
              },
            ]}
          >
            {t("download.download_message")}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  box: {
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 6,
  },

  closeBtn: {
    alignSelf: "flex-start",
  },

  title: {
    fontWeight: "600",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#555",
  },
});

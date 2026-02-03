import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout";

export default function DeleteAccountModal({ visible, onClose, onDelete }) {
  const { t } = useTranslation();
  const { ui, isTablet, isUnfolded } = useDevice();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              padding: ui.padding,
              borderTopLeftRadius: ui.radius,
              borderTopRightRadius: ui.radius,
              width: isTablet || isUnfolded ? "100%" : "100%",
              alignSelf: isTablet || isUnfolded ? "center" : "stretch",
            },
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close-circle-sharp" size={28} />
          </TouchableOpacity>

          <Text style={[styles.title, { fontSize: ui.font.h2 }]}>
            {t("delete_account.confirm_delete")}
          </Text>

          <View style={{ marginTop: ui.spacing.md }}>
            <Text style={[styles.point, { fontSize: ui.font.body }]}>
              • {t("delete_account.deletion_irreversible")}
            </Text>
            <Text style={[styles.point, { fontSize: ui.font.body }]}>
              • {t("delete_account.deletion_warning")}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.keepBtn,
              {
                height: ui.button.height,
                borderRadius: ui.button.radius,
                marginTop: ui.spacing.lg,
              },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.keepText,
                { fontSize: ui.button.fontSize },
              ]}
            >
              {t("delete_account.keep_my_account")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Text
              style={[
                styles.deleteText,
                { fontSize: ui.font.body },
              ]}
            >
              {t("delete_account.delete_account")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingBottom: 45,
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  title: {
    fontWeight: "700",
    marginTop: 40,
  },
  point: {
    marginTop: 10,
    lineHeight: 22,
  },
  keepBtn: {
    backgroundColor: "#2B9DE0",
    alignItems: "center",
    justifyContent: "center",
  },
  keepText: {
    color: "#fff",
    fontWeight: "700",
  },
  deleteText: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});


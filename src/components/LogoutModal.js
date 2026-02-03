import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../styles/theme";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const LogoutModal = ({ visible, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const { ui, deviceType } = useDevice();

  const modalWidth =
    deviceType === "tablet"
      ? "50%"
      : deviceType === "unfolded"
      ? "60%"
      : "82%";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View
          style={[
            styles.box,
            {
              width: modalWidth,
              padding: ui.spacing.lg,
               borderRadius: 12,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontSize: ui.font.h2,
                marginBottom: ui.spacing.lg,
              },
            ]}
          >
            {t("logout.confirm_logout")}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  paddingHorizontal: ui.spacing.lg,
                  paddingVertical: ui.spacing.sm,
                   borderRadius: 12,
                  marginRight: ui.spacing.md,
                },
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.confirmText,
                  { fontSize: ui.font.body },
                ]}
              >
                {t("logout.log_out")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
            >
              <Text
                style={[
                  styles.cancelText,
                  { fontSize: ui.font.body },
                ]}
              >
                {t("logout.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtn: {
    backgroundColor: colors.primary,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelText: {
    color: "#000",
  },
    cancelBtn: { paddingHorizontal: wp("4%") },

});

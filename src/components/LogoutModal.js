import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { colors } from "../styles/theme";

const LogoutModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Are you sure,{"\n"}you want to log out now?</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  box: {
    width: wp("82%"),
    backgroundColor: "#fff",
    borderRadius: 12,
    
    padding: wp("10%"),
    alignItems: "center",
    elevation: 8,
  },
  title: { fontSize: hp("2.6%"), textAlign: "center", fontWeight: "700", marginBottom: hp("5%") },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.6%"),
    borderRadius: 8,
    marginRight: wp("4%"),
  },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: hp("2%") },
  cancelBtn: { paddingHorizontal: wp("4%") },
  cancelText: { color: "#000", fontSize: hp("2%") },
});

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
import strings from "../localization/en";

export default function DownloadModal({ visible, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 10 }} />

          <Text style={styles.title}>{strings.download.downloading}</Text>
          <Text style={styles.subtitle}>
            {strings.download.download_message}
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
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  closeBtn: {
    alignSelf: "flex-start",
  },
  title: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    color: "#555",
    width: 220,
  },
});

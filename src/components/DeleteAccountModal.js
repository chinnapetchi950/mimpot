import React,{useState} from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "react-i18next";

export default function DeleteAccountModal({ visible, onClose, onDelete }) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close-circle-sharp" size={28} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {t('delete_account.confirm_delete')}
          </Text>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.point}>•  {t('delete_account.deletion_irreversible')}</Text>
            <Text style={styles.point}>
              •  {t('delete_account.deletion_warning')}
            </Text>
          </View>

          {/* KEEP ACCOUNT */}
          <TouchableOpacity style={styles.keepBtn} onPress={onClose}>
            <Text style={styles.keepText}>{t('delete_account.keep_my_account')}</Text>
          </TouchableOpacity>

          {/* DELETE ACCOUNT */}
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteText}>{t('delete_account.delete_account')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 45,
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 38,
    height: 38,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 40,
  },
  point: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  keepBtn: {
    marginTop: 25,
    backgroundColor: "#2B9DE0",
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
  },
  keepText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  deleteText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
};

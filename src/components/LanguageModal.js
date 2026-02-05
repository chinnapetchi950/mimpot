import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../localization/i18n";
import { useDevice } from "../utils/useDeviceLayout";

const LANGUAGES = [
  {
    code: "en",
    label: "English",
    flag: require("../assets/images/flag.png"),
  },
  {
    code: "fr",
    label: "French",
    flag: require("../assets/images/france.png"),
  },
];

export default function LanguageModal({ visible, onClose }) {
  const { i18n } = useTranslation();
  const { ui } = useDevice();

  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  // ✅ Change language
  const handleSelect = async (code) => {
    await changeLanguage(code);
    setSelectedLang(code);
    onClose(); // close modal after select
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalBox, { borderRadius: ui.radius * 1.5 }]}>
          <Text style={[styles.title, { fontSize: ui.font.h2 }]}>
            Select Language
          </Text>

          {LANGUAGES.map((lang) => {
            const active = lang.code === selectedLang;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langRow,
                  active && styles.activeRow,
                ]}
                onPress={() => handleSelect(lang.code)}
              >
                <Image source={lang.flag} style={styles.flag} />

                <Text
                  style={[
                    styles.langText,
                    active && styles.activeText,
                  ]}
                >
                  {lang.label}
                </Text>

                {active && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalBox: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
  },

  title: {
    fontWeight: "700",
    marginBottom: 15,
    color: "#000",
    textAlign: "center",
  },

  langRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },

  activeRow: {
    backgroundColor: "#1e88e5",
  },

  flag: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 12,
  },

  langText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  activeText: {
    color: "#fff",
    fontWeight: "700",
  },

  check: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

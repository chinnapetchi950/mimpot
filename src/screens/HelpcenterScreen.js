import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator,StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import { common, colors } from "../styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { authService } from "../api/authService"; // your API service
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout"; // ✅ custom hook

const HelpCenterScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {deviceType} = useDevice(); // ✅ returns { type: 'phone' | 'tablet' | 'fold', isFolded: boolean }

  const handleSend = async () => {
    // 1️⃣ Validation
    if (!subject.trim()) {
      Alert.alert(t('help.validation_error'), t('help.please_enter_subject'));
      return;
    }
    if (!message.trim()) {
      Alert.alert(t('help.validation_error'), t('help.please_enter_message'));
      return;
    }

    setLoading(true);
    try {
      // 2️⃣ API call
      const payload = { subject, message };
      const res = await authService.sendTicket(payload); 
      console.log(res,'res');
      
      if (res?.data?.success) {
        setSubject("");
        setMessage("");
        Alert.alert(
 t('common.success'),
  t('help.ticket_submitted_successfully'),
  [
    {
      text: t('common.ok'),
      onPress: () => navigation.navigate("IssuesScreen"), 
    }
  ]
);
       // Alert.alert("Success", "Your ticket has been submitted successfully.");
        
      } else {
        //Alert.alert(t('common.error'), res?.data?.message || t('help.something_went_wrong'));
      }
    } catch (e) {
      console.log("Ticket API error:", e?.response?.data || e);
      Alert.alert(t('common.error'), e?.message || t('help.failed_to_submit_ticket'));
    } finally {
      setLoading(false);
    }
  };
 const dynamicStyles = {
    inputHeight: deviceType === "tablet" ? hp("18%") : hp("15%"),
    sendBtnBottom: deviceType === "folded" && !device.isFolded ? hp("28%") : hp("42%"),
    fontSizeTitle: deviceType === "tablet" ? hp("2.8%") : hp("2.4%"),
    fontSizeLabel: deviceType === "tablet" ? hp("2.2%") : hp("2%"),
    fontSizeText: deviceType === "tablet" ? hp("2%") : hp("1.8%"),
  };
  return (
    <View style={common.screen}>
      <AppHeader
        title={t("help.help_center")}
        showBack
        onBack={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity style={{marginRight:10}} onPress={() => navigation.navigate("IssuesScreen")}>
            <Ionicons name="mail" size={26} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { fontSize: dynamicStyles.fontSizeTitle }]}>{t("help.have_question")}</Text>
        <Text style={[styles.subtitle, { fontSize: dynamicStyles.fontSizeText }]}>{t("help.write_query")}</Text>

        <Text style={[styles.label, { fontSize: dynamicStyles.fontSizeLabel }]}>{t("help.subject")}</Text>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder={t("help.enter_subject")}
          style={styles.input}
        />

        <Text style={[styles.label, { fontSize: dynamicStyles.fontSizeLabel }]}>{t("help.message")}</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder={t("help.enter_message")}
          style={[styles.input, { height: dynamicStyles.inputHeight, textAlignVertical: "top" }]}
        />

        {/* SEND BUTTON */}
        <TouchableOpacity
          style={[styles.sendBtn, { bottom: dynamicStyles.sendBtnBottom }]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={hp("2.4%")} color="#fff" />}
        </TouchableOpacity>

        {/* CONNECT WITH US */}
        <Text style={[styles.orText, { fontSize: dynamicStyles.fontSizeText }]}>{t("help.or")}</Text>
        <Text style={[styles.connectText, { fontSize: dynamicStyles.fontSizeLabel }]}>{t("help.connect_with_us")}</Text>

        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="mail-open" color={colors.primary} />
          <Text style={styles.contactText}>cs@support.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="call" color={colors.primary} />
          <Text style={styles.contactText}>1800 250 1232</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp("4%"),
    backgroundColor:'#FFF',
    paddingTop: hp("3%"),
    paddingBottom: hp("10%"),
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    color: "#999",
    marginTop: hp("1%"),
  },
  label: {
    marginTop: hp("2%"),
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C9C9C9",
    borderRadius: 12,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("2%"),
    marginTop: hp("1%"),
    backgroundColor: "#fff",
    fontSize: hp("1.8%"),
  },
  sendBtn: {
    position: "absolute",
    right: wp("4%"),
    backgroundColor: colors.primary,
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  orText: {
    textAlign: "center",
    marginTop: hp("8%"),
    color: "#666",
  },
  connectText: {
    textAlign: "center",
    marginTop: hp("1%"),
    fontWeight: "700",
  },
  contactBtn: {
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 40,
    marginHorizontal: wp("12%"),
    marginTop: hp("3%"),
    paddingVertical: hp("1.2%"),
    alignItems: "center",
  },
  contactText: {
    color: colors.primary,
    marginTop: hp("0.6%"),
    fontWeight: "500",
  },
});
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AppHeader from "../components/AppHeader";
import { common, colors } from "../styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { authService } from "../api/authService"; // your API service

const HelpCenterScreen = ({ navigation }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    // 1️⃣ Validation
    if (!subject.trim()) {
      Alert.alert("Validation Error", "Please enter a subject.");
      return;
    }
    if (!message.trim()) {
      Alert.alert("Validation Error", "Please enter a message.");
      return;
    }

    setLoading(true);
    try {
      // 2️⃣ API call
      const payload = { subject, message };
      const res = await authService.sendTicket(payload); 
      console.log(res,'res');
      
      if (res?.data?.status) {
        setSubject("");
        setMessage("");
        Alert.alert(
  "Success",
  "Your ticket has been submitted successfully.",
  [
    {
      text: "OK",
      onPress: () => navigation.navigate("IssuesScreen"), 
    }
  ]
);
       // Alert.alert("Success", "Your ticket has been submitted successfully.");
        
      } else {
        Alert.alert("Error", res?.data?.message || "Something went wrong.");
      }
    } catch (e) {
      console.log("Ticket API error:", e?.response?.data || e);
      Alert.alert("Error", e?.message || "Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={common.screen}>
      <AppHeader
        title="Help Center"
        showBack
        onBack={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={() => {navigation.navigate("IssuesScreen") }}>
            <Ionicons name="mail" size={hp("2.6%")} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: wp("5%"), paddingTop: hp("3%") }}>
        <Text style={{ fontWeight: "700", fontSize: hp("2.4%") }}>Have a Question? We’re Here to Help!</Text>
        <Text style={{ color: "#999", marginTop: hp("1%") }}>Write your Query here</Text>

        <Text style={{ marginTop: hp("2%") }}>Subject</Text>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject"
          style={{ borderWidth: 1, borderColor: "#C9C9C9", borderRadius: 10, padding: wp("3%"), marginTop: hp("1%") }}
        />

        <Text style={{ marginTop: hp("2%") }}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Enter your message"
          style={{ borderWidth: 1, textAlignVertical: "top", borderColor: "#C9C9C9", borderRadius: 10, padding: wp("3%"), height: hp("18%"), marginTop: hp("1%") }}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={{
            position: "absolute",
            right: wp("7%"),
            bottom: hp("34%"),
            backgroundColor: colors.primary,
            width: wp("14%"),
            height: wp("14%"),
            borderRadius: wp("7%"),
            justifyContent: "center",
            alignItems: "center",
            elevation: 6,
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" color="#fff" size={hp("2.4%")} />}
        </TouchableOpacity>

        <Text style={{ textAlign: "center", marginTop: hp("8%"), color: "#666" }}>Or</Text>
        <Text style={{ textAlign: "center", marginTop: hp("1%"), fontWeight: "700" }}>Connect with us on!</Text>

        <TouchableOpacity
          style={{
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderRadius: 40,
            marginHorizontal: wp("12%"),
            marginTop: hp("3%"),
            paddingVertical: hp("1.2%"),
            alignItems: "center",
          }}
        >
          <Ionicons name="mail-open" color={colors.primary} />
          <Text style={{ color: colors.primary, marginTop: hp("0.6%") }}>cs@support.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderRadius: 40,
            marginHorizontal: wp("12%"),
            marginTop: hp("3%"),
            paddingVertical: hp("1.2%"),
            alignItems: "center",
          }}
        >
          <Ionicons name="call" color={colors.primary} />
          <Text style={{ color: colors.primary, marginTop: hp("0.6%") }}>1800 250 1232</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;

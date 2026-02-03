import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import CustomHeader from "../components/CustomHeader";
import ImageWithLoader from "../components/ImageWithloader";
import { authService } from "../api/authService";
import { setUser } from "../store/userSlice";
import { useDevice } from "../utils/useDeviceLayout";

const Field = ({ placeholder, value, onChange, secure, isEmail, ui }) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    editable={!isEmail}
    onChangeText={onChange}
    secureTextEntry={secure}
    style={{
      borderWidth: 1,
      borderColor: "#00000036",
      borderRadius: ui.radius,
      backgroundColor: isEmail ? "#EEEEEE" : "#FFFFFF",
      padding: ui.padding,
      marginTop: ui.spacing.sm,
    }}
  />
);

export default function EditProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ui } = useDevice(); // <-- responsive sizes

  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [idNum, setIdNum] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  // Load Redux user data into state
  useEffect(() => {
    if (user) {
      setEmail(user?.user?.email || user.user?.user?.email || "");
      setFirst(user?.user?.firstname || user?.user?.user?.firstname || "");
      setLast(user?.user?.lastname || user.user?.user?.lastname || "");
      setIdNum(user?.user?.id_number || user.user?.user?.id_number || "");
      setLocation(user?.user?.location || user.user?.user?.location || "");

      if (user?.user?.profile_image || user.user?.user?.profile_image) {
        setImage({
          uri: user?.user?.profile_image || user.user?.user?.profile_image,
        });
      }
    }
  }, [user]);

  // ---------- IMAGE PICKER ----------
  const openImagePicker = () => {
    Alert.alert(t("edit_profile.upload_image"), t("edit_profile.choose_option"), [
      { text: t("edit_profile.camera"), onPress: openCamera },
      { text: t("edit_profile.gallery"), onPress: openGallery },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && !res.errorCode) setImage(res.assets[0]);
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && !res.errorCode) setImage(res.assets[0]);
    });
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    let formData = new FormData();
    formData.append("firstname", first);
    formData.append("lastname", last);
    formData.append("id_number", idNum);
    formData.append("location", location);

    if (image && !image.uri.includes("http")) {
      formData.append("profile_image", {
        uri: image.uri,
        name: image.fileName || "profile.jpg",
        type: image.type || "image/jpeg",
      });
    }

    try {
      const res = await authService.update_profile(formData);
      dispatch(setUser(res?.data?.data));

      if (res.status) {
        Alert.alert(t("common.success"), res?.data?.message);
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert(t("common.error"), t("edit_profile.something_went_wrong"));
      console.log("UPDATE ERROR:", err?.response || err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        title={t("edit_profile.my_profile")}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={ui.icon} color="#000" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: ui.padding,
          paddingTop: ui.spacing.lg,
          paddingBottom: ui.spacing.xl,
        }}
      >
        {/* -------- PROFILE IMAGE -------- */}
        <View style={{ alignItems: "center", marginBottom: ui.spacing.lg }}>
          <ImageWithLoader
            source={
              image ? { uri: image?.uri } : require("../assets/images/placeholder.png")
            }
            style={{
              width: ui.image.avatar,
              height: ui.image.avatar,
              borderRadius: ui.radius,
            }}
          />

          <TouchableOpacity
            onPress={openImagePicker}
            style={{
              position: "absolute",
              right: ui.image.avatar * 0.25,
              bottom: ui.spacing.sm,
              backgroundColor: "#fff",
              padding: ui.padding * 0.5,
              borderRadius: ui.radius,
              elevation: 4,
            }}
          >
            <Ionicons name="camera" size={ui.icon} />
          </TouchableOpacity>
        </View>

        {/* -------- FIELDS -------- */}
        <Field placeholder={t("edit_profile.email")} value={email} onChange={setEmail} isEmail ui={ui} />
        <Field placeholder={t("edit_profile.first_name")} value={first} onChange={setFirst} ui={ui} />
        <Field placeholder={t("edit_profile.last_name")} value={last} onChange={setLast} ui={ui} />
        <Field placeholder={t("edit_profile.id_number")} value={idNum} onChange={setIdNum} ui={ui} />
        <Field placeholder={t("edit_profile.location")} value={location} onChange={setLocation} ui={ui} />

        {/* -------- SAVE BUTTON -------- */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: ui.spacing.md,
            borderRadius: ui.radius * 2,
            marginTop: ui.spacing.lg,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: ui.font.h2, fontWeight: "700" }}>
            {t("edit_profile.update_now")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

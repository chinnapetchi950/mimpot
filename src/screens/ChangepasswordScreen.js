import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import CustomHeader from "../components/CustomHeader";
import { common } from "../styles/theme";
import { authService } from "../api/authService";
import { useTranslation } from "react-i18next";
import { useDevice } from "../utils/useDeviceLayout";
const ChangePasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [reNew, setReNew] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);

  const [loading, setLoading] = useState(false);

  // ---------------------------
  //  Validate Fields
  // ---------------------------
  const validate = () => {
    if (!current.trim()) {
      Alert.alert(t('change_password.validation_error'), t('change_password.enter_current_password'));
      return false;
    }

    if (!newPwd.trim()) {
      Alert.alert(t('change_password.validation_error'), t('change_password.enter_new_password'));
      return false;
    }

    if (newPwd.length < 8) {
      Alert.alert(t('change_password.validation_error'), t('change_password.password_min_8_chars'));
      return false;
    }

    if (!reNew.trim()) {
      Alert.alert(t('change_password.validation_error'), t('change_password.confirm_new_password'));
      return false;
    }

    if (newPwd !== reNew) {
      Alert.alert(t('change_password.validation_error'), t('change_password.passwords_do_not_match'));
      return false;
    }

    return true;
  };

  // ---------------------------
  //  Change Password API
  // ---------------------------
  const handleChangePassword = async () => {
  if (!validate()) return;

  try {
    setLoading(true);

    let formData = new FormData();
    formData.append("current_password", current);
    formData.append("new_password", newPwd);
    formData.append("new_password_confirmation", reNew);

    const response = await authService.changepassword(formData)

    setLoading(false);

    Alert.alert(
      t('common.success'),
      response.data.message || t('change_password.password_changed_successfully'),
      [
        {
          text: t('common.ok'),
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );

  } catch (error) {
    setLoading(false);

    const msg =
      error?.response?.data?.message ||
      t('change_password.failed_to_change_password');

    Alert.alert(t('common.error'), msg);
  }
};


  return (
    <View style={common.screen}>
      <CustomHeader
        title={t('change_password.change_password')}
                showLanguage={false}

        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: wp("5%"), paddingTop: hp("3%") }}>

        {/* Current Password */}
        <Text style={{ fontSize: 16 }}>{t('change_password.current_password')}</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder={t('change_password.enter_password')}
            secureTextEntry={!showCurrent}
            value={current}
            onChangeText={setCurrent}
            style={{
              borderWidth: 1,
              borderColor: "#C9C9C9",
              borderRadius: 10,
              padding: wp("4%"),
              marginTop: hp("1%"),
            }}
          />
          <TouchableOpacity
            onPress={() => setShowCurrent(!showCurrent)}
            style={{ position: "absolute", right: wp("4%"), top: hp("3%") }}
          >
            <Ionicons size={20} name={showCurrent ? "eye" : "eye-off"} />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={{ marginTop: hp("2%"), fontSize: 16 }}>{t('change_password.new_password')}</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder={t('change_password.enter_password')}
            secureTextEntry={!showNew}
            value={newPwd}
            onChangeText={setNewPwd}
            style={{
              borderWidth: 1,
              borderColor: "#C9C9C9",
              borderRadius: 10,
              padding: wp("4%"),
              marginTop: hp("1%"),
            }}
          />
          <TouchableOpacity
            onPress={() => setShowNew(!showNew)}
            style={{ position: "absolute", right: wp("4%"), top: hp("3%") }}
          >
            <Ionicons size={20} name={showNew ? "eye" : "eye-off"} />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={{ marginTop: hp("2%"), fontSize: 16 }}>{t('change_password.re_enter_password')}</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder={t('change_password.enter_password')}
            secureTextEntry={!showRe}
            value={reNew}
            onChangeText={setReNew}
            style={{
              borderWidth: 1,
              borderColor: "#C9C9C9",
              borderRadius: 10,
              padding: wp("4%"),
              marginTop: hp("1%"),
            }}
          />
          <TouchableOpacity
            onPress={() => setShowRe(!showRe)}
            style={{ position: "absolute", right: wp("4%"), top: hp("3%") }}
          >
            <Ionicons size={20} name={showRe ? "eye" : "eye-off"} />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={loading}
          style={{
            backgroundColor: "#42B5E8",
            paddingVertical: hp("2%"),
            borderRadius: 30,
            marginTop: hp("4%"),
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {t('change_password.change_password')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;



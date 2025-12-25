import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CustomHeader from "../components/CustomHeader";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { authService } from "../api/authService";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import ImageWithLoader from "../components/ImageWithloader";
import { useTranslation } from "react-i18next";

const Field = ({ placeholder, value, onChange, secure, isEmail }) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    editable={!isEmail}
    onChangeText={onChange}
    secureTextEntry={secure}
    style={{
      borderWidth: 1,
      borderColor: "#00000036",
      borderRadius: 12,
      backgroundColor: isEmail ? '#EEEEEE' : '#FFFFFF',
      padding: wp("4%"),
      marginTop: hp("2%"),
    }}
  />
);

const EditProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();

  // ---------- LOCAL STATES ----------
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [idNum, setIdNum] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  // ✅ get user data from Redux
  const dispatch=useDispatch()
const user = useSelector(state => state.user);
console.log("user===============>",user);

  // ---------- LOAD REDUX VALUES ----------
  useEffect(() => {
    if (user) {
      setEmail(user?.user?.email||user.user?.user?.email || "");
      setFirst(user?.user?.firstname||user?.user?.user?.firstname || "");
      setLast(user?.user?.lastname||user.user?.user?.lastname || "");
      setIdNum(user?.user?.id_number||user.user?.user?.id_number || "");
      setLocation(user?.user?.location||user.user?.user?.location || "");

      if (user?.user?.profile_image||user.user?.user?.profile_image) {
        setImage({ uri: user?.user?.profile_image||user.user?.user?.profile_image });
      }
    }
  }, [user]);

  // ---------- IMAGE PICKER ----------
  const openImagePicker = () => {
    Alert.alert(t('edit_profile.upload_image'), t('edit_profile.choose_option'), [
      { text: t('edit_profile.camera'), onPress: () => openCamera() },
      { text: t('edit_profile.gallery'), onPress: () => openGallery() },
      { text: t('common.cancel'), style: "cancel" },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && !res.errorCode) {
        setImage(res.assets[0]);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && !res.errorCode) {
        setImage(res.assets[0]);
      }
    });
  };

  // ---------- VALIDATION ----------
  const validate = () => {
    if (!first || !last || !idNum || !location) {
      Alert.alert(t('common.error'), t('edit_profile.all_fields_required'));
      return false;
    }
    return true;
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    // if (!validate()) return;

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
     console.log("res======?",res?.data);
     dispatch(setUser(res?.data?.data))
     
     
          if(res.status){
            Alert.alert(t('common.success'), res?.data?.message);
            navigation.goBack()
          }

      //const json = await res.json();
      // Alert.alert("Success", "Profile Updated!");
    } catch (err) {
       console.log("res======?",err?.response);
      Alert.alert(t('common.error'), t('edit_profile.something_went_wrong'));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        title={t('edit_profile.my_profile')}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("5%"),
          paddingTop: hp("3%"),
          paddingBottom: hp("8%"),
        }}
      >
        {/* -------- PROFILE IMAGE -------- */}
        <View style={{ alignItems: "center" }}>
          <ImageWithLoader
            source={
              image
                ? { uri: image?.uri }
                : require("../assets/images/placeholder.png")
            }
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
          />

          <TouchableOpacity
            onPress={openImagePicker}
            style={{
              position: "absolute",
              right: wp("28%"),
              bottom: hp("1%"),
              backgroundColor: "#fff",
              padding: 8,
              borderRadius: 20,
              elevation: 4,
            }}
          >
            <Ionicons name="camera" size={hp("2.4%")} />
          </TouchableOpacity>
        </View>

        {/* -------- FIELDS -------- */}
        <Field placeholder={t('edit_profile.email')} value={email} onChange={setEmail} isEmail={true} />
        {/* <Field placeholder="Password" value={pwd} onChange={setPwd} secure /> */}
        <Field placeholder={t('edit_profile.first_name')} value={first} onChange={setFirst} />
        <Field placeholder={t('edit_profile.last_name')} value={last} onChange={setLast} />
        <Field placeholder={t('edit_profile.id_number')} value={idNum} onChange={setIdNum} />
        <Field placeholder={t('edit_profile.location')} value={location} onChange={setLocation} />

        {/* -------- SAVE BUTTON -------- */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#42B5E8",
            paddingVertical: hp("2%"),
            borderRadius: 30,
            marginTop: hp("3%"),
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: "#fff", fontSize: hp("2.2%"), fontWeight: "700" }}
          >
            {t('edit_profile.update_now')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

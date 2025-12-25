import React, { useState, useEffect,useCallback } from "react";
import { View, Text, Image, ScrollView, Alert,ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { colors, common } from "../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import { useDispatch } from "react-redux";
import { authService } from "../api/authService";
import { setToken, setUser } from "../store/userSlice";
import Storage from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";


const ProfileScreen = () => {
  const { t } = useTranslation();
  const [userdata, setuserData] = useState(null);
  const [stats, setStats] = useState(null);
const [imageLoading, setImageLoading] = useState(true);

  const dispatch = useDispatch();



  // 🔥 Load Profile
  const loadProfile = async () => {

    try {
      const res = await authService.getprofile();
      console.log("PROFILE RESPONSE:", res.data);

      const token = await Storage.getItem("token");
      dispatch(setToken(token));
      dispatch(setUser(res.data?.data));

      setuserData(res.data?.data);
      Storage.setItem("userData", res.data?.data);

    } catch (e) {
      console.log("PROFILE ERROR:", e?.response?.data || e);
      Alert.alert(t('common.error'), t('profile.unable_to_load_profile'));
    }
  };

  // 🔥 Load Statistics
  const loadStatistics = async () => {
    setImageLoading(true)
    try {
      const res = await authService.getUserStatistics();
      console.log("STATISTICS RESPONSE:", res.data);

      setStats(res.data?.data);
    setImageLoading(false)

    } catch (e) {
          setImageLoading(false)

      console.log("STATISTICS ERROR:", e?.response?.data || e);
      Alert.alert(t('common.error'), t('profile.unable_to_load_statistics'));
    }
  };
useFocusEffect(
    useCallback(() => {
      setImageLoading(true);    // Show loader again
      loadProfile();
      loadStatistics();

      return () => {};
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader title={t('profile.profile')} />

      <ScrollView style={{ flex: 1, padding: wp("5%") }}>

        {/* Profile Image */}
        <View style={{ alignItems: "center", marginTop: hp("2%") }}>
          {imageLoading && (
              <View
                style={{
                  position: "absolute",
                  width: 60,
                  height: 60,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <ActivityIndicator size="small" color="#000" />
              </View>
            )}
          <Image
            source={
              userdata?.profile_image
                ? { uri: userdata.profile_image }
                : require("../assets/images/placeholder.png")
            }
            style={{ width: 100, height: 100, borderRadius: 55 }}
            onLoadEnd={() => setImageLoading(false)}
          />

          <Text style={{ marginTop: 10, fontSize: wp("5%"), fontWeight: "700" }}>
            {[userdata?.firstname, userdata?.lastname].filter(Boolean).join(" ")}
          </Text>

          <Text style={{ color: colors.lightText, fontSize: wp("3.5%") }}>
            {userdata?.email}
          </Text>
        </View>

        {/* Stats Cards */}
        {stats && (
          <>
            {[
              {
                title: t('profile.bookmarked'),
                subtext: ` ${stats.total_bookmarks} ${t('profile.documents')}`,
                value: stats.total_bookmarks
                //value:stats.total_bookmarks
              },
              {
                title: t('profile.document_interactions'),
                subtext: `${stats.total_viewed_this_month} ${t('profile.documents_viewed_this_month')}`,
                value: stats.total_viewed_this_month,
              },
              {
                title: t('profile.video_interactions'),
                subtext: `${stats.total_viewed_videos_this_month} ${t('profile.videos_watched')}`,
                value: stats.total_viewed_videos_this_month,
              },
              {
                title: t('profile.download_counts'),
                subtext: `${stats.total_downloaded_files} ${t('profile.files_downloaded')}`,
                value: stats.total_downloaded_files,
              },
            ].map((item) => (
             <View
  key={item.title}
  style={{
    marginTop: hp("2.5%"),
    backgroundColor:colors.card,
    borderRadius: 30,
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp("4%"),
    elevation: 3,
  }}
>
  {/* LEFT TEXT */}
  <View style={{ width:wp('70%'), paddingVertical: hp("2%"), paddingRight: wp("1%") }}>
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={{
        fontSize: wp("4.4%"),
        fontWeight: "700",
        color: "#000",
      }}
    >
      {item.title}
    </Text>

    <Text
      numberOfLines={1}
      style={{
        fontSize: wp("3.2%"),
        color: colors.lightText,
        marginTop: 6,
      }}
    >
      {item.subtext}
    </Text>
  </View>

  {/* RIGHT CIRCLE */}
  <View
    style={{
      backgroundColor: colors.primary,
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      //marginLeft:wp('%')
      marginRight: wp("0%"),
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: wp("4.8%"),
        fontWeight: "700",
      }}
    >
      {item.value}
    </Text>
  </View>
</View>

            ))}
          </>
        )}

        <View style={{ marginTop: hp("6%") }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

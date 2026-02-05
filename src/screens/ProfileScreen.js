import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import Icon from "react-native-vector-icons/Feather";

import CustomHeader from "../components/CustomHeader";
import ImageWithLoader from "../components/ImageWithloader";
import { colors, common } from "../styles/theme";
import { authService } from "../api/authService";
import Storage from "../utils/storage";
import { setToken, setUser } from "../store/userSlice";

import { useDevice } from "../utils/useDeviceLayout";
import HomeHeader from "../components/Homeheader";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { ui } = useDevice(); // <-- responsive sizes

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  const [userdata, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Load Profile
  const loadProfile = async () => {
    try {
      const res = await authService.getprofile();
      const token = await Storage.getItem("token");

      dispatch(setToken(token));
      dispatch(setUser(res.data?.data));

      setUserData(res.data?.data);
      Storage.setItem("userData", res.data?.data);
    } catch (e) {
      Alert.alert(t("common.error"), t("profile.unable_to_load_profile"));
      console.log("PROFILE ERROR:", e?.response?.data || e);
    }
  };

  // Load Statistics
  const loadStatistics = async () => {
    setImageLoading(true);
    try {
      const res = await authService.getUserStatistics();
      setStats(res.data?.data);
    } catch (e) {
      Alert.alert(t("common.error"), t("profile.unable_to_load_statistics"));
      console.log("STATISTICS ERROR:", e?.response?.data || e);
    } finally {
      setImageLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setImageLoading(true);
      loadProfile();
      loadStatistics();
    }, [])
  );

  const statsData = stats
    ? [
        {
          title: t("profile.bookmarked"),
          subtext: `${stats.total_bookmarks} ${t("profile.documents")}`,
          value: stats.total_bookmarks,
        },
        {
          title: t("profile.document_interactions"),
          subtext: `${stats.total_viewed_this_month} ${t(
            "profile.documents_viewed_this_month"
          )}`,
          value: stats.total_viewed_this_month,
        },
        {
          title: t("profile.video_interactions"),
          subtext: `${stats.total_viewed_videos_this_month} ${t(
            "profile.videos_watched"
          )}`,
          value: stats.total_viewed_videos_this_month,
        },
        {
          title: t("profile.download_counts"),
          subtext: `${stats.total_downloaded_files} ${t(
            "profile.files_downloaded"
          )}`,
          value: stats.total_downloaded_files,
        },
      ]
    : [];

  return (
    <View edges={['top']}
style={[common.screen, { flex: 1, backgroundColor: colors.background }]}>
      {/* <CustomHeader showlogo={true} title={t("profile.profile")} /> */}
 <HomeHeader title={t('profile.profile')}/>
      <ScrollView style={{ flex: 1, padding: ui.padding }}>
        {/* Profile Image */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          {imageLoading && (
            <View
              style={{
                position: "absolute",
                width: ui.image.avatar,
                height: ui.image.avatar,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: ui.image.avatar/2,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}

          <ImageWithLoader
            source={
              userdata?.profile_image
                ? { uri: userdata.profile_image }
                : require("../assets/images/placeholder.png")
            }
            style={{
              width: ui.image.avatar,
              height: ui.image.avatar,
              borderRadius: ui.image.avatar/2,
            }}
            resizeMode="cover"
            onLoadEnd={() => setImageLoading(false)}
          />

          <Text
            style={{
              marginTop: ui.spacing.md,
              fontSize: ui.font.h2,
              fontWeight: "700",
            }}
          >
            {[userdata?.firstname, userdata?.lastname].filter(Boolean).join(" ")}
          </Text>

          <Text style={{ color: colors.lightText, fontSize: ui.font.body,marginBottom:10 }}>
            {userdata?.email}
          </Text>
        </View>

        {/* Stats Cards */}
        {statsData.map((item) => (
          <View
            key={item.title}
            style={[
              styles.statCard,
              {
                borderRadius: 30,
                paddingVertical: ui.spacing.md,
                paddingHorizontal: ui.spacing.md,
              },
            ]}
          >
            {/* Left Text */}
            <View style={{ flex: 1, paddingRight: ui.spacing.sm }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ fontSize: ui.font.h2, fontWeight: "700", color: "#000" }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: ui.font.body, color: colors.lightText, marginTop: 4 }}>
                {item.subtext}
              </Text>
            </View>

            {/* Right Circle */}
            <View
              style={{
                backgroundColor: colors.primary,
                width: ui.image.avatar * 0.6,
                height: ui.image.avatar * 0.6,
                borderRadius: (ui.image.avatar * 0.6) / 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: ui.font.h2, fontWeight: "700" }}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: ui.spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14,  },
});

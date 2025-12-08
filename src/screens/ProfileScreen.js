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


const ProfileScreen = () => {
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
      Alert.alert("Error", "Unable to load profile. Please try again.");
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
      Alert.alert("Error", "Unable to load statistics.");
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
      <CustomHeader title="Profile" />

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
                title: "Bookmarked",
                subtext: ` ${stats.total_bookmarks} documents`,
                value: stats.total_bookmarks
                //value:stats.total_bookmarks
              },
              {
                title: "Document interactions",
                subtext: `${stats.total_viewed_this_month} documents viewed this month`,
                value: stats.total_viewed_this_month,
              },
              {
                title: "Video interactions",
                subtext: `${stats.total_viewed_videos_this_month} videos watched`,
                value: stats.total_viewed_videos_this_month,
              },
              {
                title: "Download counts",
                subtext: `${stats.total_downloaded_files} files downloaded`,
                value: stats.total_downloaded_files,
              },
            ].map((item) => (
              <View
                key={item.title}
                style={{
                  marginTop: hp("3%"),
                  backgroundColor: colors.card,
                  paddingLeft: wp("3%"),
                  borderRadius: 50,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: "column", padding: hp("1.5%") }}>
                  <Text style={{ fontSize: wp("5%") }}>{item.title}</Text>
                  <Text style={{ fontSize: wp("3%") }}>{item.subtext}</Text>
                </View>

                <View
                  style={{
                    backgroundColor: colors.primary,
                    width: 100,
                    height: 70,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: wp("4.6%"), fontWeight: "700" }}>
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

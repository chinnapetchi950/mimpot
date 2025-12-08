import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Share
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import { authService } from "../api/authService";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DetailsScreen({ navigation, route }) {
  const { categoryId } = route.params || {};

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0); // in seconds
  const [currentTime, setCurrentTime] = useState(0); // in seconds

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const BASE_URL = "http://testlink2.pillersofttechnologies.com";
  const videoRef = useRef(null);

  useEffect(() => {
    fetchDocument();
    // cleanup if needed
    return () => {};
  }, []);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const res = await authService.getDocumentById(categoryId);
      console.log("res",res?.data);
      
      // expected res.data.data to contain file_url, image, category, etc.
      setVideo(res.data?.data || null);
    } catch (err) {
      console.log("Fetch Error:", err);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec = 0) => {
    // sec is number of seconds
    const s = Math.floor(sec % 60);
    const m = Math.floor(sec / 60);
    const mm = m < 10 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${mm}:${ss}`;
  };

  const onLoad = (meta) => {
    // meta.duration is in seconds
    setDuration(meta.duration || 0);
  };

  const onProgress = (progress) => {
    // progress.currentTime in seconds
    if (!isSeeking) {
      setCurrentTime(progress.currentTime);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekComplete = (value) => {
    const to = Number(value);
    setIsSeeking(false);
    setCurrentTime(to);
    if (videoRef.current && typeof videoRef.current.seek === "function") {
      videoRef.current.seek(to);
    }
  };

  const skipForward = (seconds = 10) => {
    const to = Math.min((isSeeking ? seekPosition : currentTime) + seconds, duration);
    if (videoRef.current && typeof videoRef.current.seek === "function") {
      videoRef.current.seek(to);
    }
    setCurrentTime(to);
    setSeekPosition(to);
  };

  const skipBackward = (seconds = 10) => {
    const to = Math.max((isSeeking ? seekPosition : currentTime) - seconds, 0);
    if (videoRef.current && typeof videoRef.current.seek === "function") {
      videoRef.current.seek(to);
    }
    setCurrentTime(to);
    setSeekPosition(to);
  };

const handleShare = async () => {
  try {
    const result = await Share.share({
      message: "Hi  this is M.Impot!",   // Your text
      url: "url",           // Optional URL
      title: "M.Impot",                   // Optional title
    });
  } catch (error) {
    console.log(error);
  }
};
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No Data Available</Text>
      </View>
    );
  }

  // file_url should be returned by API as the video path; adjust if different (eg. file_path)
  const videoUri = `${BASE_URL}${video?.file_url}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        title="Details View"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
        rightComponent={() => null}
      />

      <View style={styles.container}>
        {/* Top Title + Rating */}
        <Text style={styles.title}>{video?.title}</Text>

        <View style={styles.topRow}>
          <Text style={styles.author}>By M.Jmpot</Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4].map((i) => (
              <Ionicons key={i} name="star" size={18} color="#f4c430" />
            ))}
            <Ionicons name="star-outline" size={18} color="#f4c430" />
          </View>
        </View>

        <Text style={styles.description}>
          {video?.description}
        </Text>

        {/* VIDEO + OVERLAYS */}
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode="cover"
            paused={paused}
            onLoad={onLoad}
            onProgress={onProgress}
            ignoreSilentSwitch={"obey"}
          />

          {/* shuffle icon - inside video bottom-left above the overlay */}
          

          {/* Center controls: back 10s, play/pause, forward 10s */}
          <View style={styles.centerControls}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => skipBackward(10)}
              activeOpacity={0.8}
            >
              <Ionicons name="play-back" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bigPlayBtn}
              onPress={() => setPaused((p) => !p)}
              activeOpacity={0.9}
            >
              <Ionicons
                name={paused ? "play" : "pause"}
                size={36}
                color="#fff"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => skipForward(10)}
              activeOpacity={0.8}
            >
              <Ionicons name="play-forward" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* bottom-left overlay: title, by, slider and times */}
          <View style={styles.overlayBottom}>
            <View style={styles.overlayTextWrap}>
              <Text style={styles.overlayTitle}>{video?.title}</Text>
              <Text style={styles.overlayBy}>By M.Jmpot</Text>
            </View>

            {/* Slider inside video */}
            <View style={styles.sliderWrap}>
              <Slider
                style={styles.slider}
                value={isSeeking ? seekPosition : currentTime}
                minimumValue={0}
                maximumValue={duration}
                step={0.1}
                onValueChange={(val) => {
                  setSeekPosition(val);
                }}
                onSlidingStart={() => {
                  setIsSeeking(true);
                }}
                onSlidingComplete={(val) => {
                  handleSeekComplete(val);
                }}
                minimumTrackTintColor="#39A8F6"
                maximumTrackTintColor="#ffffffaa"
                thumbTintColor="#39A8F6"
              />

              <View style={styles.timeRowInside}>
                <Text style={styles.timeText}>{formatTime(isSeeking ? seekPosition : currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right-side top icons (download + bookmark) - placed visually next to video */}
   <View style={styles.topRow}>
  {/* Left Shuffle Icon */}
  <TouchableOpacity style={styles.shuffleIcon}>
    <Ionicons name="shuffle" size={20} color="#000" />
  </TouchableOpacity>

  {/* Right Icons */}
  <View style={styles.rightTopIcons}>
    <TouchableOpacity style={styles.iconBtn}>
      <Ionicons name="download-outline" size={24} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconBtn}>
      <Ionicons name="bookmark-outline" size={24} color="#000" />
    </TouchableOpacity>
  </View>
</View>


        {/* Bottom action buttons */}
        <View style={styles.actionsRow}>
          <ActionBtn label="Comment" icon="chatbubble-outline" />
          <ActionBtn label="Share" icon="share-outline" onPress={handleShare} />
          <ActionBtn label="Rate Us" icon="star-outline" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const ActionBtn = ({ label, icon,onPress }) => (
  <TouchableOpacity onPress={onPress}style={styles.actionBtn} activeOpacity={0.85}>
    <Ionicons name={icon} size={18} color="#fff" />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataText: { fontSize: 18, color: "#777" },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  author: {
    color: "#666",
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    color: "#444",
    marginTop: 12,
    lineHeight: 20,
    fontSize: 14,
  },

  videoWrapper: {
    marginTop: 14,
    width: "100%",
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  video: { width: "100%", height: "100%" },

  // shuffleIcon: {
  //   position: "absolute",
  //   left: 12,
  //   bottom: 140,
  //   zIndex: 6,
  // },

  centerControls: {
    position: "absolute",
    top: "37%",
    left: 0,
    right: 0,
    zIndex: 6,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  skipBtn: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 10,
    borderRadius: 32,
  },
  bigPlayBtn: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 14,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  overlayBottom: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    zIndex: 7,
  },
  overlayTextWrap: {
    marginBottom: 8,
  },
  overlayTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  overlayBy: {
    color: "#f1f1f1",
    fontSize: 13,
    marginTop: 2,
  },

  sliderWrap: {
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 20,
  },
  timeRowInside: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
  },

  rightTopIcons: {
    marginTop: 8,
    // align them on the right row: we place them visually right under video area
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginRight: 6,
  },
  iconBtn: {
    marginLeft: 14,
  },

  actionsRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  actionBtn: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    width: (SCREEN_WIDTH - 60) / 3,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionLabel: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  shuffleIcon: {
   // backgroundColor: "#000",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  rightTopIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  iconBtn: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

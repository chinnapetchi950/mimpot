import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Share,
  StatusBar,
  Alert, Platform,
  Modal,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import { authService } from "../api/authService";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import ReactNativeBlobUtil from 'react-native-blob-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
import CommentScreen from "./CommentScreen";
import { useFocusEffect } from "@react-navigation/native";
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";


export default function DetailsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { categoryId } = route.params || {};
const currentLang = i18n.language || 'en';
const viewStartTimeRef = useRef(null);
const durationSentRef = useRef(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0); // in seconds
  const [currentTime, setCurrentTime] = useState(0); // in seconds

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
const [isBookmarked, setIsBookmarked] = useState(false);
const [bookmarkLoading, setBookmarkLoading] = useState(false);
const [downloadLoading, setIsdownloadLoading] = useState(false);
const [ratingModalVisible, setRatingModalVisible] = useState(false);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');
const [ratingLoading, setRatingLoading] = useState(false);
const [commentVisible, setCommentVisible] = useState(true);
const [showVideo, setShowVideo] = useState(true);
const [showSearchBar, setShowSearchBar] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [searchResult, setSearchResult] = useState(null);

// const videoRef = useRef(null);
const PREVIEW_DURATION = 10; // seconds

// const [paused, setPaused] = useState(false);
const [isSubscribe, setIsSubscribe] = useState(false);
  const BASE_URL = "http://testlink2.pillersofttechnologies.com";
  const videoRef = useRef(null);
const [lockPlayback, setLockPlayback] = useState(false);
const previewEndedRef = useRef(false);
const alertShownRef = useRef(false);

  useEffect(() => {
    fetchDocument();
    // cleanup if needed
    return () => {};
  }, []);
useEffect(() => {
  const getSubscriptionStatus = async () => {
    const value = await AsyncStorage.getItem("isSubcribe");
    setIsSubscribe(JSON.parse(value));
  };

  getSubscriptionStatus();
}, []);
useEffect(() => {
  if (isSubscribe) {
    previewEndedRef.current = false;
    setShowVideo(true)
    setPaused(false);
  }
}, [isSubscribe]);
useFocusEffect(
  React.useCallback(() => {
    refreshData(); // API / AsyncStorage check
  }, [])
);
useFocusEffect(
  React.useCallback(() => {
    // ⏱ Start timer
    viewStartTimeRef.current = Date.now();
    durationSentRef.current = false;

    return () => {
      // ⛔ Screen losing focus
      sendViewDuration();
    };
  }, [])
);
const handleSearch = () => {
  if (!searchQuery.trim()) {
    setSearchResult(null);
    return;
  }

  const query = searchQuery.toLowerCase();

  // Combine all searchable text
  const allText = `
    ${videoTitle}
    ${videoDescription}
    ${categoryName}
    ${subCategoryName}
  `.toLowerCase();

  if (allText.includes(query)) {
    setSearchResult(true);
  } else {
    setSearchResult(false);
  }
};

const sendViewDuration = async () => {
  try {
    if (durationSentRef.current) return;
    if (!viewStartTimeRef.current) return;

    const endTime = Date.now();
    const durationSeconds = Math.floor(
      (endTime - viewStartTimeRef.current) / 1000
    );

    // Avoid sending 0 seconds
    if (durationSeconds <= 0) return;

    durationSentRef.current = true;

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("duration", durationSeconds);

    const res =await authService.updateDocumentViewDuration(categoryId, formData);

    console.log("✅ View duration sent:", durationSeconds,res, "seconds");
  } catch (error) {
    console.log("❌ Duration API error:", error?.response || error);
  }
};
useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      sendViewDuration();
      return false;
    }
  );

  return () => backHandler.remove();
}, []);
const refreshData = async () => {
  const value = await AsyncStorage.getItem("isSubcribe");
  setIsSubscribe(JSON.parse(value));
};
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

  // const onLoad = (meta) => {
  //   // meta.duration is in seconds
  //   setDuration(meta.duration || 0);
  // };
const onLoad = () => {
  // 🔒 Hard stop on first load
  setPaused(true);

  // Reset to start
  requestAnimationFrame(() => {
    videoRef.current?.seek(0);
  });
};
  // const onProgress = (progress) => {
  //   // progress.currentTime in seconds
  //   if (!isSeeking) {
  //     setCurrentTime(progress.currentTime);
  //   }
  // };

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

const handleShare = async (data) => {
  try {
    const message = buildShareMessage(data);

    await Share.share({
      title: 'M.Impot',
      message: message,
    });
  } catch (error) {
    console.log('Share Error:', error);
  }
};
const buildShareMessage = (data) => {
  return `
📄 *${getLocalizedValue(data, 'title', currentLang)}*

🗂 ${t('details.category')}: ${
    getLocalizedValue(data?.category, 'name', currentLang) || '-'
}
📂 ${t('details.sub_category')}: ${
    getLocalizedValue(data?.sub_category, 'name', currentLang) || '-'
}

⭐ ${t('details.rating')}: ${data?.average_rating || 0} / 5
📝 ${t('details.total_ratings')}: ${data?.total_ratings || 0}
👁 ${t('details.views')}: ${data?.total_views || 0}

📅 ${t('details.created_on')}: ${data?.created_at_formatted || '-'}

📝 ${t('details.description')}:
${getLocalizedValue(data, 'description', currentLang) || t('details.no_description_available')}

📲 ${t('details.share_footer')}
`;
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
        <Text style={styles.noDataText}>{t('videos.no_data_available')}</Text>
      </View>
    );
  }
  const onClickDownload = async (item) => {
    console.log(item?.is_paid,isSubscribe);
    
  // if (item?.is_paid === true&&isSubscribe===true) {
    
    try {
    setIsdownloadLoading(true);

    const res = await authService.downloadDocument(item.id);

    if (res?.status) {
      Alert.alert(t('common.success'), t('details.file_downloaded_successfully'));
    }
  } catch (e) {
    console.log(e?.response);
  } finally {
    setIsdownloadLoading(false);
  }
//   }else{

  
// Alert.alert(
//   t('details.payment_required'),
//   t('details.payment_message'),
//   [
//     {
//       text: t('common.cancel'),
//       style: "cancel",
//     },
//     {
//       text: t('common.continue'),
//       onPress: () => {
//          navigation.navigate("SubscriptionScreen", {
//           redirectTo: "DetailScreen",
//           redirectParams: { videoId: item.id },
//         });
//         // navigation.navigate("SubscriptionScreen");
//       },
//     },
//   ],
//   { cancelable: true }
// );
//     return;
// }
  // continue normal flow
  
};
const onClickbookMark = async () => {
  try {
    setBookmarkLoading(true);

    const res = await authService.toggleBookmark(categoryId);
console.log(res, "reeeeeeee");

    // API returns true or false status
    if (res?.status) {
      setIsBookmarked(prev => !prev);
    }

  } catch (error) {
    console.log("Bookmark Error:", error?.response);
  } finally {
    setBookmarkLoading(false);
  }
};
const submitRating = async () => {
  if (rating < 1) {
    Alert.alert(t('rating.rating_required'), t('rating.select_rating_1_to_5'));
    return;
  }

  try {
    setRatingLoading(true);

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    console.log(formData,'formData');
    
  const res = await authService.rattingDocument(categoryId,formData);
    // const res = await authService.post(
    //   `/api/user/documents/${categoryId}/ratings`,
    //   formData,
    //   {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   }
    // );
console.log(res,"ress");

    if (res?.status) {
      Alert.alert(t('common.success'), t('rating.rating_submitted_successfully'));
      setRatingModalVisible(false);
      setRating(0);
      setComment('');
    }
  } catch (error) {
    console.log('Rating Error:', error?.response?.data?.message);
    Alert.alert(t('common.error'), error?.response?.data?.message || t('rating.failed_to_submit_rating'));
  } finally {
    setRatingLoading(false);
  }
};
const onProgress = (data) => {
  if (Platform.OS !== "android") return;

  if (!isSubscribe&&video?.is_paid && !previewEndedRef.current) {
    if (data.currentTime >= PREVIEW_DURATION) {
      previewEndedRef.current = true;

      // 🔥 HARD STOP — UNMOUNT VIDEO
      setPaused(true);
      setShowVideo(false);

      showSubscriptionAlert();
    }
  }
};


const showSubscriptionAlert = () => {
  Alert.alert(
    t('details.payment_required'),
    t('details.payment_message_video'),
    [
      {
        text: t('common.cancel'),
        style: "cancel",
      },
      {
        text: t('common.continue'),
        onPress: () =>{
            navigation.navigate("SubscriptionScreen", {
          redirectTo: "DetailsScreen",
          redirectParams: { videoId: video?.id}
        });
        } 
        //navigation.navigate("SubscriptionScreen"),
      },
    ]
  );
};
  // file_url should be returned by API as the video path; adjust if different (eg. file_path)
  const videoUri = `${BASE_URL}${video?.file_url}`;
const videoTitle = getLocalizedValue(video, 'title', currentLang);
const videoDescription = getLocalizedValue(video, 'description', currentLang);
const categoryName = getLocalizedValue(video?.category, 'name', currentLang);
const subCategoryName = getLocalizedValue(video?.sub_category, 'name', currentLang);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'}/>
      <View style={styles.header}>
  {/* Back */}
  <TouchableOpacity
    onPress={() => {
      sendViewDuration();
      navigation.goBack();
    }}
  >
    <Ionicons name="arrow-back" size={26} color="#000" />
  </TouchableOpacity>

  {/* Title */}
  <Text style={styles.headerTitle}>
    {t("video_details.details_view")}
  </Text>

  {/* 🔍 Search Icon */}
  <TouchableOpacity
    onPress={() => setShowSearchBar(!showSearchBar)}
  >
    <Ionicons name="search-outline" size={24} color="#000" />
  </TouchableOpacity>
</View>
{showSearchBar && (
  <View style={styles.searchContainer}>
    <TextInput
      placeholder="Search in title, description..."
      value={searchQuery}
      onChangeText={(text) => {
        setSearchQuery(text);
        setSearchResult(null);
      }}
      style={styles.searchInput}
    />

    <TouchableOpacity
      style={styles.searchBtn}
      onPress={handleSearch}
    >
      <Ionicons name="search" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
)}
{/* {searchResult === true && (
  <Text style={styles.foundText}>
    ✅ Match Found!
  </Text>
)}

{searchResult === false && (
  <Text style={styles.notFoundText}>
    ❌ No match found
  </Text>
)} */}

       {/* <View style={styles.header}>
              <TouchableOpacity
  onPress={() => {
    sendViewDuration();   // ⏱️ send duration first
    navigation.goBack(); // ⬅️ then go back
  }}
>
  <Ionicons name="arrow-back" size={26} color="#000" />
</TouchableOpacity>
              <Text style={styles.headerTitle}>{t('video_details.details_view')}</Text>
              <View style={{ width: 30 }} />
            </View> */}
      {/* <CustomHeader
        title={t('video_details.details_view')}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
        rightComponent={() => null}
      /> */}
<ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Top Title + Rating */}
<Text style={styles.title}>
  {videoTitle.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      <Text key={i} style={{ backgroundColor: "yellow" }}>
        {part}
      </Text>
    ) : (
      part
    )
  )}
</Text>

        <View style={styles.topRow}>
          <Text style={styles.author}>{t('video_details.by')} M.Jmpot</Text>

             {/* <TouchableOpacity onPress={()=>navigation.navigate('RatingListScreen',{documentId:categoryId})} style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ionicons
                      key={i}
                      name={i <= video?.total_ratings ? 'star' : 'star-outline'}
                      size={16}
                      color="#f4c430"
                    />
                  ))}
                </TouchableOpacity>
             */}
              <View style={styles.rate_container}>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <TouchableOpacity
          style={styles.ratingRow}
            key={i}
            disabled={false}
           onPress={()=>navigation.navigate('RatingListScreen',{documentId:categoryId})}
          >
            <Ionicons
              name={i <= video?.total_ratings ? 'star' : 'star-outline'}
              size={16}
              color="#f4c430"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ⭐ Rating count */}
      <Text style={styles.countText}>
         {video?.total_ratings}/5
      </Text>
    </View>
        </View>

        <Text style={styles.description}>
  {searchQuery
    ? videoDescription
        .split(new RegExp(`(${searchQuery})`, "gi"))
        .map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <Text key={index} style={{ backgroundColor: "yellow" }}>
              {part}
            </Text>
          ) : (
            part
          )
        )
    : videoDescription}
</Text>


        {/* VIDEO + OVERLAYS */}
       <View style={styles.videoWrapper}>
  {showVideo ? (
    <Video
      ref={videoRef}
      source={{ uri: videoUri }}
      style={styles.video}
      resizeMode="cover"
      paused={paused}
      controls={true}
      repeat={false}
      onLoad={onLoad}
      onProgress={onProgress}
    />
  ) : (
    // 🔒 PAYWALL PLACEHOLDER
    <View style={styles.lockedVideo}>
      <Ionicons name="lock-closed" size={48} color="#fff" />
      <Text style={styles.lockText}>
        Subscribe to continue watching
      </Text>
    </View>
  )}
</View>


        {/* Right-side top icons (download + bookmark) - placed visually next to video */}
   <View style={styles.topRow}>
  {/* Left Shuffle Icon */}
  <TouchableOpacity style={styles.shuffleIcon}>
    {/* <Ionicons name="shuffle" size={20} color="#000" /> */}
  </TouchableOpacity>

  {/* Right Icons */}
  <View style={styles.rightTopIcons}>
    <TouchableOpacity  onPress={()=>onClickDownload(video)} style={styles.iconBtn}>
       {downloadLoading ? (
    <ActivityIndicator size={16} color="#000" />
  ) : (
      <Ionicons name="download-outline" size={24} color="#000" />
  )}
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>onClickbookMark()} style={styles.iconBtn}>
      {console.log(isBookmarked)
      }
  {bookmarkLoading ? (
    <ActivityIndicator size={16} color="#000" />
  ) : (
    <Ionicons
      name={isBookmarked||video?.is_bookmarked ? "bookmark" : "bookmark-outline"}
      size={24}
      color="#000"
    />
  )}
</TouchableOpacity>
  </View>
</View>


        {/* Bottom action buttons */}
        <View style={styles.actionsRow}>
          <ActionBtn label={t('video_details.comment')} icon="chatbubble-outline"   count={video?.total_comments}
onPress={() => setCommentVisible(true)}
 />

          <ActionBtn label={t('video_details.share')} icon="share-outline" onPress={()=>handleShare(video)} />
          <ActionBtn label={t('video_details.rate_us')} icon="star-outline"onPress={() => { 
            
            setRatingModalVisible(true)
            }} />
        </View>
      </View>
      <Modal
  visible={ratingModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setRatingModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>

      <Text style={styles.modalTitle}>Rate this Document</Text>

      {/* ⭐ STAR RATING */}
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons
              name={i <= rating ? 'star' : 'star-outline'}
              size={32}
              color="#f4c430"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 📝 COMMENT */}
      <TextInput
        placeholder={t('comments.write_your_comment')}
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.commentInput}
      />

      {/* 💾 BUTTONS */}
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setRatingModalVisible(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={submitRating}
          disabled={ratingLoading}
        >
          {ratingLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal>
{/* <Modal
  visible={commentVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setCommentVisible(false)}
> */}
{commentVisible && (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View style={styles.commentModalOverlay}>
        <View style={styles.commentModalContainer}>
          {/* Header */}
          <View style={styles.commentHeader}>
            <Text style={styles.commentTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setCommentVisible(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Comment Screen */}
          <CommentScreen
            documentId={categoryId}
            onClose={() => setCommentVisible(false)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
)}

{/* </Modal> */}
</ScrollView>
    </View>
  );
}

const ActionBtn = ({ label, icon, count, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
    <Ionicons name={icon} size={18} color="#fff" />
    <Text style={styles.actionLabel}>{label}</Text>

    {count > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    )}
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    //paddingTop: 8,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataText: { fontSize: 18, color: "#777" },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  // topRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginTop: 2,
  // },
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
    marginTop: 4,
    lineHeight: 20,
    fontSize: 14,
  },

  videoWrapper: {
    marginTop: 4,
    width: "100%",
    height: 280,
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
    bottom: 80,
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

  // rightTopIcons: {
  //   marginTop: 2,
  //   // align them on the right row: we place them visually right under video area
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   gap: 8,
  //   marginRight: 6,
  // },
  iconBtn: {
    marginLeft: 14,
  },

  actionsRow: {
    marginTop: 6,
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
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  textAlign: 'center',
  marginBottom: 16,
},

// starRow: {
//   flexDirection: 'row',
//   justifyContent: 'center',
//   marginBottom: 16,
// },

commentInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 10,
  marginTop:10,
  minHeight: 80,
  textAlignVertical: 'top',
},

modalActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},

cancelBtn: {
  paddingVertical: 10,
  paddingHorizontal: 20,
},

cancelText: {
  color: '#666',
  fontSize: 16,
},

saveBtn: {
  backgroundColor: '#000',
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 8,
},

saveText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
badge: {
  position: 'absolute',
  top: -6,
  right: -6,
  backgroundColor: 'red',
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 4,
},
badgeText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '700',
},
rate_container: {
    alignItems: 'center',
    flexDirection:'row'
  },
  starRow: {
    flexDirection: 'row',
  },
  countText: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
    marginLeft:10
  },
  commentModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'flex-end',
},

commentModalContainer: {
  height: '100%',
  backgroundColor: '#fff',
  // borderTopLeftRadius: 16,
  // borderTopRightRadius: 16,
  //overflow: 'hidden',
},

commentHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderBottomWidth: 1,
  borderColor: '#eee',
},

commentTitle: {
  fontSize: 16,
  fontWeight: '700',
},
lockedVideo: {
  flex: 1,
  backgroundColor: "#000",
  justifyContent: "center",
  alignItems: "center",
},
lockText: {
  color: "#fff",
  marginTop: 12,
  fontSize: 16,
},
 header: {
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 25,
  },
searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 15,
  marginTop: 10,
  backgroundColor: "#f2f2f2",
  borderRadius: 10,
  paddingHorizontal: 10,
},

searchInput: {
  flex: 1,
  height: 45,
  fontSize: 14,
},

searchBtn: {
  backgroundColor: "#000",
  padding: 10,
  borderRadius: 8,
},

foundText: {
  marginLeft: 20,
  marginTop: 5,
  color: "green",
  fontWeight: "600",
},

notFoundText: {
  marginLeft: 20,
  marginTop: 5,
  color: "red",
  fontWeight: "600",
},

});

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
//   Share,
//   ScrollView
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import Slider from "@react-native-community/slider";
// import Video from "react-native-video";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CustomHeader from "../components/CustomHeader";
// import { authService } from "../api/authService";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// export default function DetailsScreen({ navigation, route }) {
//   const { categoryId } = route.params || {};

//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [paused, setPaused] = useState(true);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);

//   const [isSeeking, setIsSeeking] = useState(false);
//   const [seekPosition, setSeekPosition] = useState(0);

//   const [isFullScreen, setIsFullScreen] = useState(false); // Fullscreen state

//   const BASE_URL = "http://testlink2.pillersofttechnologies.com";
//   const videoRef = useRef(null);

//   useEffect(() => {
//     fetchDocument();
//   }, []);

//   const fetchDocument = async () => {
//     try {
//       setLoading(true);
//       const res = await authService.getDocumentById(categoryId);
//       setVideo(res.data?.data || null);
//     } catch (err) {
//       console.log("Fetch Error:", err);
//       setVideo(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (sec = 0) => {
//     const s = Math.floor(sec % 60);
//     const m = Math.floor(sec / 60);
//     const mm = m < 10 ? `0${m}` : `${m}`;
//     const ss = s < 10 ? `0${s}` : `${s}`;
//     return `${mm}:${ss}`;
//   };

//   const onLoad = (meta) => setDuration(meta.duration || 0);

//   const onProgress = (progress) => !isSeeking && setCurrentTime(progress.currentTime);

//   const handleSeekComplete = (value) => {
//     setIsSeeking(false);
//     setCurrentTime(value);
//     videoRef.current?.seek(value);
//   };

//   const skipForward = (seconds = 10) => {
//     const to = Math.min((isSeeking ? seekPosition : currentTime) + seconds, duration);
//     videoRef.current?.seek(to);
//     setCurrentTime(to);
//     setSeekPosition(to);
//   };

//   const skipBackward = (seconds = 10) => {
//     const to = Math.max((isSeeking ? seekPosition : currentTime) - seconds, 0);
//     videoRef.current?.seek(to);
//     setCurrentTime(to);
//     setSeekPosition(to);
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: "Hi this is M.Impot!",
//         url: "url",
//         title: "M.Impot",
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
//   if (!video) return <View style={styles.center}><Text>No Data Available</Text></View>;

//   const videoUri = `${BASE_URL}${video?.file_url}`;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//   <CustomHeader
//     title="Details View"
//     leftComponent={
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={26} color="#000" />
//       </TouchableOpacity>
//     }
//   />

//   <ScrollView contentContainerStyle={styles.screenContent}>
    
//     {/* VIDEO BLOCK */}
//     <View style={styles.videoWrapper}>
//       <Video
//         ref={videoRef}
//         source={{ uri: videoUri }}
//         style={styles.video}
//         resizeMode="contain"
//         paused={paused}
//         onLoad={onLoad}
//         controls={true}
//         onProgress={onProgress}
//         controlsStyles={{
//           seekBarColor: "#FF5733",
//           seekBarKnobColor: "#000",
//           seekBarBackgroundColor: "#CCC",
//           showFullScreenButton: false,
//           showPictureInPictureButton: false,
//           showMuteButton: true,
//           showForwardButton: false,
//           showRewindButton: false,
//         }}
//       />
//     </View>

//     {/* TITLE + DESCRIPTION */}
//     <Text style={styles.title}>{video?.title}</Text>
//     <Text style={styles.description}>{video?.description}</Text>

//     {/* SHUFFLE + RIGHT ICONS */}
//     <View style={styles.topRow}>
//       <TouchableOpacity style={styles.shuffleIcon}>
//         <Ionicons name="shuffle" size={22} color="#000" />
//       </TouchableOpacity>

//       <View style={styles.rightTopIcons}>
//         <TouchableOpacity style={styles.iconBtn}>
//           <Ionicons name="download-outline" size={24} color="#000" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.iconBtn}>
//           <Ionicons name="bookmark-outline" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>
//     </View>

//     {/* BOTTOM BUTTONS */}
//     <View style={styles.actionsRow}>
//       <ActionBtn label="Comment" icon="chatbubble-outline" />
//       <ActionBtn label="Share" icon="share-outline" onPress={handleShare} />
//       <ActionBtn label="Rate Us" icon="star-outline" />
//     </View>

//   </ScrollView>
// </SafeAreaView>

//   );
// }

// const ActionBtn = ({ label, icon, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.actionBtn} activeOpacity={0.85}>
//     <Ionicons name={icon} size={18} color="#fff" />
//     <Text style={styles.actionLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   screenContent: {
//     paddingHorizontal: 20,   // ⭐ LEFT + RIGHT CLEAN SPACE
//     paddingBottom: 40,
//   },

//   center: { flex: 1, justifyContent: "center", alignItems: "center" },

//   videoWrapper: {
//     width: "100%",
//     height: 260,
//     backgroundColor: "#000",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginTop: 20,
//   },

//   video: {
//     width: "100%",
//     height: "100%",
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginTop: 18,
//     color: "#000",
//   },

//   description: {
//     fontSize: 15,
//     color: "#444",
//     marginTop: 10,
//     lineHeight: 22,
//   },

//   topRow: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   shuffleIcon: {
//     padding: 8,
//     borderRadius: 25,
//     backgroundColor: "#f1f1f1",
//   },

//   rightTopIcons: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//   },

//   iconBtn: {
//     width: 45,
//     height: 45,
//     borderRadius: 30,
//     backgroundColor: "#f1f1f1",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   actionsRow: {
//     marginTop: 28,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   actionBtn: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//     paddingVertical: 12,
//     width: (SCREEN_WIDTH - 80) / 3,  // equal width buttons with spacing
//     borderRadius: 28,
//   },

//   actionLabel: {
//     color: "#fff",
//     marginLeft: 6,
//     fontSize: 14,
//   },
// });

